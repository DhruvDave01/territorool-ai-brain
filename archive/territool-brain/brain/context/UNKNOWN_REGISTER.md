---
area: context
tags: [brain/context]
ref: "Unknown register: what the brain does not know yet"
---

# Unknown register: what the brain does not know yet

> [!info] Rendered from `brain/memory/` — edit the entries, not this table
> Each ID row below is stored verbatim in its memory entry (`node tools/memory.js context UNKNOWN_REGISTER`). Prose outside the tables lives in `brain/memory/_templates/UNKNOWN_REGISTER.md`. Rebuild: `node tools/memory.js render`.

Every open question, including those that are not owner questions. **Owner questions** (`Q-*`) stay in
`open-questions.md` and are listed here only by id. Unknowns are acceptable; hidden unknowns are not.

**Importance:** High = a BLOCKER/HIGH feature or security depends on it · Medium · Low.
**Blocks 90+?** = whether the category score can reach 90 without it (see `brain-scorecard.md`).

## 1. Needs access or a person

| ID | Question | Area | Why unknown | Evidence checked | What would resolve it | Importance | Blocks 90+? |
|---|---|---|---|---|---|---|---|
| U-ADM-01 | What Admin HQ shows **at runtime** today (pages, tables, actions) | Admin, F25 | `/hq/login` has a reCAPTCHA; automation does not solve it; `/login` refuses Admin | EV-W03, EV-W04; the owner's `ADM-01`…`ADM-21` (2026-09-15) and `routes/web.php:97-180` are known | the owner signs in once in a browser the brain can drive read-only (Claude in Chrome), or provides a captcha-free staging Admin path | Medium | Web flow (3) and Roles (4) can reach 90 on code + owner screenshots; a runtime HQ pass would lift them further |
| U-ENV-01 | Is `API_DEBUG` off in **production** (it is on for staging)? | Security | production is off-limits (S0.1) | EV-A03 (staging); USER SAID "off on staging/prod" | the owner checks the production `.env` | High | No (recorded as CR-06) |
| U-ENV-02 | Does production have the `/notification` broadcast route and the public `getUsers`? | Security | production is off-limits | code on `beta_react` (EV-C01, EV-W07) | the owner compares the deployed branch | High | No |
| U-DEP-01 | How mobile store builds and the web deploy are produced (CI? manual? `--no-dev`?) | Architecture | no CI or fastlane in either repo | `architecture.md` §2 | the owner describes the release process | Medium | No (architecture scored with this marked UNKNOWN) |
| U-PAY-01 | What happens past the Pay / Confirm step, **as verified by the brain itself** (RevenueCat, Stripe, buy contacts) | F03, F15 | no payment setup (USER SAID 2026-09-15). The owner's web screenshots `SLS-61`/`SLS-62` do show a completed web payment (`business-rules.md` §5); mobile purchase and buy-contacts confirmation are not captured | owner captures | a staging payment sandbox (Q-T5) | High | QA coverage for F03/F15 cannot pass the pay step |
| U-QUE-01 | Does the staging queue worker run now? (bulk contacts, route PDFs) | F08, F15 | the 2026-09-15 check found jobs stuck | KG-Q1 | the owner checks Supervisor / `queue:work` | Medium | No |

## 2. Needs more evidence (the brain can resolve these itself)

