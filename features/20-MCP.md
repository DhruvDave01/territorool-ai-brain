# 20 — MCP and voice (Claude / Cursor / ChatGPT / voice)

## Purpose

The AI-agent surface of TerriTool. An agent (Claude, Cursor, ChatGPT, the voice client, or an in-app custom MCP connection) calls the **same actions** as the browser and the phone — same companies, credits, routes, lists, publish rules — through MCP tools. Agents must use the MCP tools (or the matching catalog action). They do **not** call PHP, SQL, curl, or `/api/v2` directly.

This module used to be split across `05-MCP/` and `08-Example-Conversations/`; it became feature **20** on 2026-09-16, which also fills the former 19 → 21 numbering gap.

## Who

- **Sales Agent / Business Sales Agent** — through the sales-rep MCP (`app/UserMcp`, published as `user-territool-app`) and the Find MCP (`app/FindMcp`).
- **Admin** — through a separate Admin MCP (`app/AdminMcp`) that is HQ-style lookup only; it is not the customer catalog and never exposes `/hq/*` as sales-rep tools.
- **Mobile Voice Mode** (staging and dev builds, 2026-09-29) is a voice client on the phone. It does not call these MCP servers. The phone sends each tool call to a voice server (`voice/tool`). Today that is the reference demo at `VOICE_DEMO_URL`, which runs 22 whitelisted tools against the v2 API as the rep. The planned Laravel `voice/tool` would run the `app/UserMcp/Services/Tools` code. See [22 — Voice Mode](22-Voice-Mode.md).
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
| `buy_contacts` via FullEnrich | **2** per contact | Yes; a second confirm past **25** contacts in one call |
| `buy_contacts` via Claude | **1** per contact | Yes |
| `create_route` / `add_company` with `route_id` | 0 | Publishes the route (never a silent draft) and returns `route_url` |

- `get_credits` before any spend; on insufficient credits a Sales Agent is sent to upgrade / add-on, a Business Sales Agent to their manager.
- Never `add_company` for an AI search hit — that is `save_ai_leads`.
- Collisions that must not be mixed (status vs note, find vs buy, new lead vs saved account) are spelled out in api-surfaces.md §3 and glossary.md.
- The live instruction string the sales-rep server sends to agents is in `app/UserMcp/Services/AppMcpProtocolService.php`; keep it consistent with this module.

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

Chat clients call the MCP servers named in [API](../brains/api.md). The only mobile agent surface is Voice Mode (staging and dev builds): [22 — Voice Mode](22-Voice-Mode.md).

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
