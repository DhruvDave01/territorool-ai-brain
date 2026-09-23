---
area: context
tags: [brain/context]
ref: "Mobile vs web differences"
---

# Parity Map — APPROVED 2026-09-15 (Phase 3)

Status values:
- **identical**: same business rules (verified).
- **intentionally different**: by design (**owner-confirmed** or *proposed*, as marked).
- **accidentally different**: verified divergence. The owner-approved target is listed as **BT-n** (`brain/audits/03-parity.md` §7). Not fixed until a task asks.
- **missing**: absent where expected.
- **UNVERIFIED**: mapped only, rules not yet compared.

Criticality is **approved** (USER SAID, `03-parity.md` §7). Evidence: `03-parity.md` § sections and source files.

| Flow | Criticality | Mobile | Web | MCP | Status | Target / evidence |
|---|---|---|---|---|---|---|
| F01 Login & session | **BLOCKER** | ✅ | ✅ | OAuth | **accidentally different** | BT-1 block Admin on mobile API; BT-2 BSA follows manager's plan on mobile (§2 P1) |
| F02 Register & onboarding | **BLOCKER** | ✅ | ✅ | — | **accidentally different**: API lacks email format, password min, blocked domain, captcha, phone | §2 P2 (no target set yet) |
| F03 Subscription & paywall | **BLOCKER** | RevenueCat | Stripe/PayPal | — | **plans identical, billing rails differ by platform necessity** (verified in code 2026-09-16): the same `packages` drive both; the App Store mandates RevenueCat on mobile and web uses Stripe/PayPal. Purchase/cancel confirm steps not run (payment, S6.4) | `revenuecate-success` + `subscription/*`; EV-M07, EV-W06; §5 |
| F04 Renewal crons | **BLOCKER** | — | system | — | web/system only (owner-confirmed: payments & credits) | `routes/web.php:30-35, 84, 86`; BT-10 queue worker check |
| F05 Dashboard & activity feed | HIGH | ✅ | ✅ | — | **identical data, platform-specific layout** (runtime 2026-09-16: same credits/activity/counts via `getusercredit`+`getuserdata` on mobile, web and API; mobile has tiles, web has a tiled page) | EV-M02, EV-W01, EV-A01/A07; TC-F05-001/003 |
| F06 AI Find Leads | HIGH | ✅ | ✅ | ✅ | **identical credit rule, three UI implementations** (verified 2026-09-16): all save through `Helper::saveAILead` (1 credit/inserted lead, duplicates free — `business-rules.md` §10); mobile `MultipleAIWaypoint`, web `AILeadFinderController`, portal `ManagerFindLeadsService` | EV-M06, EV-W08/W09, EV-A01; `business-rules.md` §10 |
| F07 Places / Yelp leads | MEDIUM | Places | Yelp | — | **intentionally different by platform** (verified in code): `getYelpLeads` is web-only, Google Places is mobile-only — different providers, not a defect | code 2026-09-16; `flows.md` F07 |
| F08 Create route | HIGH | ✅ 2–400 | ✅ 150/city (legacy) | ✅ no cap | **accidentally different** | BT-5 2–400 globally, no per-city cap (§2 P6) |
| F09 Route detail & navigation | HIGH | ✅ | view/PDF | ✅ | **web is view/PDF only** (owner-confirmed via F10/BT-4: web has no Mark Visited); mobile is interactive — both serve route detail, verified runtime 2026-09-16 | EV-A14 (`simplerouteview`), EV-W01 (`/route/view`); parity F10 |
| F10 Mark visited | HIGH | ✅ | display only | ✅ direct write | Company-level visited is **correct** (owner-confirmed). Web without Mark Visited is **intentionally different** (owner-confirmed). MCP direct write + missing owner checks are **accidentally different** | BT-4 (§2 P8) |
| F11 Lists | HIGH | ✅ | ✅ | ✅ | **accidentally different**: API allows empty list; mobile checks list name against routes. **Library filter:** web grid filters name / quantity / date range (`list.blade.php:344-368`); mobile searches by name only (`list/index.js:236`) | §2 P7 (no target set yet). **Filter target (owner 2026-09-17): mobile matches web exactly (name, company count, date range), nothing more; layout differs on purpose (web inline filter row, mobile Filter By modal).** New criteria land on both platforms together (UI-UX-07) |
| F12 Companies | HIGH | ✅ | ✅ | search | **accidentally different**: required fields and phone rule | §2 P3 (no target set yet) |
| F13 Contacts | HIGH | ✅ | ✅ | ✅ | **accidentally different**: API charges 1 credit for manual add | BT-3 manual contacts free (§2 P4) |
| F14 Activities | HIGH | ✅ | ✅ | ✅ | **accidentally different**: web allows no type/date; Log Meeting split | BT-6 type + date + note required; BT-7 Log Meeting = Activity type Meeting (§2 P5) |
| F15 Find & buy contacts | **BLOCKER** | ✅ | ✅ | ✅ | **identical**: `buyContacts` is one shared controller for mobile, web and MCP (2 credits for a paid contact, 1 for the Claude/biz class), verified in code. The paid provider *fetch* endpoints were not run (they spend money / mutate) | §2 P9; `api-map.md` §4; `business-rules.md` §3 |
| F16 Report company/contact | MEDIUM | ✅ | ✅ | — | **identical** (shared controller) | §2 P9 |
| F17 Share route/list | MEDIUM | ✅ | ✅ | — | **identical feature both platforms** (code-verified): mobile calls API `shareRouteList`, web `RouteController@shareRouteList` (`routes/web.php:527`); the send itself was not run (email side effect) | code 2026-09-16 |
| F18 Scan business card | MEDIUM | ✅ | — | — | **mobile only** (verified: no web route for card scan; on-device camera + Gemini) | code 2026-09-16 (`routes/web.php` has none) |
| F19 QR route import | MEDIUM | ✅ | — | — | **mobile only** (verified: `scan-qr-code` is a mobile API caller; no web QR route) | code 2026-09-16 |
| F20 Settings / status tags | MEDIUM | ✅ | ✅ | — | **identical in data and counts** (runtime 2026-09-16): both read `user_status`; 7 tags for a Sales Agent, 6 for a Business Sales Agent, on mobile, web and API. The editors differ (mobile `updateuserstatus`, web `POST /salesperson/edit`); their validation is **not compared** | `web-flows.md` §1; TC-F20-001/002 |
| F21 CRM sync | MEDIUM | HubSpot | all CRMs | McpClient | **intentionally different by platform** (verified 2026-09-16): web connects Salesforce, HubSpot and Karma; mobile HubSpot only; plus outbound `McpClient`. A platform split, not a defect | EV-W06 (web Connect buttons); code |
| F22 Bulk CSV upload | MEDIUM | — | ✅ | — | **web only** (verified: `uploadcompany`/`uploadcontact` are web routes; no mobile caller) | code 2026-09-16 |
| F23 Manager portal | HIGH | — | ✅ | — | **intentionally different** (owner-confirmed: Business Agent web-only) | `01-mobile.md` §11 |
| F24 BSA management | HIGH | — | ✅ | — | **intentionally different** (owner-confirmed) | `01-mobile.md` §11 |
| F25 Admin HQ | MEDIUM | — | ✅ | Admin MCP | **intentionally different** (owner-confirmed: Admin HQ only) | see BT-1 |
| F26 Support tickets | LOW | API only (no mobile caller) | ✅ | — | **web + portal + API only** (verified): the V2 support endpoints exist and pass, but no mobile screen calls them; intentional, not a defect | TC-F26-001/002; `web-flows.md` W-F26; `api-map.md` |
| F27 Notifications | LOW | push only; the in-app inbox screen is unreachable | `/notification` is a broadcast **sender**, not an inbox (UI-SEC-04) | — | **push-delivery only; no notification inbox on either platform** (verified runtime + code 2026-09-16) | `web-flows.md` W-F27; CR-19; TC-F27-001 |
| F28 Referral | LOW | ✅ | server | — | **mobile-only user UI** (verified: `ReferralInviteModal` + `invite-user` on mobile; no web referral page in the crawl) | code + EV-W01 2026-09-16; KG-REF1/2/3 |
| F29 Customer MCP | MEDIUM (HIGH if sold, Q-P9) | — | — | ✅ | reuses V2 (**identical** by construction) except mark-visited direct write | `UserMcp/Services/CustomerApiClient.php:9-18` |
| F30 Admin MCP | LOW | — | — | ✅ | n/a | — |
| F31 MCP client & chat | MEDIUM | — | ✅ | outbound | web only | — |
| F32 App launch / permissions / crash / offline | MEDIUM | ✅ | — | — | mobile only; offline route list half-removed | BT-11 **drop offline** (USER SAID 2026-09-15; S3.9) |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (89)

