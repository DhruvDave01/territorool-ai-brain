---
title: "20 — MCP and voice (Claude / Cursor / ChatGPT / voice)"
---

# 20 — MCP and voice (Claude / Cursor / ChatGPT / voice)

## Purpose

The AI-agent surface of TerriTool. An agent (Claude, Cursor, ChatGPT, the voice client, or an in-app custom MCP connection) calls the **same actions** as the browser and the phone — same companies, credits, routes, lists, publish rules — through MCP tools. Agents must use the MCP tools (or the matching catalog action). They do **not** call PHP, SQL, curl, or `/api/v2` directly.

This module used to be split across `05-MCP/` and `08-Example-Conversations/`; it became feature **20** on 2026-09-16, which also fills the former 19 → 21 numbering gap.

## Who

- **Sales Agent / Business Sales Agent** — through the sales-rep MCP (`app/UserMcp`, published as `user-territool-app`) and the Find MCP (`app/FindMcp`).
- **Admin** — through a separate Admin MCP (`app/AdminMcp`) that is HQ-style lookup only; it is not the customer catalog and never exposes `/hq/*` as sales-rep tools.
- **In-app custom MCP connectors** (Settings → MCP Chat / MCP Sync) are a different thing: the *user* connects an external MCP server to TerriTool. That lives in [13-CRM-Integrations](../13-CRM-Integrations/MODULE.md) / [14-Settings-Profile](../14-Settings-Profile/MODULE.md), not here.

## The three servers

| Server | Code | What it exposes |
|---|---|---|
| Sales-rep MCP | `app/UserMcp` | Companies, contacts, notes/activities, find & save AI leads, routes, lists, credits — the full catalog in [api-surfaces.md](api-surfaces.md) §2 |
| Find MCP | `app/FindMcp` | Lead and contact discovery skills (`skills/find-leads`, `skills/find-contacts`) |
| Admin MCP | `app/AdminMcp` | HQ-style lookups (agents, plans, credits) for staff — see [api-surfaces.md](api-surfaces.md) §1 and §5 |

All three register OAuth discovery, token and MCP HTTP endpoints; the exact routes are in [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) under **MCP servers**.

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
- Collisions that must not be mixed (status vs note, find vs buy, new lead vs saved account) are spelled out in [api-surfaces.md](api-surfaces.md) §3 and [glossary.md](../../product/glossary.md).
- The live instruction string the sales-rep server sends to agents is in `app/UserMcp/Services/AppMcpProtocolService.php`; keep it consistent with this module.

## Files in this feature

| File | What |
|---|---|
| [api-surfaces.md](api-surfaces.md) | Auth by surface, MCP → v2 names, collisions, agent-facing errors, do-not-call list, inbound webhooks |
| [example-utterances.md](example-utterances.md) | Spoken / typed lines mapped to catalog actions |
| [conversations.md](conversations.md) | 12 multi-turn transcripts applying the rules — sequencing and tone, no new facts |
| [use-cases.md](use-cases.md) | Tool → cost → use-case table (former §15) |
| [flows.md](flows.md) | MCP agent lead-to-route flow and the agent use-case map |
| [flows/chatgpt-setup-index-spec.md](flows/chatgpt-setup-index-spec.md) | Public `/chatgpt-plugin` landing: install MCP → create Project → use MCP |
| [limits.md](limits.md) | Tool budget, confirm mechanics, MCP status codes |

## Rules for new work

- A new tool must map to an existing controller action; no parallel credit math.
- Writes that spend credits or publish keep the preview → confirm shape.
- Extend `api-surfaces.md` §2 and this module in the same change as the code.

## Related

**Modules** — [03-Company-AddressBook](../03-Company-AddressBook/MODULE.md), [04-Contacts](../04-Contacts/MODULE.md), [05-Find-Leads](../05-Find-Leads/MODULE.md), [07-Routes](../07-Routes/MODULE.md), [08-Lists](../08-Lists/MODULE.md), [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [14-Settings-Profile](../14-Settings-Profile/MODULE.md), [17-Admin-HQ](../17-Admin-HQ/MODULE.md), [18-Clients](../18-Clients/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Limits](limits.md), [API surfaces](api-surfaces.md), [Example utterances](example-utterances.md), [Conversations](conversations.md), [Evidence](evidence.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for the **MCP servers** section (`App\UserMcp`, `App\FindMcp`, `App\AdminMcp`)), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [glossary.md](../../product/glossary.md), [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
