# 5. Web and Mobile API Brain

Hub for **what clients call**. Parent: [sub brains](README.md). Siblings: [Mobile Code](mobile-code.md) · [Web Code](web-code.md).

**Do not invent** path constants, FormData keys, or credit costs. If a key is missing, open the cited screen/controller.

## Read first

1. This file.
2. [12-mobile-api.md](../12-mobile-api.md) · [13-web-urls.md](../13-web-urls.md).
3. [data/formdata-dictionary.md](../data/formdata-dictionary.md).
4. [screens/how-it-works.md](../screens/how-it-works.md).
5. Credits: [09-credits-billing.md](../09-credits-billing.md). MCP names: [14-mcp.md](../14-mcp.md).

## Sources of truth

| Surface | Source |
|---------|--------|
| Mobile constants | `TerriTool/App/config/index.js` appended to `URL_BASE` |
| Live mobile `URL_BASE` | **prod** `https://app.territool.com/index.php/api/` (staging commented) |
| All v2 URIs | `webterritool/routes/api.php` — `$api->version('v2')`. Config prefix `env('API_PREFIX', null)`. MCP client talks `/api/v2`. |
| JWT group | middleware **`jwt.refresh`** in `routes/api.php` |
| Web pages | `webterritool/routes/web.php` |
| FormData | Live `formdata.append` / `buildAiFormData` in `findLeads/aiFindLeads.js` |
| Auth | `Authorization: Bearer {JWT}` except public list below |

`APP_VERSION` `'2.0'`. Mobile `API.post(url, formdata, props, signal, options)` — JWT is a **header**.

## Public (no `jwt.refresh`)

`authenticate`, `logout`, `login`, `signup`, `mobileregistration`, `renewtoken`, `recovery`, `reset`, `citysearch` (GET+POST), `downloadpdf`, `zapierCompanyCreate`, `zapierContactCreate`, `getcategories`, `getusercontactstage`, `getrestrictuser`, `apollo-webhook`, `leads_user`, `getUsers`, `revenue-subscription-update`, `validate-phone`, `fullenrich-webhook/*`, `revenuecate-success`.

Everything else the app uses (`addcompany`, `createroute`, `simplerouteview`, `getusercredit`, …) is inside the JWT group. Full constant table: [12-mobile-api.md](../12-mobile-api.md).

## Must follow

| Rule | Do this |
|------|---------|
| Mobile post | Multipart **FormData**. |
| `buildAiFormData` | Skip null/undefined; booleans → `"true"` / `"false"` (`findLeads/aiFindLeads.js`). |
| Route create | `createroute` then poll `simplerouteview` until `route_status === "published"`. Also `publishroute` exists on Dingo. Published tab, not Draft. |
| Credit spend | `getusercredit` / MCP `get_credits` → quote → wait. No partial spend. |
| AI search | `getAILeadsV2` / `resumeAILeadSearch` / `getAiLeadData` **free**. |
| AI save | `saveAILeads` **1 credit/company**. MCP `save_ai_leads`: preview, stop, then `confirm_all` + `confirm_token`. Never `add_company` for AI hits. |
| Buy contacts | Live `App/utils/contactBuyCredits.js`: Cognism/FE/Apollo path **2** (`NAME_POSITION_ONLY` and `WITH_EMAIL_OR_PHONE` are both 2). Claude/biz **1** (`CONTACT_BUY_CREDITS_BIZ_CLAUDE`). Older notes that say name-only = 1 are stale — [drift](../05-constraints-and-drift.md). |
| Manual person | `addcontact` / MCP `add_contact` **free**. Not a note. Not `buyContacts`. |
| Status | `updatecompanystatus` / `set_company_status`. |
| MCP | Tools only; never php/curl. Same Dingo endpoints via `CustomerApiClient`. |

## MCP HTTP

| Server | Path | Who |
|--------|--------|-----|
| User / manager | `/ai/mcp` | SA, BSA, Business Agent |
| Admin | `/ai/mcp-admin` | HQ |
| Find | `/find-mcp/mcp` | SA + BSA only (**not** BA) |

User tool names (complete): see [Web Code Brain](web-code.md). Manager extras: `list_team`, `get_team_dashboard`, `get_team_activity`.

## Two AI engines (do not mix)

| Who | Engine | Typical URIs |
|-----|--------|----------------|
| SA / BSA (mobile V2, user MCP) | User AI Find Leads V2 | `getAILeadsV2`, `resumeAILeadSearch`, `saveAILeads` |
| Manager | Places / manager finder | `/manager/api/find-leads*`, `AIFindLeads.jsx` |

## High-traffic JWT URIs (mobile constants)

| Constant | Path |
|---------|------|
| `URL_USER_LOGIN` | `login` |
| `GET_CREDIT_INFO` | `getusercredit` |
| `URL_ADD_COMPANY` | `addcompany` |
| `URL_CREATE_BASIC_ROUTE` | `createroute` |
| `URL_GET_BASIC_ROUTE` | `simplerouteview` |
| `URL_COMPANY_MARKED_VISITED` | `companymarkedvisited` |
| `URL_SAVE_COMPANY_CONTACT` | `buyContacts` |
| `URL_FETCH_FIRST_CONTACT` | `fetchAllContacts` |
| `URL_GET_AI_COMPANIES_V2` | `getAILeadsV2` |
| `URL_AI_BULK_COMPANIES_CREATE` | `saveAILeads` |
| `URL_USER_ADD_CONTACT` | `addcontact` |
| `URL_SAVE_NOTE` | `addnote` |

Dingo also has routes mobile config may not name (`getYelpLeads`, `publishroute`, tickets, …).

## Web URL prefixes

Classic: `/dashboard`, `/company*`, `/contact*`, `/list*`, `/route*`, `/findleads`, `/subscription*`.  
Manager: `/manager/dashboard`, `/manager/ai-find-leads`, `/manager/salespeople*`, `/manager/api/*`.  
HQ: `/hq/*`. Catalog: [13-web-urls.md](../13-web-urls.md).

## Trained if you can

- Pick public vs JWT for a new URI.
- Save AI leads with preview + credit quote, not `addcompany`.
- Charge **2** for paid contact buy and **1** for Claude/biz per `contactBuyCredits.js`.
- Poll `simplerouteview` until published.
