---
title: "TerriTool feature modules"
---

# TerriTool feature modules

Field sales territory platform documentation for future development, organized **one folder per feature**. Functionality is one product: the same companies, credits, routes, and rules apply wherever the user is signed in (browser, iOS, Android, voice, or AI tools). Do not document or build a "web version" and a "mobile version" of the same feature.

Each feature folder holds everything about that feature:

| File | What it is | Treat as |
|---|---|---|
| `MODULE.md` | Required behavior — the Bible. Ends with a **Related** block linking sibling modules, its own files, MCP, code and terms | Source of truth |
| `use-cases.md` | Actors, preconditions, main / alternate / exception paths (`UC-*` IDs) | Verbatim split of the former use-case catalog |
| `flows.md` + `flows/` | Mermaid source and rendered PNG of the screen sequence | Diagram |
| `evidence.md` + `evidence/` | Staging screenshots for this feature, with the use cases each proves | Evidence |
| `limits.md` | Real timeouts, page sizes, thresholds pulled from code | Code-derived |
| `known-issues.md` | Literal backend error strings, when they fire, what to tell the user | Code-derived |

Read [product/OVERVIEW.md](../product/overview.md) first, then the module you are changing. When you ship a change, update that module's `MODULE.md` (and its `use-cases.md` if a path changed) plus [LAST_VERIFIED.md](../LAST_VERIFIED.md), then wiki ingest [../skills/wiki.md](../skills/wiki.md). New or redesigned UI: fill [SCREEN-SPEC.md](../ui-flows/SCREEN-SPEC.md) in this Brain before coding.

---

## Module index

| Module | Use cases | Flows | Evidence | Limits / issues |
|---|---|---|---|---|
| [01-Authentication-Onboarding](01-Authentication-Onboarding/MODULE.md) | [use cases](01-Authentication-Onboarding/use-cases.md) | [flows](01-Authentication-Onboarding/flows.md) | [evidence](01-Authentication-Onboarding/evidence.md) | — |
| [02-Dashboard](02-Dashboard/MODULE.md) | [use cases](02-Dashboard/use-cases.md) | [flows](02-Dashboard/flows.md) | [evidence](02-Dashboard/evidence.md) | — |
| [03-Company-AddressBook](03-Company-AddressBook/MODULE.md) | [use cases](03-Company-AddressBook/use-cases.md) | [flows](03-Company-AddressBook/flows.md) | [evidence](03-Company-AddressBook/evidence.md) | [issues](03-Company-AddressBook/known-issues.md) |
| [04-Contacts](04-Contacts/MODULE.md) | [use cases](04-Contacts/use-cases.md) | [flows](04-Contacts/flows.md) | [evidence](04-Contacts/evidence.md) | — |
| [05-Find-Leads](05-Find-Leads/MODULE.md) | [use cases](05-Find-Leads/use-cases.md) | [flows](05-Find-Leads/flows.md) | [evidence](05-Find-Leads/evidence.md) | [limits](05-Find-Leads/limits.md), [issues](05-Find-Leads/known-issues.md) |
| [06-Recently-Added](06-Recently-Added/MODULE.md) | [use cases](06-Recently-Added/use-cases.md) | [flows](06-Recently-Added/flows.md) | [evidence](06-Recently-Added/evidence.md) | — |
| [07-Routes](07-Routes/MODULE.md) | [use cases](07-Routes/use-cases.md) | [flows](07-Routes/flows.md) | [evidence](07-Routes/evidence.md) | [limits](07-Routes/limits.md), [issues](07-Routes/known-issues.md) |
| [08-Lists](08-Lists/MODULE.md) | [use cases](08-Lists/use-cases.md) | [flows](08-Lists/flows.md) | [evidence](08-Lists/evidence.md) | — |
| [09-Contact-Enrichment-Credits](09-Contact-Enrichment-Credits/MODULE.md) | [use cases](09-Contact-Enrichment-Credits/use-cases.md) | [flows](09-Contact-Enrichment-Credits/flows.md) | [evidence](09-Contact-Enrichment-Credits/evidence.md) | [limits](09-Contact-Enrichment-Credits/limits.md), [issues](09-Contact-Enrichment-Credits/known-issues.md) |
| [10-Bulk-Upload](10-Bulk-Upload/MODULE.md) | [use cases](10-Bulk-Upload/use-cases.md) | [flows](10-Bulk-Upload/flows.md) | [evidence](10-Bulk-Upload/evidence.md) | — |
| [11-Maps](11-Maps/MODULE.md) | [use cases](11-Maps/use-cases.md) | [flows](11-Maps/flows.md) | — | — |
| [12-Subscription-Payments](12-Subscription-Payments/MODULE.md) | [use cases](12-Subscription-Payments/use-cases.md) | [flows](12-Subscription-Payments/flows.md) | [evidence](12-Subscription-Payments/evidence.md) | — |
| [13-CRM-Integrations](13-CRM-Integrations/MODULE.md) | [use cases](13-CRM-Integrations/use-cases.md) | [flows](13-CRM-Integrations/flows.md) | [evidence](13-CRM-Integrations/evidence.md) | — |
| [14-Settings-Profile](14-Settings-Profile/MODULE.md) | [use cases](14-Settings-Profile/use-cases.md) | [flows](14-Settings-Profile/flows.md) | — | — |
| [15-Support-Notifications](15-Support-Notifications/MODULE.md) | [use cases](15-Support-Notifications/use-cases.md) | [flows](15-Support-Notifications/flows.md) | [evidence](15-Support-Notifications/evidence.md) | — |
| [16-Manager-Portal](16-Manager-Portal/MODULE.md) | [use cases](16-Manager-Portal/use-cases.md) | [flows](16-Manager-Portal/flows.md) | [evidence](16-Manager-Portal/evidence.md) | — |
| [17-Admin-HQ](17-Admin-HQ/MODULE.md) | [use cases](17-Admin-HQ/use-cases.md) | [flows](17-Admin-HQ/flows.md) | [evidence](17-Admin-HQ/evidence.md) | — |
| [18-Clients](18-Clients/MODULE.md) | [use cases](18-Clients/use-cases.md) | [flows](18-Clients/flows.md) | — | — |
| [19-Cron-Jobs-Webhooks](19-Cron-Jobs-Webhooks/MODULE.md) | [use cases](19-Cron-Jobs-Webhooks/use-cases.md) | [flows](19-Cron-Jobs-Webhooks/flows.md) | — | — |
| [20-MCP](20-MCP/MODULE.md) | [use cases](20-MCP/use-cases.md) | [flows](20-MCP/flows.md) | — | [limits](20-MCP/limits.md) |
| [21-Business-Team](21-Business-Team/MODULE.md) | [use cases](21-Business-Team/use-cases.md) | [flows](21-Business-Team/flows.md) | — | — |