**Documents (40):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[brain/context/business-rules|Business rules: plans, credits and money]] · [[brain/gates/qa-gate|Checklist – final quality check]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[_code/brain/tools/brain-score.js|Confidence score: how well the brain equips an agent to take a task on each product feature.]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-dbc233-cr-27-parity-map-f20-f26-f27-unverified-runtime-|CR-27 — parity-map F20/F26/F27: UNVERIFIED ↔ runtime + code evidence now exists]] · [[workspace/qa-reports/2026-09-16-f01-login-api-contract|F01 QA report — Login & session]] · [[workspace/qa-reports/2026-09-16-f22-bulk-csv-upload|F22 QA report — Bulk CSV upload]] · [[workspace/qa-reports/2026-09-16-f23-manager-portal|F23 QA report — Manager portal]] · [[workspace/qa-reports/2026-09-16-f24-business-sales-agent-management|F24 QA report — Business Sales Agent management]] · [[workspace/qa-reports/2026-09-16-f25-admin-hq|F25 QA report — Admin HQ]] · [[workspace/qa-reports/2026-09-16-f26-support-tickets|F26 QA report — Support tickets]] · [[FEATURE_SCORE_MODEL|FEATURE_SCORE_MODEL — how tools/brain-score.js computes feature task confidence]] · [[.claude/commands/memory-impact|memory-impact]] · [[shoebox/07-flows/flows|Original flow descriptions]] · [[workspace/design-proposals/2026-09-17-lists-library-filter/placement|Placement walk-through: "add a filter to the Lists library"]] · [[brain/memory/entries/decision/20260917-54748f-lists-library-filter-placement|Placement: a filter on the Lists library (mobile LS-20)]] · [[brain/context/flows|Product features list]] · [[brain/memory/entries/question/20260917-5a558b-q-p1-confirm-flow-criticality|Q-P1 — Confirm flow criticality]] · [[workspace/qa-reports/2026-09-16-brain-improvement-loop|QA report: autonomous brain improvement loop (iteration 1)]] · [[brain/context/open-questions|Questions put to the owner, and what came back]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-qa/SKILL|Skill – final quality check]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[workspace/tasks/2026-09-16-prove-the-loop-f01|Task brief: prove the loop end to end on F01 (API contract)]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/brain-graph.js|Tool – build this map]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product features (32):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F25|Admin HQ]] · [[_id/F30|Admin MCP]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F32|App launch, permissions, crash, offline]] · [[_id/F22|Bulk CSV upload]] · [[_id/F24|Business Sales Agent management]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F21|CRM sync]] · [[_id/F29|Customer MCP connectors]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F10|Mark visited & visit log]] · [[_id/F31|MCP client connections & chat]] · [[_id/F27|Notifications & push]] · [[_id/F07|Places / Yelp leads]] · [[_id/F19|QR route import]] · [[_id/F28|Referral invites]] · [[_id/F02|Registration & onboarding]] · [[_id/F16|Report company/contact]] · [[_id/F09|Route detail & navigation]] · [[_id/F18|Scan business card]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F17|Share route/list]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F04|Subscription & credit renewal]] · [[_id/F26|Support tickets]]

**Coding rules (2):** [[_id/S3.9|Offline mode dropped]] · [[_id/S6.4|Staging test data rules]]

**Owner decisions (11):** [[_id/BT-4|“Visited” is per company]] · [[_id/BT-6|Activity needs type, date & note]] · [[_id/BT-1|Block Admin on the mobile app]] · [[_id/BT-10|Check the background job worker]] · [[_id/BT-3|Hand-added contacts are free]] · [[_id/BT-7|Log Meeting = a Meeting activity]] · [[_id/BT-11|Offline mode dropped]] · [[_id/Q-P1|Question: how important is each feature?]] · [[_id/Q-P9|Question: is the customer AI connector sold?]] · [[_id/BT-5|Routes have 2–400 stops]] · [[_id/BT-2|Sales reps follow their manager's plan]]

**Problem found (1):** [[_id/KG-REF1|Invite reward can be given twice]]

**Screenshot (1):** [[_capture/LS-20|Lists library]]

**Code files (2):** [[_code/web/app/UserMcp/Services/CustomerApiClient.php|CustomerApiClient]] · [[_code/mobile/App/components/list/index.js|list/index.js]]

%% brain-links:end %%
