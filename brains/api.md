# 5. Web and Mobile API Brain

Hub for **what the clients call**. Mobile JWT, web URLs, FormData keys, and MCP (which must dispatch the same APIs). Parent: [sub brains](README.md). Siblings: [Mobile Code](mobile-code.md) · [Web Code](web-code.md).

**Do not invent** path constants, FormData keys, or credit costs. If a key is not in the dictionary, open the cited screen/controller.

## Read first

1. This file (rules).
2. Catalogs: [12-mobile-api.md](../12-mobile-api.md) · [13-web-urls.md](../13-web-urls.md).
3. Keys: [data/formdata-dictionary.md](../data/formdata-dictionary.md).
4. Screen lifecycle (login, AI V2, publish): [screens/how-it-works.md](../screens/how-it-works.md).
5. Credits before any spend: [09-credits-billing.md](../09-credits-billing.md). MCP names: [14-mcp.md](../14-mcp.md).

## Sources of truth

| Surface | Source |
|---------|--------|
| Mobile path constants | `TerriTool/App/config/index.js` appended to `URL_BASE` (`…/index.php/api/`) |
| All v2 URIs | `webterritool/routes/api.php` |
| Web pages | `webterritool/routes/web.php` |
| FormData keys | Live `formdata.append` / `buildAiFormData` — dictionary above |
| Auth | `Authorization: Bearer {JWT}` except listed public routes |

`APP_VERSION` for checks: `'2.0'`. `IS_STAGING_OR_DEV_BUILD` if `URL_BASE` contains `"staging"`. Live mobile `URL_BASE` in config is **prod**; staging is the commented block.

## Must follow

| Rule | Do this |
|------|---------|
| Mobile post | Multipart **FormData**. JWT is a **header**, not a field. |
| `buildAiFormData` | Skips null/undefined; booleans → `"true"` / `"false"` strings (`aiFindLeads.js`). |
| Route create | `createroute` then poll `simplerouteview` until `route_status === "published"`. Published tab, not Draft. |
| Credit spend | `get_credits` → quote exact cost → wait for yes. No partial spend. |
| AI hits | Search is free. **Save** is 1 credit/company via `save_ai_leads` (preview, then `confirm_all` + token). Never `add_company` for AI search hits. |
| Named person | `add_contact` (free). Not a note. Not `buy_contacts`. |
| High Priority / Gold | `set_company_status`, not a note. |
| MCP | Call tools; never php/curl from the agent. User MCP HTTP `/ai/mcp`. Same Dingo endpoints internally. |

## MCP HTTP (web)

| Server | Path |
|--------|--------|
| User / manager | `/ai/mcp` |
| Admin | `/ai/mcp-admin` |
| Find | `/find-mcp/mcp` |

## Two AI engines (do not mix)

| Who | Engine |
|-----|--------|
| Sales Agent / BSA (user MCP, mobile V2) | User AI Find Leads V2 |
| Manager | Places / manager finder |

Details: [features/07-ai-find-leads.md](../features/07-ai-find-leads.md) · [18-cross-system-flows.md](../18-cross-system-flows.md).
