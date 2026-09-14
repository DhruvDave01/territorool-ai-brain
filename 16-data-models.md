# 16. Data models

Related: [10-mobile-app](10-mobile-app.md) · [11-web-backend](11-web-backend.md) · [09-credits-billing](09-credits-billing.md)

## MySQL (web)

| Model | Table |
|-------|-------|
| `User` | `users` (`parent_id`, Spatie roles, `yelp_leads`, `status`) |
| `Company` | `companies` |
| `Contacts` | `contacts` |
| `Notes` | `company_notes` |
| `Activity` | `activities` |
| `LogMeeting` | `log_meetings` |
| `UserRoute` | `user_routes` |
| `UserCompanies` | `user_route_companies` |
| `UserRouteClusters` | `user_route_clusters` |
| `UserList` / `UserListCompanies` / `UserListRoute` | `user_lists` / `user_list_companies` / `user_list_route` |
| `Subscription` | `user_packages` |
| `Package` / add-ons | `packages`, `packages_addons`, `user_package_addons` |
| `UserCredit*` | `user_credits`, `user_credit_charge`, `user_credit_card` |
| `UserContactsCredit*` | `user_contacts_credits`, `user_contacts_credit_charge` |
| `BusinessclientSalesagentCredit` | `businessclient_salesagent_credits` |
| `UserAISearch` | `user_ai_search` |
| `UserVisitedCompanies` | `user_visited_companies` |
| `ShareRouteList` | `share_route_list` |
| `SupportTicket` | `support_ticket` |
| `Cities` / `Countries` / `UserCities` | `cities`, `countries`, `user_cities` |
| Session CSV | `user_session`, `companies_session`, `contacts_session`, `company_notes_session`, `user_companies_session` |
| HubSpot | `HubspotMapping`, `HubspotSyncDetail` |
| Claude | `claude_contact_lookups` |
| Statuses | `user_status`, `user_contact_stage` |
| Roles | `roles`, `role_users` |
| User MCP audit | `UserMcpRequestLog`, `UserMcpSearchLog`, `UserMcpToolLog` |

Mongo: `Models/MongoDB/{City,Country,Location,TestModel}.php`.

## Realm (mobile)

`App/storage/realm.js` schemaVersion **18**. `App/storage/fcmrealm.js` schemaVersion **1**.

**JWTToken** (pk `id`): `id`, `value`, `name`, `notifi_count`, `user_id`, `email`, `country`, `domain`, `env`, `role`, `is_register`, `is_production`.

**offlineRoute** (pk `id`): `id`, `value`, `data` (JSON string).

**TourSchema** (pk `id`): `id`, `create_route`, `edit_route`, `company_detail`, `fetch_contact`, `notes`.

**AIFindLeads** (pk `id`): `id`, `website`, `city`, `territoryMode` (optional `"city"`\|`"zip"`), `sellDetails`, `aiResponse`, `aiLeads`.

**FCMNotication** (pk `id` int): `id`, `notification_title`, `notification_desc`.
