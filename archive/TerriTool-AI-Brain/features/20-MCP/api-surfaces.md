---
title: "TerriTool surfaces and API contract"
---

# TerriTool surfaces and API contract

Load this with the Bible. It is **not** an OpenAPI spec. Agents must use **MCP tools** (or the matching voice catalog action). Do not call PHP, SQL, curl, or `/api/v2` directly.

Credit rules (same on every surface):

| Action | Credits |
|--------|---------|
| Search / browse / contact **counts** | **0** |
| Save one AI lead | **1** |
| Buy contact via **FullEnrich** | **2** |
| Buy contact via **Claude** | **1** |

Buy is **never free**. Live fetch is FullEnrich then Claude only.

---

## 1. Surfaces (how a client talks to TerriTool)

| Surface | Auth | Talks to | Who |
|---------|------|----------|-----|
| **Browser** | Laravel session cookie | `routes/web.php` | All roles (rep, manager, admin HQ) |
| **iOS / Android** | JWT (`login` / `renewtoken`) | Dingo **v2** in `routes/api.php` | Sales Agent, Business Sales Agent |
| **Customer MCP** (`territool-app`) | OAuth (`territool:app`) | Same v2 logic via internal JWT | Sales Agent, Business Sales Agent, **Active** only |
| **Find MCP** | OAuth | Subset: find/resume/save leads, search companies, find/buy contacts, credits | Same as customer MCP |
| **Admin MCP** | Separate server | HQ-style lookup (agents, plans, credits) | Internal staff — **not** the customer Address Book |
| **Voice / first-party agent** | JWT as the signed-in user | Same catalog actions as MCP, then v2 | Same as mobile |
| **In-app MCP client** | Settings → connect a remote MCP | Fetch / Send / Update chat | Rep Settings |

v1 JSON API is **dead**. Do not document or call it.

MCP User server lives under `{APP_URL}/ai` (transport `{APP_URL}/ai/mcp`). Find MCP: `{APP_URL}/find-mcp/mcp`. Admin MCP is a different prefix (`/ai/mcp-admin`).

ChatGPT often keeps only **16 tools**. Cursor/Claude get the full customer catalog.

---

## 2. Customer MCP action → v2 name

Names only. Do not invent extra fields. Composite tools may write the DB or publish after the v2 call; the **product result** still matches the app.

| MCP / voice action | Credits | v2 URI or how it runs |
|--------------------|---------|------------------------|
| `search_companies` | 0 | Direct Address Book search (not a v2 list dump) |
| `set_company_status` | 0 | Direct status update (same labels as Settings) |
| `add_company` | 0 | Direct create (Places geocode). Optional `route_id` re-optimizes and **publishes** |
| `add_contact` | 0 | Direct Create Contact. Not a buy |
| `get_credits` | 0 | `GET getusercredit` |
| `find_contacts` | 0 | `POST fetchAllContacts`; empty → `POST fetchClaudeContact` |
| `find_contacts_bulk` | 0 | Counts only, max **10** companies per call |
| `add_note` | 0 | `POST addnote` |
| `get_notes` | 0 | `POST getnotes` |
| `find_ai_leads` | 0 | `POST getAILeadsV2` |
| `resume_ai_lead_search` | 0 | `POST resumeAILeadSearch` |
| `get_ai_lead_search` | 0 | MCP search snapshot (preview). Save with `save_ai_leads` |
| `save_ai_leads` | **1 each** | Preview first. After yes: `POST saveAILeads` with `confirm_all` + `confirm_token`. Never `add_company` |
| `create_route` | 0 | `POST createroute` then **publish** + active. Returns `route_url` (Published tab, not Draft) |
| `create_route_from_list` | 0 | `POST generateroute` then **publish**. Returns `route_url` |
| `view_lists` | 0 | `GET getlist` |
| `create_list` | 0 | `POST createList` |
| `view_routes` | 0 | `GET routelist` |
| `view_route` | 0 | Direct ordered stops |
| `get_active_route` | 0 | Direct active route |
| `mark_visited` | 0 | `POST addcompanyvisittime` (on a route stop) |
| `next_waypoint` | 0 | First unvisited stop on the active route |
| `add_activity` | 0 | `POST addcompanyactivity` |
| `view_activities` | 0 | `POST getcompanyactivities` |
| `edit_activity` | 0 | `POST updatecompanyactivity` |
| `buy_contacts` | **2** FullEnrich / **1** Claude | `POST buyContacts`. Confirm first. Never free |

ChatGPT subset (order matters): `search_companies`, `set_company_status`, `add_contact`, `add_company`, `get_credits`, `find_contacts`, `find_contacts_bulk`, `add_note`, `find_ai_leads`, `resume_ai_lead_search`, `save_ai_leads`, `create_route`, `mark_visited`, `add_activity`, `buy_contacts`, `next_waypoint`.

---

## 3. Collisions (never mix these)