| ID | Question | Area | Why unknown | Evidence checked | What would resolve it | Importance | Blocks 90+? |
|---|---|---|---|---|---|---|---|
| U-API-01 | Request/response fields of the write endpoints (`createroute`, `addcompany`, `addcontact`, `addcompanyactivity`, `buyContacts`) | API | only read endpoints were exercised; writes are not run | code | read each action's `Validator` and response; runtime only with `QA-AUTO-` data (S6.4) | Medium | API (7): shapes of key reads are verified; writes are code-level |
| U-API-02 | ~~How webhook callers are authenticated~~ **Resolved 2026-09-16: they are not** (UI-SEC-07, EV-C13) | Security | — | `WebhookController.php` | — | — | — |
| U-API-03 | ~~How the Zapier endpoints identify the user~~ **Resolved 2026-09-16: by `user_id` in the request, no key** (UI-SEC-08, EV-C14) | Security | — | `SfdcController.php:811-814` | — | — | — |
| U-API-04 | Whether Laravel's `throttle:60,1` applies to Dingo routes | API | not tested (it would need a burst of requests) | `02-web.md` §4 | read the Dingo route middleware wiring | Low | No |
| U-DAT-01 | Real column types, indexes and foreign keys | Data | no schema in the repo; the 2019 dump is stale | `data-model.md` §3 | a read-only `SHOW CREATE TABLE` on staging (needs DB access, owner OK) | Medium | Data (8) can reach 90 on code; the schema remains INFERRED |
| U-DAT-02 | Are `user_contacts_credits` / `user_contacts_credit_charge` still written? | Data | not traced | model files | grep the writers | Low | No |
| U-MOB-01 | Runtime of the mobile write flows (create route, add company, activity) by the brain itself | Mobile | this pass was navigation-only | owner captures and recordings cover them (RT-W) | a `QA-AUTO-` data run on the second simulator, with cleanup | Medium | No: owner captures are runtime evidence |
| U-MOB-02 | Android behaviour | Mobile | no APK built (D-T7: iPhone first) | — | build a debug APK (approval) | Low | No |
| U-WEB-01 | Results pages that load by POST (find-leads results, DataTables) | Web | the explorer blocks every POST | EV-W01 | allow-list the known read-only POSTs after reading their code | Low | No |
| U-WEB-02 | What a Business Agent sees on the Blade pages it can still open | Roles | only headings were captured | EV-W02 | a screenshot pass as the BA | Low | No |
| U-BR-01 | Why one 13-lead save cost 23 credits (`SLS-06` → `SLS-07`) | Business rules | **the code charges at most one credit per selected lead** (`helpers.php:1143-1355`), so another spend happened in between; which one is not known | `business-rules.md` §10 | the owner's recollection, or the user's credit history | Low | No |
| U-BR-02 | ~~Renewal rules and unspent credits~~ **Resolved 2026-09-16:** monthly rows, annual ×12 on the anniversary, unused credits roll over (`business-rules.md` §10). Still open: **proration** on plan change | F04 | proration not traced | `CronController.php` | read `SubscriptionController` upgrade path | Low | No |
| U-KG-01 | Does KG-UI9 (6 vs 7 status slots in Admin HQ) come from editing a BSA-like account? | Admin | HQ not reachable at runtime | CR-17 | U-ADM-01 | Low | No |

## 3. Owner questions (full text in `open-questions.md`)

`Q-P9` (is the customer MCP sold?) · `Q-T1` (are the repo E2E flows run today?) · `Q-T2` (Detox or Maestro only?) ·
`Q-T3` (Admin login for tests: **partly answered 2026-09-16**, read-only account provided; the captcha still blocks
automation) · `Q-T4` (`fragile.md` review) · `Q-T5` (staging payment sandbox) · **CR-06** (API_DEBUG scope) ·
**CR-07** (may a Business Sales Agent subscribe on web?).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (64)

