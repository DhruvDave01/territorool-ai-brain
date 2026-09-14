# 5. Durable facts, constraints, known drift

Related: [04-style-guide](04-style-guide.md) · [20-how-to-update](20-how-to-update.md)

Code wins over Prompts and old docs. When they disagree, add a row here.

## 5.1 Constraints

| Constraint | Fact |
|------------|------|
| Mobile Node | `>= 22.11.0` |
| iOS deployment | 15.5 |
| Android | minSdk 24, target 36, Java 17 |
| Web PHP / Laravel | 7.2 / 7.x |
| Front classic | jQuery 2.2.0, Bootstrap 3 |
| Front manager | Vite + React 18 islands; parent layout still AdminLTE (`body.manager-portal`) |
| JWT | `tymon/jwt-auth` 0.5 (require-dev) + Dingo + Passport also registered |
| Cron | Public GET URLs on `CronController`, not `Kernel::schedule()` |
| README web | Stock Laravel README — **not** product docs |
| Single-user device | One JWT row id `"1"` |
| ChatGPT MCP | ~16 tools / ~5000 tokens; truncated catalogs |
| Two AI engines | User V2 city/ZIP vs manager Places circles |

## 5.2 Known drift (docs vs live code)

| Claim in old docs | Live truth |
|-------------------|------------|
| ~30 screens | `App/App.js` registers **~47** named screens |
| TikTok SDK / `TikTokHelper.js` | README/Prompts mention it; **file missing**. AI UI copy may say “Scanning TikTok” |
| Redux | **None** |
| Mobile route PDF | **No** in-app PDF; email share only. Web has TCPDF/dompdf |
| `createOFFLINERoute` | **No call sites**; list screen still **reads** offline blob |
| Yelp on mobile | No Yelp constant in `App/config/index.js`; web/API have `getYelpLeads` |
| MCP playbook “no create company/contact” | **Stale.** User MCP now has `add_company` / `add_contact` |
| Company statuses hard-coded in mobile | **Server-driven** `user_status` / `getuserstatusdetails` |
| Prompts `App.tsx` | Entry is `App/App.js` (JS) |
| package.json Android 4.2.7 | Gradle may be `4.4.70` |

## 5.3 Do not

- Do not use `add_note` for a named person, a status, or a visit-as-CRM-event.
- Do not use `set_company_status` as a note.
- Do not `buy_contacts` for a person the user already knows — `add_contact` is free.
- Do not `add_company` for AI Find Leads hits — `save_ai_leads` (credits).
- Do not tell a voice user to “scroll” or “see next page”.
- Do not point MCP `create_route` at Draft — it **publishes** and returns `route_url`.
- Do not act as Admin tools on the user MCP, or write TerriTool DB from Admin MCP (`read_only`).