Module **20-MCP** is the AI-agent surface (formerly `05-MCP` + `08-Example-Conversations`); it also holds the tool contract [api-surfaces.md](20-MCP/api-surfaces.md), [example-utterances.md](20-MCP/example-utterances.md) and [conversations.md](20-MCP/conversations.md). There is no module 22 any more — the code map and route map live in [code/](../knowledge/code/README.md).

---

## Roles

| Role | What they do |
|------|----------------|
| **Sales Agent** | Individual rep: address book, leads, routes, own subscription/credits |
| **Business Agent** | Manager: licenses, team, assign leads, team KPIs |
| **Business Sales Agent** | Rep on a manager's team; credits come from the manager |
| **Admin** | TerriTool staff: users, plans, promo, support |

Details: [roles.md](../product/roles.md).

---

## Credit costs (same everywhere)

| Action | Credits |
|--------|---------|
| Save one AI lead | **1** |
| Fetch/buy contact via **FullEnrich** | **2** |
| Fetch/buy contact via **Claude** | **1** |
| Search / browse leads or contact **counts** | **0** |

Buy contacts is **not free**. Only FullEnrich and Claude are running for fetch.

If credits are insufficient: Sales Agents go to upgrade / add-on (or manage-plan if billed through RevenueCat). Business Sales Agents are told to contact their manager.

---

## Tech (for implementers)

Laravel 7 + PHP 7.4 (lockfile in this checkout is Laravel 5.3.31 — prefer PHP 7.2-safe code). Do not use Laravel 8+ or PHP 8+ syntax. Reuse existing models and `Helper` methods. A change to credit math, save-lead, or mark-visited must stay identical for every client. Before touching UI, read [stack-migration-map.md](../knowledge/architecture/stack-migration-map.md); to find the controller behind a URL, use [ROUTEMAP.md](../knowledge/code/ROUTEMAP.md).