**Documents (36):** [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/business-rules|Business rules: plans, credits and money]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/context/data-model|Data model: what Territool stores and where]] · [[brain/memory/README|Knowledge memory — start here]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[brain/memory/entries/question/20260917-3cdb21-q-t3-admin-login-for-admin-role-tests-f01-bt-1-f|Q-T3 — Admin login for Admin-role tests (F01 BT-1, F25). Partly answered 2026-09-16: a read-only Admin account was p…]] · [[brain/context/open-questions|Questions put to the owner, and what came back]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/memory/entries/question/20260917-30327e-u-adm-01-what-admin-hq-shows-at-runtime-today-pa|U-ADM-01 — What Admin HQ shows at runtime today (pages, tables, actions)]] · [[brain/memory/entries/question/20260917-b4aaed-u-api-01-request-response-fields-of-the-write-en|U-API-01 — Request/response fields of the write endpoints (createroute, addcompany, addcontact, addcompanyactivity, buyC…]] · [[brain/memory/entries/question/20260917-e2d2e8-u-api-02-how-webhook-callers-are-authenticated-r|U-API-02 — ~~How webhook callers are authenticated~~ Resolved 2026-09-16: they are not (UI-SEC-07, EV-C13)]] · [[brain/memory/entries/question/20260917-b1149f-u-api-03-how-the-zapier-endpoints-identify-the-u|U-API-03 — ~~How the Zapier endpoints identify the user~~ Resolved 2026-09-16: by user_id in the request, no key (UI-SEC…]] · [[brain/memory/entries/question/20260917-48ae28-u-api-04-whether-laravel-s-throttle-60-1-applies|U-API-04 — Whether Laravel's throttle:60,1 applies to Dingo routes]] · [[brain/memory/entries/question/20260917-88a2aa-u-br-01-why-one-13-lead-save-cost-23-credits-sls|U-BR-01 — Why one 13-lead save cost 23 credits (SLS-06 → SLS-07)]] · [[brain/memory/entries/question/20260917-752afa-u-br-02-renewal-rules-and-unspent-credits-resolv|U-BR-02 — ~~Renewal rules and unspent credits~~ Resolved 2026-09-16: monthly rows, annual ×12 on the anniversary, unuse…]] · [[brain/memory/entries/question/20260917-3d03bc-u-dat-01-real-column-types-indexes-and-foreign-k|U-DAT-01 — Real column types, indexes and foreign keys]] · [[brain/memory/entries/question/20260917-f0a055-u-dat-02-are-usercontactscredits-usercontactscre|U-DAT-02 — Are user_contacts_credits / user_contacts_credit_charge still written?]] · [[brain/memory/entries/question/20260917-500f45-u-dep-01-how-mobile-store-builds-and-the-web-dep|U-DEP-01 — How mobile store builds and the web deploy are produced (CI? manual? --no-dev?)]] · [[brain/memory/entries/question/20260917-e0afdd-u-env-01-is-apidebug-off-in-production-it-is-on-|U-ENV-01 — Is API_DEBUG off in production (it is on for staging)?]] · [[brain/memory/entries/question/20260917-f055cc-u-env-02-does-production-have-the-notification-b|U-ENV-02 — Does production have the /notification broadcast route and the public getUsers?]] · [[brain/memory/entries/question/20260917-99460c-u-kg-01-does-kg-ui9-6-vs-7-status-slots-in-admin|U-KG-01 — Does KG-UI9 (6 vs 7 status slots in Admin HQ) come from editing a BSA-like account?]] · [[brain/memory/entries/question/20260917-ea1fe5-u-mob-01-runtime-of-the-mobile-write-flows-creat|U-MOB-01 — Runtime of the mobile write flows (create route, add company, activity) by the brain itself]] · [[brain/memory/entries/question/20260917-215935-u-mob-02-android-behaviour|U-MOB-02 — Android behaviour]] · [[brain/memory/entries/question/20260917-0ed83a-u-pay-01-what-happens-past-the-pay-confirm-step-|U-PAY-01 — What happens past the Pay / Confirm step, as verified by the brain itself (RevenueCat, Stripe, buy contacts)]] · [[brain/memory/entries/question/20260917-117b4b-u-que-01-does-the-staging-queue-worker-run-now-b|U-QUE-01 — Does the staging queue worker run now? (bulk contacts, route PDFs)]] · [[brain/memory/entries/question/20260917-1de9c0-u-web-01-results-pages-that-load-by-post-find-le|U-WEB-01 — Results pages that load by POST (find-leads results, DataTables)]] · [[brain/memory/entries/question/20260917-0b4ad0-u-web-02-what-a-business-agent-sees-on-the-blade|U-WEB-02 — What a Business Agent sees on the Blade pages it can still open]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product features (6):** [[_id/F25|Admin HQ]] · [[_id/F08|Create route]] · [[_id/F15|Find & buy contacts]] · [[_id/F01|Login & session]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F04|Subscription & credit renewal]]

**Coding rules (2):** [[_id/S0.1|Never touch the live app]] · [[_id/S6.4|Staging test data rules]]

**Owner decisions (8):** [[_id/BT-1|Block Admin on the mobile app]] · [[_id/Q-T3|Question: Admin login for Admin tests]] · [[_id/Q-T1|Question: are the automated app tests run today?]] · [[_id/Q-T5|Question: does staging have test payments?]] · [[_id/Q-P9|Question: is the customer AI connector sold?]] · [[_id/Q-T2|Question: keep Detox or only Maestro?]] · [[_id/Q-T4|Question: review the known-issues draft]] · [[_id/D-T7|Test on iPhone first]]

**Problem founds (2):** [[_id/KG-UI9|Admin HQ "Edit salesperson" exposes 6 status slots,…]] · [[_id/KG-Q1|Background jobs not running on staging]]

**Screenshots (6):** [[_capture/ADM-01|Admin HQ Home — leaderboard + timeframe stats (Logged In, Created Routes, Activity, New Users)]] · [[_capture/ADM-21|Admin login — E-Mail, Password, **reCAPTCHA 'I'm not a robot'**, Remember Me, Forgot Your Password]] · [[_capture/SLS-06|AI Find Leads — 'Adding your leads' modal saving 13 selected leads, 10% progress, 'This usually takes about 10 seconds. Please keep this tab open.']] · [[_capture/SLS-07|Create Routes step 2 of 2 — Select Start Point / End Point dropdowns over a pin map, Save as Draft / Generate Route]] · [[_capture/SLS-61|Plans & Packages step 2 — Payment: promo code, itemised total (Base $69 + 50 Credits $25 = $94), saved or new card, Visa/Mastercard/Discover/Amex, Pay Now]] · [[_capture/SLS-62|Purchase confirmation — 'Your subscription has been upgraded with 50 additional credits'; balance 180; subscription history now lists Base Package with a Download Invoice, and Package Add-Ons shows 50 credits / $25]]

**Code files (4):** [[_code/web/app/Http/Controllers/CronController.php|CronController]] · [[_code/web/app/Helpers/helpers.php|helpers]] · [[_code/web/app/Http/Controllers/SfdcController.php|SfdcController]] · [[_code/web/app/Api/V2/Controllers/WebhookController.php|WebhookController]]

%% brain-links:end %%
