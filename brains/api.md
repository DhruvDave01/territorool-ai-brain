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

Do not save an AI hit with `addcompany`. Do not treat `buyContacts` as free.

## MCP

| Server | Path | Who |
|---|---|---|
| User | `/ai/mcp` | Sales Agent, Business Sales Agent, Business Agent |
| Admin | `/ai/mcp-admin` | Admin |
| Find | `/find-mcp/mcp` | Sales Agent and Business Sales Agent only |

Agents call tools. They do not call PHP, SQL, or curl against `/api/v2` from a chat turn. The PHP client that the tools use is `UserMcp/Services/CustomerApiClient.php`.

Manager Find Leads is a different engine from the mobile V2 search: Places circles, `hunt_engine=manager_portal`, routes under `/manager/api/find-leads`. Do not point a Sales Agent screen at that engine.

## Web prefixes

Classic: `/dashboard`, `/reviews/credits`, `/company`, `/contact`, `/list`, `/route`, `/findleads`, `/subscription`. `/reviews/credits` is session auth. GET renders the page. POST `{ type: g2|ph }` records the attempt on `user_invitees` and does not grant credits. The mobile `invite-user` call is the app equivalent.

Manager: `/manager/dashboard`, `/manager/ai-find-leads`, `/manager/salespeople`, `/manager/api/*`.

HQ: `/hq/*`.
