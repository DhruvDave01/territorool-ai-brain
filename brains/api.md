# API

What clients call. Do not invent a path or a FormData key. Every v2 route with its handler, auth group, and mobile constant is in [API endpoints](api-endpoints.md). If it is not there, open the file named here before writing it.

Mobile: [mobile code](mobile-code.md). Web: [web code](web-code.md).

## Sources

| Surface | File |
|---|---|
| Mobile base and path constants | `TerriTool/App/config/index.js` appended to `URL_BASE` |
| Live base | `https://staging.territool.com/index.php/api/` |
| v2 URIs | `webterritool/routes/api.php` — `$api->version('v2')` |
| JWT | middleware `jwt.refresh` on the authenticated group |
| Web pages | `webterritool/routes/web.php` |
| Mobile post | `API.post(url, formdata, props, signal, options)` — JWT is a header, body is FormData |
| Mobile voice | `App/voice/voiceApi.js` — JSON over `fetch` to `voice/session` and `voice/tool`, on `VOICE_DEMO_URL` in staging and dev builds. See Voice Mode below. |

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
| Create route | `createroute`, then poll `simplerouteview` until `route_status === "published"` | — |
| Mark visited | `companymarkedvisited` | — |
| Note | `addnote` | — |

`buildAiFormData` skips null and undefined. Booleans become the strings `"true"` and `"false"`.

Known issue from 2026-09-29: web commit `abe88426` left `$territoryGeo` unset in `AILeadFinderController`, which `getAILeadsV2` runs. Every search that sends `radius_miles` now fails. The mobile chat sends it on every map-circle search. Typed city and ZIP searches still run. Detail: [live code 2026-09-29](../reviews/live-code-2026-09-29.md).

Do not save an AI hit with `addcompany`. Do not treat `buyContacts` as free.

## MCP

| Server | Path | Who |
|---|---|---|
| User | `/ai/mcp` | Sales Agent, Business Sales Agent, Business Agent |
| Admin | `/ai/mcp-admin` | Admin |
| Find | `/find-mcp/mcp` | Sales Agent and Business Sales Agent only |

Agents call tools. They do not call PHP, SQL, or curl against `/api/v2` from a chat turn. The PHP client that the tools use is `UserMcp/Services/CustomerApiClient.php`.

## Voice Mode (mobile)

Page: [22 — Voice Mode](../features/22-Voice-Mode.md). Staging and dev builds only.

| Call | Method | Body | Reply |
|---|---|---|---|
| `voice/session` (`URL_VOICE_SESSION`) | GET | — | `client_secret`, `expires_at`, `model`, `rep` (`first_name`, `credits`), `history_scope`, `context`, `tool_names` |
| `voice/tool` (`URL_VOICE_TOOL`) | POST | JSON `{ call_id, name, arguments }` | `{ call_id, result, for_model }`. A barred tool is HTTP 403 in the same shape. |

- **Server today:** the reference voice server, `VOICE_DEMO_URL = 'https://territool-voice-demo.vercel.app/'`. It signs in with a `voice_session` cookie that holds the Realm JWT and profile. It runs the tool against the v2 API as that rep.
- **Laravel:** has no voice route yet. With `VOICE_DEMO_URL` null, the app would send `Authorization: Bearer` to `URL_BASE`.
- **Tools:** the server allows 22 (listed on the feature page). Any other name is a 403. A 403 from `voice/tool` must never go through `API.post`, because it would log the rep out.
- **Audio:** goes straight between the phone and `https://api.openai.com/v1/realtime/calls` over WebRTC, with the 10-minute `client_secret`.
- **Credits:** voice spends none in V1.

Manager Find Leads is a different engine from the mobile V2 search: Places circles, `hunt_engine=manager_portal`, routes under `/manager/api/find-leads`. Do not point a Sales Agent screen at that engine.

## Web prefixes

Classic: `/dashboard`, `/reviews/credits`, `/company`, `/contact`, `/list`, `/route`, `/findleads`, `/subscription`. `/reviews/credits` is session auth. GET renders the page. POST `{ type: g2|ph }` records the attempt on `user_invitees` and does not grant credits. The mobile `invite-user` call is the app equivalent.

Manager: `/manager/dashboard`, `/manager/ai-find-leads`, `/manager/salespeople`, `/manager/api/*`.

HQ: `/hq/*`.
