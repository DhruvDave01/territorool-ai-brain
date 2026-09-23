---
title: "Use case inventory"
---

# Use case inventory

**Canonical IDs and prose:** [product/use-cases-overview.md](../product/use-cases-overview.md) and each `features/*/use-cases.md`.

This Brain **does not re-number** them as UC-001. Existing IDs are already unique and mapped to modules.

Each row is the engineering relationship:

`Product concept → Use case → UI flow → Component → API → Backend → Database → Tests`

`Tests` is often **none**. Verification then = [../skills/verify-ui.md](../skills/verify-ui.md).

---

## How to use

1. Identify the user goal.
2. Open the feature `use-cases.md` for happy/alt/failure paths.
3. Open the matching [UI flow](../ui-flows/README.md).
4. Trace files in the table (or CODEMAP / ROUTEMAP).
5. After a durable finding, ingest [../skills/wiki.md](../skills/wiki.md) so the next session does not rediscover it.
5. Verify with the listed method.

Worked traces (full template): [UC-LEAD-save.md](UC-LEAD-save.md), [UC-RTE-create.md](UC-RTE-create.md), [UC-CT-buy.md](UC-CT-buy.md), [UC-MGR-dashboard.md](UC-MGR-dashboard.md), [UC-MCP-route.md](UC-MCP-route.md).

Blank template for a new high-value trace: [TEMPLATE.md](TEMPLATE.md).

---

## Index

### Auth / onboarding

| ID | Goal | UI flow | UI | API / web | Code | DB | Tests | Verify |
|----|------|---------|----|-----------|------|----|-------|--------|
| UC-AUTH-01 | Sign in | FLOW-AUTH | login Blade | session POST | `Auth/LoginController` | `users` | ExampleTest only (weak) | Playwright: login → landing by role |
| UC-AUTH-02 | Trial signup | FLOW-AUTH | `/trial` | web | Register / trial controllers | `users`, `user_packages` | none | Create trial, land on onboarding |
| UC-ONB-01…03 | Goals, field vs manager, B2B/residential | FLOW-ONB | onboarding views | web | `PostRegistrationOnboardingController` | user flags | none | Role lands on `/dashboard` vs `/manager/dashboard` |

### Home

| ID | Goal | UI flow | UI | Code | Verify |
|----|------|---------|----|------|--------|
| UC-HOME-01…05 | Rep home, paywall, chrome, proposed review credits | FLOW-HOME / FLOW-REVIEW-CREDITS | `front.dashboard` | `HomeController` | Sidebar links work; unpaid SA hits paywall; UC-HOME-05 not implemented |

### Address Book / activities

| ID | Goal | UI flow | UI | API | Code | DB | Verify |
|----|------|---------|----|-----|------|----|--------|
| UC-CO-* | Companies CRUD, map, status | FLOW-AB | `/company`, company view | v2 company endpoints | `CompanylController` | `companies` | Add Places company → appears in list + map |
| UC-ACT-* | Log activity | FLOW-AB | company profile | `addcompanyactivity` | Companyl / v2 | `activities` | Activity listed; not stored as a note |
| UC-CO-02 | Recently added | FLOW-AB | `/recent-company` | — | Companyl | `companies` | New save shows here |

### Contacts / credits

| ID | Goal | UI flow | API | Code | DB | Verify |
|----|------|---------|-----|------|----|--------|
| UC-CT-01…02 | Buy / enrich | FLOW-CONTACTS | `buyContacts` | Companyl + V2 CompanyController + ContactsTools | `contacts`, credit tables | Balance drops 2 or 1; never 0 |
| UC-CT-03…05 | Manual contacts | FLOW-CONTACTS | contact routes | `ContactController` | `contacts` | Add contact 0 credits |
| UC-CT-06 | Contacts on recently added | FLOW-AB | — | — | — | See feature use-cases |

### Find Leads

