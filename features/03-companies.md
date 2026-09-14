# Feature: Companies (Address Book)

Related: [04-notes](04-notes.md) · [06-contacts](06-contacts.md) · [07-vocabulary](../07-vocabulary.md) · [12-mobile-api](../12-mobile-api.md)

## What it does

Saved accounts. List, map, CRUD, status, bookmark on route, report, navigate, mark visited, bulk CSV, business-card scan.

## Mobile screens

| Screen | File |
|--------|------|
| List + map | `company/list.js` `ListCompany` — `companylist` / `companylistmap` |
| View | `company/view.js` → embeds `CustomCompany` |
| Create / Edit | `company/create/index.js`, `company/edit.js` |
| Shared sheet | `customcompany/index.js` (~5k+ LOC) |
| Business card | `company/businessCard/index.js` + `geminiBusinessCard.js` |

Status colors/labels are **server-driven** via `getuserstatusdetails` / `updatecompanystatus` — not hard-coded Gold/HP enums in the client.

## APIs

`addcompany`, `updatecompany`, `removeCompanies`, `companydetail`, `companynamelist`, `bulk-companies-create`, `selectallcompany`, `updatecompanystatus`, `updatecompanynotes`, `companymarkedvisited`, `addcompanyvisittime`, `companyvisitremove`, `getlastvisitedentry`, `bookmarkroutecompany`, `companynavigateme`, `reportcompany`.

Upload-error repair (web/API): autofill address/company, merge contacts, delete duplicate.

## MCP

- Saved accounts (incl. typos) → `search_companies` (max 200/page).
- One profile → `view_company` (hours, website, phone, address).
- High Priority / Gold → `set_company_status` (not a note).
- New named account the user wants saved → `add_company` (name + address or city; optional `route_id` re-optimizes + publishes).
- Never `add_company` for AI search hits — use `save_ai_leads`.
