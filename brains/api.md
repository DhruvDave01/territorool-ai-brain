# API

What clients call. Do not invent a path or a FormData key. Every v2 route with its handler, auth group, and mobile constant is in [API endpoints](api-endpoints.md). If it is not there, open the file named here before writing it.

Mobile: [mobile code](mobile-code.md). Web: [web code](web-code.md).

Checked 2026-11-02 against web `master` `d3f75449` (production) and `beta_react` `929f0c7f`, whose `routes/api.php` files are identical, and mobile `TT_80` `daf50eeb` ([review](../reviews/live-code-2026-11-02.md)).

## Sources

| Surface | File |
|---|---|
| Mobile base and path constants | `TerriTool/App/config/index.js` appended to `URL_BASE` |
| Bases | `URL_BASE` is committed as production, `https://app.territool.com/index.php/api/`, on `TT_80` and `Production` (`App/config/index.js:12`). Tests use staging, `https://staging.territool.com/index.php/api/` (commented at `:8`). |
| v2 URIs | `webterritool/routes/api.php` — `$api->version('v2')` |
| JWT | middleware `jwt.refresh` on the authenticated group |
| Web pages | `webterritool/routes/web.php` |
| Mobile post | `API.post(url, formdata, props, signal, options)` — JWT is a header, body is FormData. On `TT_80`, `App/utils/calendarSync.js` sends JSON through it with `{ asJson: true }`. |
| Mobile keys | `App/utils/clientKeys.js` — `fetch` GET `appkeys-<suffix>` (`URL_APP_KEYS`), handled by `AuthController@appKeys` |
| Mobile voice | `App/voice/voiceApi.js` — JSON over `fetch` to `voice/session` and `voice/tool`, on `VOICE_DEMO_URL`, which follows the build. See Voice Mode below. |

## Public (no `jwt.refresh`)

`authenticate`, `logout`, `login`, `signup`, `mobileregistration`, `renewtoken`, `recovery`, `reset`, `citysearch`, `downloadpdf`, `zapierCompanyCreate`, `zapierContactCreate`, `getcategories`, `getusercontactstage`, `getrestrictuser`, `apollo-webhook`, `leads_user`, `getUsers`, `revenue-subscription-update`, `validate-phone`, `fullenrich-webhook/*`, `revenuecate-success`.

Everything else the app uses (`addcompany`, `createroute`, `simplerouteview`, `getusercredit`, …) is inside the JWT group.

## Costs and calls

| Action | Call | Cost |
|---|---|---|
| AI search | `getAILeadsV2`, `resumeAILeadSearch`, `getAiLeadData` | 0 |
| Save AI companies | `saveAILeads` | 1 per company |
| Buy contact | `buyContacts` | 2, or 1 on the Claude/biz path (`contactBuyCredits.js`) |
| Add a person by hand | `addcontact` | 0 |
| Credits | `getusercredit` | 0 |
| Contact counts for Bulk Contacts | `getBulkContactsCompanies` (pages of `per_page`, default 10), then `getClaudeContactCounts` with at most 10 `company_ids[]`; more returns 422 "Provide up to 10 company IDs." (`app/Globals/Helper.php:2149-2156`) | — |
| Create route | `createroute`, then poll `simplerouteview` until `route_status === "published"` | — |
| Mark visited | `companymarkedvisited` | — |
| Note | `addnote` | — |

`buildAiFormData` skips null and undefined. Booleans become the strings `"true"` and `"false"`.

Known issue since 2026-09-29, still on `master`: web commit `abe88426` left `$territoryGeo` unset in `AILeadFinderController::runStage1`, which `getAILeadsV2` runs (`CompanyController.php:3016-3019`). Line 152 calls `geocodeAddressString()` and drops the result, so any request with `radius_miles` gets 422 at `:156-166`. It is a 422, not a 500, because `routes/web.php:14-16` hides PHP notices. Neither `TT_80` nor `Production` sends `radius_miles` any more. The live trigger is the MCP `find_ai_leads` tool for a field rep who passes `radius_miles` (`app/UserMcp/Services/Tools/LeadsTools.php:85-86`), for example from the ChatGPT or Claude plugin. Managers are not affected: their searches go to the manager engine (`LeadsTools.php:76-78`). Typed city and ZIP searches still run. Detail: [live code 2026-11-02](../reviews/live-code-2026-11-02.md).