| ID | Goal | UI flow | API | Code | DB | Verify |
|----|------|---------|-----|------|----|--------|
| UC-LEAD-01…12 | Search, resume, save | FLOW-FIND-LEADS | `getAILeadsV2`, `saveAILeads`, web `/ai-lead-finder/*` | `AILeadFinderController`, `Helper::saveAILead`, `LeadsTools` | `user_ai_search`, `companies`, credits | Search free; each save −1 credit; company `source=aileads` |

Worked: [UC-LEAD-save.md](UC-LEAD-save.md).

### Routes / lists / upload

| ID | Goal | UI flow | Code | DB | Verify |
|----|------|---------|------|----|--------|
| UC-RTE-01…15 | Create, process, publish, visit, share | FLOW-ROUTE | Route* controllers, `RoutesTools` | `user_routes` | Web can draft; MCP published + `route_url` |
| UC-LST-01…08 | Lists, convert to route | FLOW-LIST | `ListController` | `user_lists` | List ≠ drive order until generate |
| UC-UPL-01…03 | CSV import / repair | FLOW-UPLOAD | Companyl CSV | session/import tables | Repair unfinished import |

Worked: [UC-RTE-create.md](UC-RTE-create.md).

### Billing / settings / support

| ID | Goal | UI flow | Code | Verify |
|----|------|---------|------|--------|
| UC-BIL-01…05 | Subscribe, add-on, cancel | FLOW-BILLING | `SubscriptionController` | Paywall vs credits add-on |
| UC-SET-01…06 | Profile, CRM, MCP connector | FLOW-SETTINGS | Salesperson + CRM + `McpClient` | HubSpot connect ≠ native MCP server |
| UC-SUP-01…02 | Support ticket | FLOW-SUPPORT | `SupportController` | Ticket created |

### Manager / HQ / MCP

| ID | Goal | UI flow | Code | Tests | Verify |
|----|------|---------|------|-------|--------|
| UC-MGR-01…05 | Team cockpit, assign leads | FLOW-MANAGER | Manager controller + React + `ManagerFindLeadsService` | PHPUnit helpers | Assign charges manager credits |
| UC-ADM-01…09 | HQ users, promo, credits | FLOW-HQ | `Admin/*` | none | Admin MCP read-only vs HQ writes |
| MCP tools | Same goals via tools | FLOW-MCP | UserMcp / FindMcp | artisan qa | Tool table in api-surfaces.md |

Worked: [UC-MGR-dashboard.md](UC-MGR-dashboard.md), [UC-MCP-route.md](UC-MCP-route.md), [UC-CT-buy.md](UC-CT-buy.md).

### Maps / clients / cron / team

| ID | Goal | UI flow | Code | Verify |
|----|------|---------|------|--------|
| UC-MAP-01…05 | Map pins, geocode, Navigate Me | FLOW-MAPS | `viewmap*` | Pin on company/list/route map |
| UC-CLIENT-01…04 | Same product on web/v2/MCP | (contract) | Helper / v2 / UserMcp | MCP search matches Address Book |
| UC-CRON-01…05 | Jobs and webhooks | FLOW-CRON | `CronController`, `Jobs`, webhooks | Route leaves processing; no double credit |
| UC-TEAM-01…04 | Legacy invite / credits | FLOW-TEAM | `BusinesssalespersonController` | Activate sets BSA; new UX is `/manager` |

### No UC IDs yet (bible gap)

None of the 21 modules lack a `use-cases.md` after 2026-09-16 QA. Mobile screenshots and leftover unassigned web captures are still uncatalogued.

---

## Template (for new UCs)

When adding a use case, write it in the **feature** `use-cases.md` using the bible format (User Goal, Preconditions, Happy Path, Alternatives, Failure Modes, Expected Result) **and** add one index row here with UI / API / Code / DB / Tests / Verify.

New screen for that UC: also fill [../ui-flows/SCREEN-SPEC.md](../ui-flows/SCREEN-SPEC.md).
