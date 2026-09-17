---
id: 14-mcp
parent: core
sources:
  - webterritool/app/UserMcp/config/territool_app.php
  - app/UserMcp/config/territool_app.php
  - "Services/Tools/{Account,Companies,Contacts,Leads,Manager,Routes}Tools.php"
  - app/AdminMcp/config/mcp.php
  - app/FindMcp/README.md
  - app/FindMcp/skills/find-leads/SKILL.md
related:
  - 06-users-and-roles.md
  - 09-credits-billing.md
  - 15-voice-policy.md
---
# 14. MCP servers and tools

Related: [06-users-and-roles](06-users-and-roles.md) · [09-credits-billing](09-credits-billing.md) · [15-voice-policy](15-voice-policy.md)

Do not invent tools that are not in `webterritool/app/UserMcp/config/territool_app.php`. Live dump: [code/WEB_CODEBASE_BRAIN.md](code/WEB_CODEBASE_BRAIN.md).

## 14.1 User MCP — `territool-app` v1.4.1

- Config: `app/UserMcp/config/territool_app.php`
- Endpoint: `{APP_URL}/ai/mcp`
- OAuth scope `territool:app`, prefix `/ai`, login route `login`
- WRITE-capable; runs **as** the customer
- Allowed: Sales Agent, Business Sales Agent, Business Agent
- Audit: `UserMcpRequestLog`, `UserMcpSearchLog`, `UserMcpToolLog`
- Handlers: `Services/Tools/{Account,Companies,Contacts,Leads,Manager,Routes}Tools.php`

### Field tools

| Tool | Kind | Notes |
|------|------|-------|
| `search_companies` | handler | Saved accounts; max 200/page |
| `view_company` | handler | Profile (hours, website, phone, address) |
| `set_company_status` | handler | High Priority / Gold / etc. Free |
| `add_contact` | handler | Named person, **free** |
| `add_company` | handler | Named account + address/city; optional `route_id` |
| `get_credits` | handler | Before spend |
| `find_contacts` | → `fetchAllContacts` | Free names |
| `find_contacts_bulk` | handler | Counts only, max 10 |
| `add_note` | api `addnote` | |
| `get_notes` | → `getnotes` | |
| `find_ai_leads` | → `getAILeadsV2` | Free search |
| `resume_ai_lead_search` | → `resumeAILeadSearch` | Call once if in progress |
| `save_ai_leads` | handler | Preview always; then `confirm_all` + `confirm_token` |
| `create_route` | handler | Publishes; `route_url`; type **basic** |
| `mark_visited` | handler | |
| `add_activity` | api `addcompanyactivity` | |
| `buy_contacts` | → `buyContacts` | 2 paid / 1 free |
| `next_waypoint` | handler | |
| `get_ai_lead_search` | handler | |
| `view_lists` / `view_list` / `create_list` | handler | Ask list name; else generate |
| `view_routes` / `view_route` / `get_active_route` | handler | Named route → `view_route` |
| `create_route_from_list` | handler | Publishes |
| `view_activities` / `edit_activity` | api | |

**Manager-only** (`manager_tools`): `list_team`, `get_team_territories`, `recommend_lead_distribution`, `get_team_dashboard` (week\|month\|quarter), `get_team_activity`. Optional `salesperson_id` on hunt/route/list tools; omit = self / record owner. Full catalog is **33** tools.

### Agent operating rules

- Call tools directly; never php/curl for customer actions.
- Typos in account names → `search_companies` then `create_route`.
- One company profile → `view_company`.
- Before `create_route`, ask start company, end company, route name; if skipped, omit start/end and generate a name.
- Give the user `route_url`.
- High Priority/Gold → `set_company_status`.
- Named person → `add_contact` (not a note, not `buy_contacts`).
- `save_ai_leads`: always preview, stop, wait; then `confirm_all=true`.
- Never `add_company` for AI search hits.

ChatGPT subsets: `chatgpt_tools` / `chatgpt_manager_tools` (truncated ~16 tools / ~5000 tokens).

## 14.2 Admin MCP — read-only

`/ai/mcp-admin`. Admin role, HQ login. `read_only` on TerriTool DB. Config: `app/AdminMcp/config/mcp.php`. Stdio: `php artisan mcp:stdio`.

`list_sales_agents`, `list_cancelled_subscribers`, `list_active_subscribers`, `list_active_trials`, `list_expired_trials`, `list_cancelled_trial_subscribers`, `list_user_credits`, `get_user_subscription_history`.

## 14.3 Find MCP

`/find-mcp/mcp`. Sales Agent + BSA only (**not** Business Agent). README: `app/FindMcp/README.md`.

Tools: `find_ai_leads`, `resume_ai_lead_search`, `save_ai_leads`, `search_companies`, `find_contacts`, `buy_contacts`, `get_credits`.

Find `save_ai_leads` is a **direct** `saveAILeads` passthrough — **no** preview / `confirm_token` in this catalog (User MCP still requires preview).

Skills: `app/FindMcp/skills/find-leads/SKILL.md`, `find-contacts/SKILL.md`.