Do not save an AI hit with `addcompany`. Do not treat `buyContacts` as free.

## MCP

| Server | Path | Who |
|---|---|---|
| User | `/ai/mcp` | Sales Agent, Business Sales Agent, Business Agent |
| Admin | `/ai/mcp-admin` | Admin |
| Find | `/find-mcp/mcp` | Sales Agent and Business Sales Agent only |

Agents call tools. They do not call PHP, SQL, or curl against `/api/v2` from a chat turn. The PHP client that the tools use is `UserMcp/Services/CustomerApiClient.php`.

## Voice Mode (mobile)

Page: [22 — Voice Mode](../features/22-Voice-Mode.md). On in every `TT_80` build (`VOICE_MODE_ENABLED = true`). `Production` has no voice code.

| Call | Method | Body | Reply |
|---|---|---|---|
| `voice/session` (`URL_VOICE_SESSION`) | GET | — | `client_secret`, `expires_at`, `model`, `rep` (`first_name`, `credits`), `history_scope`, `context`, `tool_names` |
| `voice/tool` (`URL_VOICE_TOOL`) | POST | JSON `{ call_id, name, arguments }` | `{ call_id, result, for_model }`. A barred tool is HTTP 403 in the same shape. |

- **Server today:** the voice server at `VOICE_DEMO_URL`, which follows the build (`App/config/index.js:43-45`): `https://stage-territool-voice-demo.vercel.app/` for a staging build, `https://territool-voice-demo.vercel.app/` otherwise. It signs in with a `voice_session` cookie that holds the Realm JWT and profile. It runs the tool against the v2 API as that rep.
- **Laravel:** has no voice route on `master` or `beta_react`. With `VOICE_DEMO_URL` null, the app would send `Authorization: Bearer` to `URL_BASE`.
- **Other calls from the phone:** `App/voice/VoiceSession.js` also calls `hubspot-both-sync` (`:140-141`), `hubspot-last-sync` (`:158`), `simplerouteview` (`:276`), `routelist` (`:357`, `:452`, `:504`) and `updaterouteactive` (`:383`, `:460`, `:511`) through `API`, as FormData.
- **Tools:** the server allows 22 (listed on the feature page). Any other name is a 403. A 403 from `voice/tool` must never go through `API.post`, because it would log the rep out.
- **Audio:** goes straight between the phone and `https://api.openai.com/v1/realtime/calls` over WebRTC, with the 10-minute `client_secret`.
- **Credits:** voice spends none in V1.

Manager Find Leads is a different engine from the mobile V2 search: Places circles, `hunt_engine=manager_portal`, routes under `/manager/api/find-leads`. Do not point a Sales Agent screen at that engine.

## Web prefixes

Classic: `/dashboard`, `/reviews/credits`, `/company`, `/contact`, `/list`, `/route`, `/findleads`, `/subscription`, `/calendar/google/connect`, `/calendar/google/callback` and POST `/calendar/google/sync` (`routes/web.php:253-255`). `/reviews/credits` is session auth. GET renders the page. POST `{ type: g2|ph }` records the attempt on `user_invitees` and does not grant credits. The mobile `invite-user` call is the app equivalent. POST `/company/getClaudeContactCounts` (`routes/web.php:81`) is the web twin of the v2 counts call.

Manager: `/manager/dashboard`, `/manager/ai-find-leads`, `/manager/salespeople`, `/manager/api/*`.

HQ: `/hq/*`. `GET /hq/demo-data?email=` rewrites one manager's team data and has no environment check: [On-call](on-call.md).

Public: the plugin pages `/chatgpt-plugin`, `/claude-plugin` and `/manager-plugin` with their sub-pages (`routes/web.php:20-30`), and `/.well-known/openai-apps-challenge` (`app/UserMcp/routes/app_mcp_wellknown.php:42`). Crons are public GETs, most under `/cron/`; `cron/paid-api-usage` (`routes/web.php:46`) is on `beta_react` only.
