# Wiki index

Content catalog for this Brain (Karpathy LLM Wiki pattern). **Read this to find pages; do not treat it as higher rank than MODULE.md or source code.**

Schema: [operating/llm-wiki.md](operating/llm-wiki.md). Timeline: [log.md](log.md). Rebuild: `python3 tools/wiki_index.py` from `TerriTool AI Brain/`.

Local QA: `http://127.0.0.1:8000/login`.

## Start here

| Page | Summary |
|------|---------|
| [Agent instructions — TerriTool Engineering Brain](AGENTS.md) | You are an engineering agent working on TerriTool. TerriTool AI Brain/ is the only knowledge system — do not start a second pack. Cursor will eventually be removed. Operate as if C… |
| [Last verified](LAST_VERIFIED.md) | Copied into TerriTool AI Brain/ so agents do not need an external pack. This folder is the only Brain. Update this ledger in this folder when you re-verify. |
| [TerriTool AI Engineering Brain](README.md) | Agent entry point. Read this first. Do not invent architecture. |
| [Cursor exit checklist](cursor-exit.md) | Goal: operate TerriTool engineering with Claude + Codex + MCPs, without Cursor. |
| [Discovery report](discovery-report.md) | Created: 2026-09-16 Method: Inspected the live repository (composer.lock, routes, controllers, MCP modules, tests, Cursor config, and copied product/engineering markdown now in thi… |

## Product

| Page | Summary |
|------|---------|
| [00 — Product](product/00-Product-README.md) | What TerriTool is, vocabulary, roles, and the product-level (cross-feature) journeys. Read before any feature module. |
| [Product-level flows](product/FLOWS.md) | End-to-end map, role split and the use-case overview diagrams. Feature-level flows live beside each module in features/<module>/flows.md; the index is in features/README.md and ../… |
| [TerriTool — Developer Onboarding Guide](product/TerriTool_OverView.md) | TerriTool is a field sales territory management platform built for sales reps, business clients, and their teams. It helps sales professionals manage territories, discover leads, p… |
| [Business rules](product/business-rules.md) | Rules that must not silently change. Feature details live in features/*/MODULE.md. |
| [Core concepts](product/concepts.md) | Copied from the product glossary and overview. Implementation pointers stay inside this Brain. |
| [Constraints](product/constraints.md) | Hard limits on what an engineering change may do. |
| [TerriTool glossary](product/glossary.md) | Use these words the way the product uses them. Do not invent synonyms that change the action. |
| [00 — TerriTool Overview](product/overview.md) | End-to-end journeys across modules: FLOWS.md. UI flow index: ../ui-flows/README.md. Use cases: use-cases-overview.md. Feature modules: features/README.md. |
| [TerriTool roles](product/roles.md) | One product, four roles. After login they land on different homes; credits and CRM still follow these rules. |
| [Terminology](product/terminology.md) | Use those words in PRs, Brain updates, and MCP replies. Do not invent synonyms for: |
| [TerriTool use cases](product/use-cases-overview.md) | Actors, preconditions, main flow, alternate paths, and exceptions for every product flow. Evidence lives beside each feature (features/<module>/evidence/) plus routes/web.php. The… |

## Features

| Page | Summary |
|------|---------|
| [01 — Authentication, Registration, Onboarding](features/01-Authentication-Onboarding/MODULE.md) | Create an account, sign in, reset a password, activate an invite, collect selling preferences, and start a product tour. After login, the user is sent to the home that matches thei… |
| [Authentication Onboarding — evidence](features/01-Authentication-Onboarding/evidence.md) | Part of 01-Authentication-Onboarding. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refe… |
| [Authentication Onboarding — flows](features/01-Authentication-Onboarding/flows.md) | Part of 01-Authentication-Onboarding. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Authentication Onboarding — use cases](features/01-Authentication-Onboarding/use-cases.md) | Part of 01-Authentication-Onboarding. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer t… |
| [02 — Dashboard](features/02-Dashboard/MODULE.md) | Home after login for reps. Shows what they did recently, what is coming up, and credit/upgrade status. Business Agents are sent to the Manager Portal instead of this screen. |
| [Dashboard — evidence](features/02-Dashboard/evidence.md) | Part of 02-Dashboard. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to use-cases.m… |
| [Dashboard — flows](features/02-Dashboard/flows.md) | Part of 02-Dashboard. Evidence: evidence.md 11:10:02. |
| [Screen spec — day-two review credits](features/02-Dashboard/flows/review-credits-landing-spec.md) | Proposed 2026-09-21. The eligible-state Blade UI is available at authenticated /reviews/credits; it is deliberately display-only. Visual mocks are in evidence/review-credits/. Inte… |
| [Dashboard — use cases](features/02-Dashboard/use-cases.md) | Part of 02-Dashboard. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evidence.md wh… |
| [03 — Company (Address Book)](features/03-Company-AddressBook/MODULE.md) | The Address Book is the core object. Every lead from Find Leads, CSV, CRM, manual add, or AI tools becomes a company. Contacts, notes, visits, lists, and routes hang off companies.… |
| [Company AddressBook — evidence](features/03-Company-AddressBook/evidence.md) | Part of 03-Company-AddressBook. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to u… |
| [Company AddressBook — flows](features/03-Company-AddressBook/flows.md) | Part of 03-Company-AddressBook. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Screen spec — Company detail: associated routes and lists](features/03-Company-AddressBook/flows/company-detail-associations-spec.md) | Filled from SCREEN-SPEC.md. Not implemented. Do not file generated mocks as evidence. |
| [Company AddressBook — known issues and error messages](features/03-Company-AddressBook/known-issues.md) | Part of 03-Company-AddressBook. Verbatim from the former 07-Operational-Reference/known-issues-and-error-messages.md (literal strings from the controllers, verified 2026-09-15; spl… |
| [Company AddressBook — use cases](features/03-Company-AddressBook/use-cases.md) | Part of 03-Company-AddressBook. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evid… |
| [04 — Contacts](features/04-Contacts/MODULE.md) | People at companies. They can be added by hand, CSV, CRM sync, or redeemed from enrichment. Same contact record everywhere. |
| [Contacts — evidence](features/04-Contacts/evidence.md) | Part of 04-Contacts. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to use-cases.md… |
| [Contacts — flows](features/04-Contacts/flows.md) | Part of 04-Contacts. Credits: 09-Contact-Enrichment-Credits. |
| [Contacts — use cases](features/04-Contacts/use-cases.md) | Part of 04-Contacts. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evidence.md whe… |
| [05 — Find Leads (AI + Yelp)](features/05-Find-Leads/MODULE.md) | Discover new businesses in a territory that are not already in the user’s Address Book. Search is free. Saving costs 1 credit per company. Managers have a separate “search then ass… |
| [Find Leads — evidence](features/05-Find-Leads/evidence.md) | Part of 05-Find-Leads. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to use-cases.… |
| [Find Leads — flows](features/05-Find-Leads/flows.md) | Part of 05-Find-Leads. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Find Leads — known issues and error messages](features/05-Find-Leads/known-issues.md) | Part of 05-Find-Leads. Verbatim from the former 07-Operational-Reference/known-issues-and-error-messages.md (literal strings from the controllers, verified 2026-09-15; split 2026-0… |
| [Find Leads — limits](features/05-Find-Leads/limits.md) | Part of 05-Find-Leads. Verbatim from the former 07-Operational-Reference/limits-and-performance.md (verified against code 2026-09-15; split 2026-09-16). Real numbers from code, not… |
| [Find Leads — use cases](features/05-Find-Leads/use-cases.md) | Part of 05-Find-Leads. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evidence.md w… |
| [06 — Recently Added](features/06-Recently-Added/MODULE.md) | Work the newest companies and contacts without scanning the full Address Book. |
| [Recently Added — evidence](features/06-Recently-Added/evidence.md) | Part of 06-Recently-Added. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to use-ca… |
| [Recently Added — flows](features/06-Recently-Added/flows.md) | Part of 06-Recently-Added. Same companies as FLOW-AB; filter is recency. |
| [Recently Added — use cases](features/06-Recently-Added/use-cases.md) | Part of 06-Recently-Added. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evidence.… |
| [07 — Routes](features/07-Routes/MODULE.md) | An optimized driving sequence of companies (stops). Create, process, publish, run in the field, share, export, and regenerate when stops change. |
| [Routes — evidence](features/07-Routes/evidence.md) | Part of 07-Routes. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to use-cases.md.… |
| [Routes — flows](features/07-Routes/flows.md) | Part of 07-Routes. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Screen spec — First-route mobile app popup](features/07-Routes/flows/mobile-app-route-promo-spec.md) | Offer a newly activated route user a one-time, unobtrusive way to get the TerriTool mobile app while they are viewing their first published Basic Route. |
| [Routes — known issues and error messages](features/07-Routes/known-issues.md) | Part of 07-Routes. Verbatim from the former 07-Operational-Reference/known-issues-and-error-messages.md (literal strings from the controllers, verified 2026-09-15; split 2026-09-16… |
| [Routes — limits](features/07-Routes/limits.md) | Part of 07-Routes. Verbatim from the former 07-Operational-Reference/limits-and-performance.md (verified against code 2026-09-15; split 2026-09-16). Real numbers from code, not est… |
| [Routes — use cases](features/07-Routes/use-cases.md) | Part of 07-Routes. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evidence.md where… |
| [08 — Lists](features/08-Lists/MODULE.md) | A List is a named group of companies. It is not a driving order. Use it for territories, campaigns, or “today’s accounts”, then optionally generate a route from it. |
| [Lists — evidence](features/08-Lists/evidence.md) | Part of 08-Lists. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to use-cases.md. U… |
| [Lists — flows](features/08-Lists/flows.md) | Part of 08-Lists. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Lists — use cases](features/08-Lists/use-cases.md) | Part of 08-Lists. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evidence.md where… |
| [09 — Contact Enrichment and Credits](features/09-Contact-Enrichment-Credits/MODULE.md) | Look up people at a company and buy/fetch them with credits. Buy contacts is not free. The same credit wallet is used to save AI leads. |
| [Contact Enrichment Credits — evidence](features/09-Contact-Enrichment-Credits/evidence.md) | Part of 09-Contact-Enrichment-Credits. Assigned from unassigned afternoon captures during QA 2026-09-16 (same 15 Sep session as the rest of the pack). |
| [Contact Enrichment Credits — flows](features/09-Contact-Enrichment-Credits/flows.md) | Part of 09-Contact-Enrichment-Credits. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Contact Enrichment Credits — known issues and error messages](features/09-Contact-Enrichment-Credits/known-issues.md) | Part of 09-Contact-Enrichment-Credits. Verbatim from the former 07-Operational-Reference/known-issues-and-error-messages.md (literal strings from the controllers, verified 2026-09-… |
| [Contact Enrichment Credits — limits](features/09-Contact-Enrichment-Credits/limits.md) | Part of 09-Contact-Enrichment-Credits. Verbatim from the former 07-Operational-Reference/limits-and-performance.md (verified against code 2026-09-15; split 2026-09-16). Real number… |
| [Contact Enrichment Credits — use cases](features/09-Contact-Enrichment-Credits/use-cases.md) | Part of 09-Contact-Enrichment-Credits. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence: evidence.md… |
| [10 — Bulk Upload (Companies and Contacts)](features/10-Bulk-Upload/MODULE.md) | Import many companies or contacts from CSV/Excel, map columns, preview, commit, then repair rows that failed (geocode, duplicates, missing fields). Work sits in a session until suc… |
| [Bulk Upload — evidence](features/10-Bulk-Upload/evidence.md) | Part of 10-Bulk-Upload. Assigned from unassigned afternoon captures during QA 2026-09-16. |
| [Bulk Upload — flows](features/10-Bulk-Upload/flows.md) | Part of 10-Bulk-Upload. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Bulk Upload — use cases](features/10-Bulk-Upload/use-cases.md) | Part of 10-Bulk-Upload. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence: evidence.md. |
| [11 — Maps and Geocoding](features/11-Maps/MODULE.md) | Show companies, lists, and routes on a map; turn addresses into coordinates and cities; navigate to a stop. |
| [Maps — flows](features/11-Maps/flows.md) | Part of 11-Maps. Use cases: use-cases.md. Shared view: front.company.viewmap. |
| [Maps — use cases](features/11-Maps/use-cases.md) | Part of 11-Maps. Written 2026-09-16 from MODULE.md + ROUTEMAP.md (company/viewmap, list/viewmap/{id}, route/viewmap/{id}). No UC IDs existed before. Not a live Playwright walk this… |
| [12 — Subscriptions and Payments](features/12-Subscription-Payments/MODULE.md) | Sell plans and extra credits, keep status in sync, invoices, trial, upgrade, cancel. The wallet and plan are the same no matter how the user paid. |
| [Subscription Payments — evidence](features/12-Subscription-Payments/evidence.md) | Part of 12-Subscription-Payments. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to… |
| [Subscription Payments — flows](features/12-Subscription-Payments/flows.md) | Part of 12-Subscription-Payments. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Subscription Payments — use cases](features/12-Subscription-Payments/use-cases.md) | Part of 12-Subscription-Payments. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to ev… |
| [13 — CRM Integrations](features/13-CRM-Integrations/MODULE.md) | Keep TerriTool companies/contacts (and HubSpot notes/meetings) in sync with an external CRM. Pipedrive is not implemented; do not assume it works. |
| [CRM Integrations — evidence](features/13-CRM-Integrations/evidence.md) | Part of 13-CRM-Integrations. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to use-… |
| [CRM Integrations — flows](features/13-CRM-Integrations/flows.md) | Part of 13-CRM-Integrations. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [CRM Integrations — use cases](features/13-CRM-Integrations/use-cases.md) | Part of 13-CRM-Integrations. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evidenc… |
| [14 — Settings and Profile](features/14-Settings-Profile/MODULE.md) | The signed-in user’s profile, labels (statuses, categories, stages), subscription controls, CRM, preferences, and optional AI-tool connections. |
| [Settings Profile — evidence](features/14-Settings-Profile/evidence.md) | Part of 14-Settings-Profile. Assigned from unassigned captures during evidence triage 2026-09-17 (same 15 Sep / 11 Sep 2026 sessions as the rest of the pack). No prior evidence.md… |
| [Settings Profile — flows](features/14-Settings-Profile/flows.md) | Part of 14-Settings-Profile. CRM/MCP connector UI is also 13-CRM-Integrations. |
| [Settings Profile — use cases](features/14-Settings-Profile/use-cases.md) | Part of 14-Settings-Profile. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. No feature-specific screenshots… |
| [15 — Support and Notifications](features/15-Support-Notifications/MODULE.md) | Help tickets (including Report Bug), an inbox for route and system messages, email, and push. |
| [Support Notifications — evidence](features/15-Support-Notifications/evidence.md) | Part of 15-Support-Notifications. Staging captures (15 Sep 2026, https://staging.territool.com), rows split from the former 06-Evidence/screenshot-catalog.md. Use-case IDs refer to… |
| [Support Notifications — flows](features/15-Support-Notifications/flows.md) | Part of 15-Support-Notifications. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Support Notifications — use cases](features/15-Support-Notifications/use-cases.md) | Part of 15-Support-Notifications. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to ev… |
| [16 — Manager Portal (Business Agent)](features/16-Manager-Portal/MODULE.md) | Cockpit for Business Agents: licenses, team, KPIs, assign AI leads to reps, activity, support, settings. Older team screens still exist for invites (module 21). New manager work be… |
| [Manager Portal — evidence](features/16-Manager-Portal/evidence.md) | Part of 16-Manager-Portal. Browser captures of the manager portal on staging, 15 Sep 2026 (Screenshots/Web/Manager before the 2026-09-16 reorganization). Screen names are taken fro… |
| [Manager Portal — flows](features/16-Manager-Portal/flows.md) | Part of 16-Manager-Portal. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [Manager Portal — use cases](features/16-Manager-Portal/use-cases.md) | Part of 16-Manager-Portal. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evidence.… |
| [17 — Admin HQ](features/17-Admin-HQ/MODULE.md) | Internal TerriTool staff tools. Admin role only. Other roles never see HQ. |
| [Admin HQ — evidence](features/17-Admin-HQ/evidence.md) | Part of 17-Admin-HQ. Browser captures of the HQ / admin screens on staging, 15 Sep 2026 (Screenshots/Web/Admin before the 2026-09-16 reorganization). Filenames carry no screen name… |
| [Admin HQ — flows](features/17-Admin-HQ/flows.md) | Part of 17-Admin-HQ. Evidence screenshots exist in evidence.md but are not fully UC-mapped. Admin MCP is read-only. |
| [Admin HQ — use cases](features/17-Admin-HQ/use-cases.md) | Part of 17-Admin-HQ. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. Evidence times refer to evidence.md whe… |
| [18 — One product, every client](features/18-Clients/MODULE.md) | TerriTool is one product. Browser, iOS, Android, voice, and AI tools all read and write the same companies, contacts, routes, lists, credits, and CRM connections. Do not design a f… |
| [Clients — flows](features/18-Clients/flows.md) | Part of 18-Clients. Not a user-click journey. Surfaces converge on Helper / v2. |
| [Clients (one product) — use cases](features/18-Clients/use-cases.md) | Part of 18-Clients. This module is a contract, not a screen. UCs are cross-surface checks. Written 2026-09-16 from MODULE.md + Customer MCP QA (user 1822). |
| [19 — Background jobs and provider callbacks](features/19-Cron-Jobs-Webhooks/MODULE.md) | Work that is not a user clicking a button: keep plans/credits true, finish route optimization, finish contact enrich, send mail/push, sync CRM, log to sheets. |
| [Cron / webhooks — flows](features/19-Cron-Jobs-Webhooks/flows.md) | Part of 19-Cron-Jobs-Webhooks. Use cases: use-cases.md. |
| [Cron / webhooks — use cases](features/19-Cron-Jobs-Webhooks/use-cases.md) | Part of 19-Cron-Jobs-Webhooks. No user chrome. Written 2026-09-16 from MODULE.md + CronController / WebhookController / app/Jobs. Do not QA these as FLOW-AUTH. |
| [20 — MCP and voice (Claude / Cursor / ChatGPT / voice)](features/20-MCP/MODULE.md) | The AI-agent surface of TerriTool. An agent (Claude, Cursor, ChatGPT, the voice client, or an in-app custom MCP connection) calls the same actions as the browser and the phone — sa… |
| [TerriTool surfaces and API contract](features/20-MCP/api-surfaces.md) | Load this with the Bible. It is not an OpenAPI spec. Agents must use MCP tools (or the matching voice catalog action). Do not call PHP, SQL, curl, or /api/v2 directly. |
| [Example MCP / voice conversations](features/20-MCP/conversations.md) | Multi-turn transcripts showing how the rules in api-surfaces.md, example-utterances.md, and glossary.md play out turn by turn. Every tool name, credit cost, and error string below… |
| [20 — MCP evidence](features/20-MCP/evidence.md) | No product-app screenshots are catalogued for MCP tools (success is tool JSON + a web side effect). The public ChatGPT setup page is static HTML. |
| [Example utterances → catalog actions](features/20-MCP/example-utterances.md) | Voice and chat should map to one catalog id, then stop. Confirm writes and paid actions. Full surface/auth/error rules: api-surfaces.md. |
| [MCP — flows](features/20-MCP/flows.md) | Part of 20-MCP. Source mermaid in flows/mmd/, rendered PNG in flows/png/ (re-render with mermaid is inlined in this file). Product-level map: FLOWS.md. |
| [ChatGPT setup index — screen spec](features/20-MCP/flows/chatgpt-setup-index-spec.md) | Filled before the /chatgpt-plugin landing-page restructure. Design procedure: ../../../skills/design-ui.md. |
| [MCP — limits](features/20-MCP/limits.md) | Part of 20-MCP. Verbatim from the former 07-Operational-Reference/limits-and-performance.md (verified against code 2026-09-15; split 2026-09-16). Real numbers from code, not estima… |
| [MCP — use cases](features/20-MCP/use-cases.md) | Part of 20-MCP. Verbatim from the former 03-Use-Cases/use-cases.md (split 2026-09-16). Actors and global chrome: use-cases-overview.md. No feature-specific screenshots are catalogu… |
| [21 — Business Team (older screens)](features/21-Business-Team/MODULE.md) | Original Business Agent team management, still live for invite activation, credit allocation, and some redirects. New manager UX is module 16. Do not delete this path. |
| [Business Team — flows](features/21-Business-Team/flows.md) | Part of 21-Business-Team. Newer cockpit: 16-Manager-Portal. |
| [Business Team — use cases](features/21-Business-Team/use-cases.md) | Part of 21-Business-Team. Written 2026-09-16 from MODULE.md + BusinesssalespersonController routes. New manager UX is 16-Manager-Portal. Not Playwright-walked this session. |
| [TerriTool feature modules](features/README.md) | Field sales territory platform documentation for future development, organized one folder per feature. Functionality is one product: the same companies, credits, routes, and rules… |

## Use-case traces

| Page | Summary |
|------|---------|
| [Use case inventory](use-cases/README.md) | Canonical IDs and prose: product/use-cases-overview.md and each features/*/use-cases.md. |
| [Use case template](use-cases/TEMPLATE.md) | Existing IDs are canonical (UC-LEAD-01, …). Do not invent UC-001. New paths get the next ID in that family. |
| [UC-CT — Buy contacts (engineering trace)](use-cases/UC-CT-buy.md) | Product IDs: UC-CT-01, UC-CT-02. Prose: features/09-Contact-Enrichment-Credits/use-cases.md. UI flow: FLOW-CONTACTS. |
| [UC-LEAD — Save AI leads (engineering trace)](use-cases/UC-LEAD-save.md) | Product IDs: UC-LEAD-* (save path). Full prose: features/05-Find-Leads/use-cases.md. UI flow: FLOW-FIND-LEADS. |
| [UC-MCP — Create a published route from tools (engineering trace)](use-cases/UC-MCP-route.md) | Product: features/20-MCP/use-cases.md + features/20-MCP/api-surfaces.md. UI flow: FLOW-MCP. |
| [UC-MGR — Manager dashboard (engineering trace)](use-cases/UC-MGR-dashboard.md) | Product IDs: UC-MGR-*. Prose: features/16-Manager-Portal/use-cases.md. UI flow: FLOW-MANAGER. |
| [UC-RTE — Create and publish a route (engineering trace)](use-cases/UC-RTE-create.md) | Product IDs: UC-RTE-*. Prose: features/07-Routes/use-cases.md. UI flow: FLOW-ROUTE. |

## UI flows

| Page | Summary |
|------|---------|
| [UI flow inventory](ui-flows/README.md) | Diagrams: product/FLOWS.md and each features/*/flows.md (index: features/README.md). This page is the executable map: starting point, states, APIs, how an agent verifies. New or re… |
| [Screen spec template](ui-flows/SCREEN-SPEC.md) | Fill this in the Brain before coding a new screen or a redesign. Copy the block into the feature flows.md (or a new flows/<name>-spec.md beside it). Do not keep specs in chat. |

## How it is built

| Page | Summary |
|------|---------|
| [Knowledge (execution-oriented)](knowledge/README.md) | These files exist so an agent can answer “how is TerriTool built?” without scanning the whole repo. Deep maps live in architecture/ and code/ beside these indexes. |
| [API surfaces](knowledge/api.md) | Four ways to hit the same product. Prefer the surface the user is on; do not invent a fifth. |
| [Architecture](knowledge/architecture.md) | One Laravel process. Three clients of the same product rules. |
| [Authentication](knowledge/architecture/authentication.md) | Evidence: config/auth.php, app/Http/Kernel.php, app/User.php, app/UserMcp/config/territool_app.php. |
| [Backend](knowledge/architecture/backend.md) | Treat installed lockfile as fact for this checkout. Write PHP 7.2-safe, Laravel 5.3-compatible code unless a human confirms production is Laravel 7. |
| [Database](knowledge/architecture/database.md) | Live schema (2026-09-15): data-model-reference.md |
| [Deployment](knowledge/architecture/deployment.md) | Fact: this repository has no Docker, Forge, Envoyer, GitHub Actions, or deploy scripts. |
| [Design tokens — stopgap (extracted, not designed)](knowledge/architecture/design-tokens-stopgap.md) | This is not a real design system. There is no Figma file, brand guideline, or token source in this repo — public/css/custom.css (5,693 lines, not ~3,700 as some docs say — recount… |
| [Frontend](knowledge/architecture/frontend.md) | TerriTool runs two frontend stacks by feature area, not a gradual migration. |
| [Integrations](knowledge/architecture/integrations.md) | Configured or called from this repo. Keys live in env/config — never commit secrets into the Brain. |
| [Mobile](knowledge/architecture/mobile.md) | Source repo (local checkout): /Applications/MAMP/htdocs/TerriTool_Mobile-Production — production branch, added to this machine 2026-09-17. Not a git clone on this checkout (no .git… |
| [Frontend stack migration map](knowledge/architecture/stack-migration-map.md) | TerriTool is running two different frontend stacks at once, split by feature area, not by a gradual per-component migration. Verified 2026-09-15 by reading vite.config.js, resource… |
| [System overview](knowledge/architecture/system-overview.md) | Evidence: ../discovery-report.md. Do not assume extra services. |
| [22 — Development reference](knowledge/code/CODEMAP.md) | For a URL → Controller@method → Blade view lookup across all 725 registered routes, see ROUTEMAP.md (generated from php artisan route:list; regenerate, don't hand-edit). This file… |
| [Code maps](knowledge/code/README.md) | How the code is actually built, and how to find it — not what the product does (that is features/). Reverse-engineered from the real code on 2026-09-15; no linter/CI enforces any o… |
| [Route map](knowledge/code/ROUTEMAP.md) | Generated 2026-09-16 by tools/routemap.py from php artisan route:list on the local checkout; each Controller@method body was scanned for view('…'), JSON, redirect and download resp… |
| [Bug repro / verification runbook](knowledge/code/bug-repro-runbook.md) | TerriTool already has real prior sessions of browser-driven repro via Playwright MCP — .playwright-mcp/console-*.log in the repo root holds actual captured console output from past… |
| [Coding conventions](knowledge/code/coding-conventions.md) | Reverse-engineered from the actual code on 2026-09-15 — not an aspirational style guide. There is no ESLint/Stylelint/PHPStan/.editorconfig in this repo (verified: none of those co… |
| [Data model reference](knowledge/code/data-model-reference.md) | Superseded on 2026-09-15: MAMP's MySQL came up mid-session, so this is now built from a live SHOW TABLES / SHOW COLUMNS read of the actual territool database, not from models or th… |
| [Important files](knowledge/code/important-files.md) | Not every file. These are the files an agent actually needs for product changes. |
| [Patterns (as used, not as wished)](knowledge/code/patterns.md) | 1. Updates web + v2 (or Helper used by both) 2. Keeps credit numbers identical 3. Leaves the other frontend stack alone 4. Updates the feature MODULE.md + this Brain if a durable f… |
| [Repository map](knowledge/code/repository-map.md) | Ignore vendor/, node_modules/, public/jqwidgets/, public/packages/, storage/logs, .playwright-mcp/ dumps unless debugging a specific session. |
| [Services](knowledge/code/services.md) | Laravel app/Services plus MCP tool services. Controllers still hold a lot of logic — do not assume a service exists. |
| [Testing](knowledge/code/testing.md) | phpunit.xml: suite ./tests suffix Test.php; APP_ENV=testing; array cache/session; sync queue. |
| [Tooling proposal — DRAFT, NOT INSTALLED](knowledge/code/tooling-proposal.md) | None of this is active. No .eslintrc, .stylelintrc, phpstan.neon, .editorconfig, or .github/workflows/* exist in the repo (verified 2026-09-15) — that's still true after writing th… |
| [Codebase](knowledge/codebase.md) | Monolith named laravel/laravel at the repo root. |
| [Conventions (agent-facing)](knowledge/conventions.md) | Match the file you are in. There is no ESLint / PHPStan / EditorConfig. |
| [Database](knowledge/database.md) | Live schema (~83 tables, 2026-09-15): ../code/data-model-reference.md. |
| [Dependencies](knowledge/dependencies.md) | Facts from composer.lock / composer.json / package.json as of the 2026-09-16 discovery pass. Do not add packages unless asked. |
| [Services](knowledge/services.md) | Most product logic is not in app/Services. Controllers + Helper own writes. |

## Skills

| Page | Summary |
|------|---------|
| [Skills](skills/README.md) | Base skills are single capabilities. Loops compose them (../loops/README.md). These markdown files are the detailed procedures (YAML name + description for auto-pick). Cursor loads… |
| [Skill: Debug](skills/debug.md) | Reproduce → Observe → Gather evidence → Hypothesize → Test hypothesis → Locate root cause → Fix → Regression test → UI verification → Document learning |
| [Skill: Design UI](skills/design-ui.md) | There is no second design pack and no Figma. Design from TerriTool AI Brain/ plus the live screen. |
| [Skill: Implement](skills/implement.md) | Understand requirement → identify use case → (new/redesigned UI: screen spec) → trace implementation → identify affected components → propose plan → implement → test → verify → doc… |
| [Skill: Investigate](skills/investigate.md) | Given a problem, do not start by modifying code. |
| [Skill: Test](skills/test.md) | Relevant today mainly for app/Services/Manager/*. Full suite includes ExampleTest, which needs MySQL (login layout queries user_packages). |
| [Skill: Trace feature](skills/trace-feature.md) | UI → frontend → API → backend → database → response → UI |
| [Skill: Understand repository](skills/understand-repo.md) | 1. Read ../README.md and ../knowledge/architecture.md if this is a new session. Discovery dump: ../discovery-report.md. 2. Investigate before modifying. 3. Cite actual files. Use k… |
| [Skill: Verify UI](skills/verify-ui.md) | Static reading is not enough for UI or credit-visible behavior. Executable understanding means running the app. |
| [Skill: Wiki (ingest / query / lint)](skills/wiki.md) | This Brain is the wiki. Schema: ../operating/llm-wiki.md. Catalog: ../index.md. Timeline: ../log.md. |

## Loops

| Page | Summary |
|------|---------|
| [Loops](loops/README.md) | Loops are repeatable engineering processes. Skills are the steps inside them. Protocol: execution-protocol.md. All of them live in this Brain — do not keep a second process doc. |
| [Bug loop](loops/bug-loop.md) | Bug report → Expected behavior → Reproduce → Gather evidence → Trace code → Root cause → Fix → Regression test → Playwright verification → Review → PR → CI → Document learning |
| [Engineering execution protocol](loops/execution-protocol.md) | For a large task, do not let one session do exploration, implementation, and review. Dispatch: |
| [Feature loop](loops/feature-loop.md) | Requirement → Understand product → Identify use case → Identify UI flow → (new/redesigned UI: screen spec) → Trace code → Plan → Implement → Unit/integration tests → Playwright/UI… |
| [PR loop (Codex)](loops/pr-loop.md) | Codex is the engineering delivery / review layer. Claude implements and verifies. Codex reviews, packages the PR, and watches CI when CI exists. |
| [QA loop](loops/qa-loop.md) | Named FLOW + UCs → expected from MODULE.md → walk the product → report pass/fail → write back to this Brain |
| [Refactoring loop](loops/refactoring-loop.md) | Constraints: ../product/constraints.md, ../knowledge/conventions.md. |
| [Release loop](loops/release-loop.md) | Documented because the prompt asked for it. The repo has no installable release pipeline. Treat this as a checklist for humans until deploy/CI is added. |
| [UI loop](loops/ui-loop.md) | Prefer source code + actual browser over source code only. |

## Memory

| Page | Summary |
|------|---------|
| [Memory index](memory/MEMORY.md) | Load this file when a fact might apply. Open the linked file — do not rely on this one-line summary. |
| [companylcontroller-spelling.md](memory/companylcontroller-spelling.md) | The company controller class is CompanylController (missing the “y”). It is a gravity well. Do not rename it. |
| [customer-mcp-not-in-cursor-mcp.md](memory/customer-mcp-not-in-cursor-mcp.md) | .cursor/mcp.json has Sentry and Playwright only. Field-rep Customer MCP ({APP_URL}/ai/mcp), Find MCP, and Admin MCP are Laravel HTTP OAuth servers. They may appear as session names… |
| [exampletest-not-smoke.md](memory/exampletest-not-smoke.md) | ExampleTest visits / → /login. Login Blade hits MySQL via Helper::userActiveSubscription. If MySQL is refused, that test 500s. That is not “the whole suite is broken.” |
| [helper-saveailead-location.md](memory/helper-saveailead-location.md) | Helper::saveAILead is defined in app/Helpers/helpers.php. Do not assume it only lives in Globals/Helper.php. |
| [laravel-lockfile-5.3.md](memory/laravel-lockfile-5.3.md) | Installed laravel/framework is v5.3.31. Write PHP 7.2-compatible code. Do not use Laravel 8+ or PHP 8 syntax (?->, named arguments, typed property promotion, match). |
| [llm-wiki-is-this-brain.md](memory/llm-wiki-is-this-brain.md) | The LLM Wiki pattern lives in TerriTool AI Brain/ (index.md, log.md, ingest/query/lint). Do not create wiki/ beside it. |
| [local-qa-url-artisan-serve.md](memory/local-qa-url-artisan-serve.md) | Canonical local QA URL is http://127.0.0.1:8000/login (npm run serve / php artisan serve). Do not open http://localhost:8888/webterritool/public (or /webterritool/public/index.php/… |
| [mamp-php-version-compatibility.md](memory/mamp-php-version-compatibility.md) | MAMP was configured for PHP 8.2.20 on 2026-09-16. Opening http://localhost:8888/webterritool/public/index.php/login showed Laravel 5.3/Symfony deprecation notices from vendor code… |
| [manager-bundle-build-artifact.md](memory/manager-bundle-build-artifact.md) | The Manager Portal bundle public/js/manager-portal.js is a build artifact. Edit resources/manager-portal/, then npm run build (or npm run dev). resources/js is not the React app (i… |
| [mcp-create-route-publishes.md](memory/mcp-create-route-publishes.md) | MCP create_route publishes (Published tab, not Draft) and returns route_url. The web UI can save a Draft. Do not make MCP save Draft, and do not make web always publish, unless pro… |
| [playwright-test-unavailable.md](memory/playwright-test-unavailable.md) | package.json contains test:e2e: playwright test, but the repository has no Playwright configuration or spec files. On 2026-09-16, it failed before test discovery because the instal… |
| [save-ai-leads-not-add-company.md](memory/save-ai-leads-not-add-company.md) | save_ai_leads saves Find Leads / AI hunt hits (1 credit each, preview then confirm). add_company saves a named account the user wants in the book (free). find_ai_leads hunts new le… |
| [single-brain.md](memory/single-brain.md) | The only engineering knowledge system is TerriTool AI Brain/. Cursor rules/skills and .claude/skills/ point here; they are not a second bible. |
| [sql-dump-stale.md](memory/sql-dump-stale.md) | Do not trust database/webterritool.sql. Schema truth is live MySQL. Do not query or migrate coffee_*, bookings, booking_*, or stocks. |
| [two-frontend-stacks.md](memory/two-frontend-stacks.md) | Two frontend stacks. Route starts with /manager or file is under resources/manager-portal/ → React + Vite. Everything else in the browser → Blade + jQuery. Do not introduce React o… |

## Learnings

| Page | Summary |
|------|---------|
| [Learning loop](learnings/README.md) | Documentation supports execution. After a task, record what the next agent needs — in this Brain only. |
| [Failed approaches](learnings/failed-approaches.md) | Things agents keep trying that are wrong for TerriTool. |
| [Gotchas](learnings/gotchas.md) | Durable traps. Add a row when you lose time to one. Densest traps also have a one-fact file in ../memory/MEMORY.md — link it; do not paste the paragraph twice. |
| [Operational notes (cross-feature)](learnings/operational-notes.md) | What was left of the former 07-Operational-Reference/ after its per-feature sections moved beside their modules on 2026-09-16. Verified against code / the live database on 2026-09-… |
| [Recurring bugs](learnings/recurring-bugs.md) | From bible known-issues.md, Playwright dumps, and code comments. Not a full ticket log. |
| [Successful patterns](learnings/successful-patterns.md) | Approaches that worked on this repo. Add a row when a loop actually succeeded. |

## Validation / QA

| Page | Summary |
|------|---------|
| [Validation — three real engineering tasks](validation/README.md) | Ran 2026-09-16 against this Brain + the live repo. Local app servers were down. Playwright MCP browser profile was locked (Browser is already in use). Staging login was reachable. |
| [QA — FLOW-AUTH live browser run (2026-09-16)](validation/qa-auth-run-2026-09-16.md) | QA loop: ../loops/qa-loop.md. Superseded local QA URL: use http://127.0.0.1:8000/login going forward — not this MAMP /public path (../memory/local-qa-url-artisan-serve.md). |
| [QA — authenticated Sales Agent smoke (2026-09-16)](validation/qa-authenticated-smoke-2026-09-16.md) | QA loop: ../loops/qa-loop.md. Local MAMP / Apache / PHP 7.4.33. A user-supplied local Sales Agent fixture was used; no credential values or customer data are recorded here. |
| [QA — full flow pass 2026-09-16](validation/qa-full-2026-09-16.md) | QA loop: ../loops/qa-loop.md. Env: Customer MCP (user 1822), staging guest GET, local /login 500, Playwright MCP locked, MAMP no response. PHPUnit Manager 17 OK. |
| [QA recheck — execution readiness and flow contract (2026-09-16)](validation/qa-recheck-2026-09-16.md) | QA loop: ../loops/qa-loop.md. This is a fresh source, test, and browser-environment recheck. It does not replace the earlier full flow pass: authenticated browser paths still requi… |

## Operating

| Page | Summary |
|------|---------|
| [Claude operating model](operating/claude.md) | Follow: Understand → Plan → Execute → Verify → Learn |
| [Codex operating model](operating/codex.md) | Codex is the PR / review / delivery agent, not the product-explorer. |
| [LLM Wiki — this Brain](operating/llm-wiki.md) | Pattern: Karpathy, LLM Wiki. Instantiated inside TerriTool AI Brain/. Do not create a second wiki/ pack. |

## Decisions

| Page | Summary |
|------|---------|
| [Decisions](decisions/README.md) | Record durable engineering choices here. Product behavior lives in features/*/MODULE.md. |

## Tools

| Page | Summary |
|------|---------|
| [Tool layer](tools/README.md) | The Brain is useless if agents do not run tools. Prefer the real environment. |

## Unassigned evidence catalogs

| Page | Summary |
|------|---------|
| [Evidence](evidence/README.md) | Staging and device captures used to verify UI. Filenames often use a narrow no-break space (U+202F) before AM/PM. |
| [Unassigned evidence catalog](evidence/catalog-unassigned.md) | Captures that are not yet tied to a feature. Feature-assigned screenshots moved to features/<module>/evidence/ on 2026-09-16 (see each module's evidence.md). Filenames use a narrow… |

