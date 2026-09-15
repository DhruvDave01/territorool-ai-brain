---
id: decision-log
parent: ops
sources:
  - App/config/index.js
related:
  - 04-style-guide.md
  - 05-constraints-and-drift.md
---
# Decision log

Related: [04-style-guide](../04-style-guide.md) · [05-constraints-and-drift](../05-constraints-and-drift.md)

Durable “why” so agents do not re-litigate. Reopen only with an explicit product/eng decision.

| Date (approx) | Decision | Why / evidence |
|---------------|----------|----------------|
| Ongoing | No Redux | Cross-screen state is `Global.js` + Realm. Zero redux usage in `App/`. |
| Ongoing | Class components | Vast majority of screens extend `Component` / `ValidationComponent`. Do not convert unless asked. |
| Ongoing | NativeBase removed | Use `NativeBaseCompat.js`. Do not add `native-base`. |
| Ongoing | Single native stack | No nested navigators / RN tabs. Footer is `CustomFooter`. |
| Ongoing | Staging vs prod = comment swap | `URL_BASE` in `App/config/index.js`. No flavor matrix / `.env`. |
| Ongoing | Mobile API = FormData | `API.post` multipart + Bearer JWT. |
| Ongoing | JWT pk `"1"` | Single-user device model. |
| Ongoing | MCP does not reimplement business logic | User MCP dispatches `/api/v2`. Credit math stays in Helper/API. |
| Ongoing | `CompanylController` spelling | Extra **l** is load-bearing. New company/lead work often lands there — be surgical. |
| Ongoing | Two AI lead engines | User V2 = city/ZIP Gemini+Places. Manager portal = Places circles. Do not merge casually. |
| Ongoing | MCP `create_route` publishes | Published tab + `route_url`, type `basic`. Not Draft. |
| Ongoing | Save AI leads vs `add_company` | AI hits cost 1 credit via `save_ai_leads`. Manual named account is free `add_company`. |
| Ongoing | Contact buy vs add | Discovery free; paid unlock 2 credits; Claude/biz 1; typed-in person `add_contact` free. |
| Ongoing | ChatGPT truncated catalog | ~16 tools / ~5000 tokens. Cursor/Claude get full User MCP list. |
| Ongoing | Crons are HTTP GET | Not Laravel `schedule()`. |
| Ongoing | Activity wall clock LA | `ACTIVITY_COMPARE_TIMEZONE = America/Los_Angeles`. |
| Ongoing | Map polylines = Mapbox | File still named `googleDirections.js`. |
| 2026 | Manager MCP extras | `list_team`, `get_team_dashboard`, `get_team_activity` + optional `salesperson_id`. Find MCP excludes Business Agent. |
| 2026 | `add_company` / `add_contact` on User MCP | QA playbook that says those tools are missing is **stale**. |
