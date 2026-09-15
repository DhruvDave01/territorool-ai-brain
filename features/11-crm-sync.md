---
id: 11-crm-sync
parent: features
sources:
  - app/McpClient/
  - App/utils/hubspotSyncFlight.js
related:
  - 12-mobile-api.md
  - 13-web-urls.md
  - 17-integrations.md
---
# Feature: CRM sync

Related: [12-mobile-api](../12-mobile-api.md) · [13-web-urls](../13-web-urls.md) · [17-integrations](../17-integrations.md)

| CRM | Surface |
|-----|---------|
| HubSpot | Web + mobile `hubspot-last-sync`, `hubspot-companies-sync`, `hubspot-contacts-sync`, `hubspot-both-sync`, `hubspot-sync-error-list`, `hubspotSessionCompanyErrorFix`, `hubspotSessionCompanyDelete`; field mapping |
| Salesforce | `/sfdc`, sync, contactsync, dataloader, Zapier `zapierCompanyCreate` / `zapierContactCreate` |
| KarmaCRM | save key + sync contacts/companies |
| Pipedrive | Cron `syncCompanies`; support historical |
| McpClient | User-connected Salesforce/HubSpot MCP from `/salesperson/mcp/*` (`app/McpClient/`) |

Mobile HubSpot exclusivity: `App/utils/hubspotSyncFlight.js` (Dashboard + `EditStatus`).
