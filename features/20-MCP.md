# 20 — MCP and voice (Claude / Cursor / ChatGPT / voice)

## Purpose

The AI-agent surface of TerriTool. An agent (Claude, Cursor, ChatGPT, the voice client, or an in-app custom MCP connection) calls the **same actions** as the browser and the phone — same companies, credits, routes, lists, publish rules — through MCP tools. Agents must use the MCP tools (or the matching catalog action). They do **not** call PHP, SQL, curl, or `/api/v2` directly.

This module used to be split across `05-MCP/` and `08-Example-Conversations/`; it became feature **20** on 2026-09-16, which also fills the former 19 → 21 numbering gap.

## Who

- **Sales Agent / Business Sales Agent** — through the sales-rep MCP (`app/UserMcp`, published as `user-territool-app`) and the Find MCP (`app/FindMcp`).
- **Admin** — through a separate Admin MCP (`app/AdminMcp`) that is HQ-style lookup only; it is not the customer catalog and never exposes `/hq/*` as sales-rep tools.
- **Mobile Voice Mode** (TT_80 only; the store build has no Voice Mode) is a voice client on the phone. Since `ce2104d0` it is on in every TT_80 build (`VOICE_MODE_ENABLED = true`, `App/config/index.js:34`). It does not call these MCP servers. The phone sends each tool call to a voice server (`voice/tool`). Today that is the reference demo at `VOICE_DEMO_URL`, a staging copy for staging and dev builds and a production copy otherwise (`App/config/index.js:43-45`, `85b58f60`), which runs 22 whitelisted tools against the v2 API as the rep. Laravel still has no `voice/tool` route on master. The planned Laravel `voice/tool` would run the `app/UserMcp/Services/Tools` code. See [22 — Voice Mode](22-Voice-Mode.md).
- **In-app custom MCP connectors** (Settings → MCP Chat / MCP Sync) are a different thing: the *user* connects an external MCP server to TerriTool. That lives in 13-CRM-Integrations / 14-Settings-Profile, not here.

## The three servers

| Server | Code | What it exposes |
|---|---|---|
| Sales-rep MCP | `app/UserMcp` | Companies, contacts, notes/activities, find & save AI leads, routes, lists, credits — the full catalog in api-surfaces.md §2 |
| Find MCP | `app/FindMcp` | Lead and contact discovery skills (`skills/find-leads`, `skills/find-contacts`) |
| Admin MCP | `app/AdminMcp` | HQ-style lookups (agents, plans, credits) for staff — see api-surfaces.md §1 and §5 |

All three register OAuth discovery, token and MCP HTTP endpoints; the exact routes are in ROUTEMAP.md under **MCP servers**.

## Credit and confirm rules (same as every other client)

| Action | Credits | Confirm |
|---|---|---|
| Search, browse, contact **counts** | **0** | No |
| `save_ai_leads` | **1** per lead | Always two calls: preview, then `confirm_all=true` + `confirm_token` |
| `buy_contacts` via FullEnrich | **2** per contact | Always two calls: preview, then `confirm_all=true` + `confirm_token` + a new `idempotency_key`. 1–100 `contact_ids` per call; there is no extra step past 25 (removed in `e1c48937`) |
| `buy_contacts` via Claude | **1** per contact | Same as FullEnrich |
| `create_route` / `add_company` with `route_id` | 0 | Publishes the route (never a silent draft) and returns `route_url` |

- `get_credits` before any spend; on insufficient credits a Sales Agent is sent to upgrade / add-on, a Business Sales Agent to their manager.
- Never `add_company` for an AI search hit — that is `save_ai_leads`.
- Collisions that must not be mixed (status vs note, find vs buy, new lead vs saved account) are spelled out in api-surfaces.md §3 and glossary.md.
- The live instruction string the sales-rep server sends to agents is in `app/UserMcp/Services/AppMcpProtocolService.php`; keep it consistent with this module.

## Sales-rep server since 29 September (read 2026-11-02)

All of this is on master (production web) and beta_react. Two later commits are beta_react only: `dc07b901` (paid-API usage email, see [19](19-Cron-Jobs-Webhooks.md)) and `929f0c7f` (telemetry moves to Sentry). Source: [live code 2026-11-02](../reviews/live-code-2026-11-02.md).