| User meant | Use | Never |
|------------|-----|-------|
| New businesses I don’t have | `find_ai_leads` | `search_companies`, `add_company` |
| Accounts already in TerriTool | `search_companies` | `find_ai_leads` |
| Save AI search hits | `save_ai_leads` | `add_company` |
| Named person I already know | `add_contact` | `buy_contacts`, `add_note` |
| Who works there (discover) | `find_contacts` | `add_contact`, `buy_contacts` |
| Unlock / redeem people | `buy_contacts` | treat as free |
| Gold / High Priority | `set_company_status` | `add_note` |
| Driving next stop | `next_waypoint` | `mark_visited` unless they said check in |
| Make a route | `create_route` | leave it Draft |

---

## 4. Agent-facing errors (speak these, don’t invent a workaround)

| Situation | What to tell the user |
|-----------|------------------------|
| Not enough credits (Sales Agent) | Upgrade or buy a credits add-on. RevenueCat users manage the plan on that provider, not Stripe. |
| Not enough credits (Business Sales Agent) | Contact your manager. Do **not** send them to Stripe. |
| `save_ai_leads` first call | Preview only. List companies + credit cost. Stop. After they agree, call again with `confirm_all=true` and `confirm_token`. |
| Website missing on Find Contacts | Ask them to add a website on the company, then retry. Search/counts stay free. |
| MCP Chat “not connected” | Connect the MCP in Settings first. |
| Route create with one company | Need at least two companies. |
| No active route | They must set a **Published** route active before “next stop”. |
| Status label unknown | Use their Settings labels (defaults include Active, High Priority, Idle, Potential, Reject, Unclassified, optional Gold). |

Typical v2/MCP payload: `status` `1` = ok, `0` = fail, `2` = fail. Some note/activity endpoints historically return `status: 0` with a success message; MCP already normalizes those.

---

## 5. Do not call (poison / not a user action)

Do **not** put these in the brain as live product APIs:

| Name | Why |
|------|-----|
| `getApolloContact`, `redeemApolloContact`, `apollo-webhook` | Dead. UI may still say “Apollo”; live fetch is FullEnrich + Claude |
| `getCongnismContact`, `redeemCongnismContact` | Dead |
| `getBizpediaContact` | Dead |
| `getOpencorporatesCompany`, `getOpencorporatesContact`, `fetchOpencorporatesCompany` | Not live contact fetch |
| Entire Dingo **v1** | Dead |
| `fullenrich-webhook*`, `revenue-subscription-update`, `revenuecate-success` | Provider **callbacks**. Complete work the user already started |
| `zapierCompanyCreate`, `zapierContactCreate` | Legacy / sensitive |
| Unauthenticated HTTP crons | System only |
| Admin HQ routes (`/hq/*`) | Admin role only |
| `.env`, API keys, Client Secrets | Never |

Mobile still has leftover v2 names for those dead providers. Ignore them.

---

## 6. Inbound webhooks (system, not agent tools)

| Callback | Completes |
|----------|-----------|
| FullEnrich single + bulk | Contact buy already started (**2** credits) |
| RevenueCat subscription / product change | Plan and credit window |

Credit jobs must stay idempotent (no double grant).

---

## 7. Field-day extras (same data, extra v2 names)

Same companies/routes/credits as web. Extra because the user is driving:

- Active route (`getuseractiveroute`)
- Navigate Me
- Offline copy of the active route
- Bookmark a stop
- Device token / push / app version
- Scan QR, invite user
- Share route by email
- CSV import error repair (`uploaderror/*`)

HubSpot sync also exists on v2 (`hubspot-*-sync`). Native Salesforce / HubSpot / Karma **connect screens** are web Settings (module 13), not MCP tools.

---

## 8. Copy that must not override the Bible

| What you may see | What is true |
|------------------|--------------|
| “Finding data from Apollo” | Live providers: **FullEnrich** then **Claude** |
| MCP `buy_contacts` text “1 credit free” | Claude costs **1** credit. Still a buy. Never free |
| Find MCP README “2 paid / 1 free” | Same: **2** FullEnrich / **1** Claude |
| MCP Salesforce in Settings | That is **custom MCP**, not native Salesforce OAuth |

---

## Related

- Product modules: [features/README.md](../README.md) — especially [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/MODULE.md), [14-Settings-Profile](../14-Settings-Profile/MODULE.md), [18-Clients](../18-Clients/MODULE.md), [19-Cron-Jobs-Webhooks](../19-Cron-Jobs-Webhooks/MODULE.md)
- This feature: [MODULE.md](MODULE.md), [use-cases.md](use-cases.md), [flows.md](flows.md), [limits.md](limits.md), [conversations.md](conversations.md)
- Terms: [glossary.md](../../product/glossary.md)
- Who can do what: [roles.md](../../product/roles.md)
- Spoken examples: [example-utterances.md](example-utterances.md)