- **Endpoint and protocol.** `/ai/mcp` (`POST`, `GET`, `DELETE`; `app/UserMcp/routes/app_mcp.php:59-61`). `server/discover` returns `supportedVersions` `2026-07-28` and `2024-11-05`, while `initialize` still answers `2024-11-05` (`app/UserMcp/Services/AppMcpProtocolService.php:176-225`; `93c45795`, `efbfced1`). Calls without a session are allowed only for `server/discover` or a request marked `2026-07-28` (`:147-158`).
- **Sessions** now expire after 3600 s (`app/UserMcp/Services/AppMcpSessionManager.php`, `58801446`). Before, Laravel 5.3 read `Cache::put(..., 3600)` as 3600 minutes.
- **Retry protection.** `app/UserMcp/Services/McpOperationGuard.php` (`58801446`) guards `find_ai_leads`, `save_ai_leads`, `buy_contacts`, `create_route` and `create_route_from_list` when the call carries an `idempotency_key` (8–128 letters, digits, `_` or `-`). Each claim is a row in `user_mcp_operations` (migration `app/UserMcp/database/migrations/2026_10_05_120000_create_user_mcp_operations_table.php`). The same key returns the stored result; changed arguments return `idempotency_conflict`; a key still pending returns `operation_pending`. If the tool throws or the request dies, the row stays `pending` and nothing clears it, so every retry with that key gets `operation_pending` (`:45-71`). If the table is missing, `save_ai_leads` and `buy_contacts` are blocked with `server_misconfigured` and the other three run unguarded (`:33-44`). Whether production has run this migration was not checked.
- **`buy_contacts`.** The preview returns a `confirm_token` that lasts 15 minutes (`app/UserMcp/Services/Tools/ContactsTools.php:389-393`). The execute call needs `confirm_all=true`, that token and an `idempotency_key` (`AppMcpProtocolService.php:529-531`). `contact_ids` come from a `find_contacts` discovery, which lasts 30 minutes (`ContactsTools.php:1266`), 1–100 per call (`:350-352`). It queues `buyContactsAsync` → `BuyContactsBulkJob` (`:430`) and returns a `job_id`; poll `get_contact_purchase_status` until `done` is true.
- **Route timeouts.** `create_route` runs `app/Globals/Routes.php`. Up to 80 points it calls GraphHopper with a 120 s timeout (`:100-103`, `:272`; `9a166987`). Larger routes call the jsprit endpoint with no time limit (`:140`, set back to 0 in `fd9c9e4f`). The tool text asks agents to keep a route to 15 stops and to call `view_routes` before retrying a timed-out create.
- **Telemetry.** `app/UserMcp/Services/UserMcpTelemetry.php` (`2d0f4d55`) records `user_mcp_tool_executed`, `user_mcp_api_called`, `user_mcp_api_exception` and `user_mcp_contact_purchase_finished`. master sends them to PostHog. beta_react (`929f0c7f`) sends each as a Sentry `captureMessage` at info level.
- **Plugins and pages.** Packages in `plugins/` (version from each folder's `plugin.json`, or `.claude-plugin/plugin.json` for the Claude ones): `territool` 1.0.4; `territool-chatgpt-field-sales` and `territool-chatgpt-managers` 1.0.2; `territool-claude-field-sales` and `territool-claude-managers` 1.0.0. Pages `/chatgpt-plugin` and `/claude-plugin`, each with `/v2`, `/field-sales`, `/manager`, `/privacy` and `/terms` (`routes/web.php:20-27`). `/.well-known/openai-apps-challenge` serves env `TERRITOOL_APP_OPENAI_APPS_CHALLENGE` as plain text and returns 404 while it is unset (`app/UserMcp/routes/app_mcp_wellknown.php:42`).
- **Known bug: field-rep `find_ai_leads` with `radius_miles`.** `app/UserMcp/Services/Tools/LeadsTools.php:85-86` passes the radius to `getAILeadsV2`. `app/Http/Controllers/AILeadFinderController.php:152` geocodes and drops the result, so `$territoryGeo` is never set and line 156 returns 422 "Could not map "{city}" to a map location. Use a US city and state (Alameda, CA) or a 5-digit ZIP (94501)." It is a 422, not a 500, because `routes/web.php:14-16` hides PHP notices. The same call without `radius_miles` runs, and the tool schema already tells field reps to omit it. Managers go through `findManagerPortalLeads` (`LeadsTools.php:77`) and are not affected. Mobile no longer sends a radius (`5865546a`, in Production).

## Files in this feature

| File | What |
|---|---|
| api-surfaces.md | Auth by surface, MCP → v2 names, collisions, agent-facing errors, do-not-call list, inbound webhooks |
| example-utterances.md | Spoken / typed lines mapped to catalog actions |
| conversations.md | 12 multi-turn transcripts applying the rules — sequencing and tone, no new facts |
| use-cases.md | Tool → cost → use-case table (former §15) |
| flows.md | MCP agent lead-to-route flow and the agent use-case map |
| flows/chatgpt-setup-index-spec.md | Public `/chatgpt-plugin` landing: install MCP → create Project → use MCP |
| limits.md | Tool budget, confirm mechanics, MCP status codes |

## Rules for new work

- A new tool must map to an existing controller action; no parallel credit math.
- Writes that spend credits or publish keep the preview → confirm shape.
- Extend `api-surfaces.md` §2 and this module in the same change as the code.

## Related

**Modules** — 03-Company-AddressBook, 04-Contacts, 05-Find-Leads, 07-Routes, 08-Lists, 09-Contact-Enrichment-Credits, 14-Settings-Profile, 17-Admin-HQ, 18-Clients

**This feature** — Use cases, Flows, Limits, API surfaces, Example utterances, Conversations, Evidence

**Code** — ROUTEMAP.md (look for the **MCP servers** section (`App\UserMcp`, `App\FindMcp`, `App\AdminMcp`)), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | Still | Primary action |
|---|---|---|---|
| Classic web | MCP connections on `/settings` | feature-evidence 20 flows | Connect, refresh tools |

Chat clients call the MCP servers named in [API](../brains/api.md). The only mobile agent surface is Voice Mode, on TT_80 only (store users do not have it yet): [22 — Voice Mode](22-Voice-Mode.md).

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [chatgpt-setup-index-desktop.png](<../screenshots/feature-evidence/20-MCP/evidence/chatgpt-setup-index-desktop.png>)
- [chatgpt-setup-index-mobile.png](<../screenshots/feature-evidence/20-MCP/evidence/chatgpt-setup-index-mobile.png>)
- [14-mcp-agent-lead-to-route.png](<../screenshots/feature-evidence/20-MCP/flows/png/14-mcp-agent-lead-to-route.png>)
- [uc-mcp-agent.png](<../screenshots/feature-evidence/20-MCP/flows/png/uc-mcp-agent.png>)

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
