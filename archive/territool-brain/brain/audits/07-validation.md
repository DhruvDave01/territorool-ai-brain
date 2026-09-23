---
area: audits
tags: [brain/audits]
ref: "Audit 7 – proving the brain works"
---

# Phase 7: Validate the brain

- **Date:** 2026-09-15.
- **Mode:** read-only on repos and staging. Nothing was created, changed, purchased or sent on staging. Production was never contacted.
- **Scripts used:**
  - `brain/gates/scripts/static-checks.js` (new `--commit` mode)
  - `tools/probe-styles.js` (new)
  - `tools/queue-probe-readonly.js` (new)
- **Credentials:** read from `.local/` at runtime and never printed.

## 0. Approval record for Phase 6, and owner decisions (USER SAID, 2026-09-15)

> "approve for phase 7 … no Admin Login for now payment setup skip just before the Payment ask you can skip and login and use already user for further testing. offline Drop. Staging PHP Version skip cause it will not change you can use 7.4.33 … do it Queue worked"

| Decision | Recorded in |
|---|---|
| Phase 6 approved, including the loop escalation safeguards | `brain/skills/territool-router/LOOP.md` |
| No Admin login for now; Admin checks waived | `conventions-shared.md` S6.4; `qa-gate.md` waivers; `stack.md` §8 |
| No payment setup; flows run with existing staging users **up to the step before paying**, then stop | S6.4; `territool-test` safety; `qa-gate.md` waivers; `CLAUDE.md` rule 5 |
| **Offline mode dropped** (BT-11) | S3.9; `parity-map.md` F32; `known-fragile.md` KG-BT11 |
| Staging PHP check skipped; **PHP 7.4.33** is the runtime target (BT-12 closed) | `stack.md` §4, §8 |
| Queue worker check requested (BT-10) | §4 below |
| Visual graph of the brain requested | Artifact "Territool Brain Map" |

## 1. Retrospective: a real change that touched both repos

**Change:** referral invites, 2026-07-01.
- Web `682e68dc` "user invitation api change": new V2 `invite-user`, `InviteController`, `InviteRewardService`, `UserInvitee`, reward calls in 4 registration or purchase paths.
- Mobile `d15d5a2` "Wire invite-user API into referral Send invite flow".
- Follow-ups: mobile `1b562bb` and `4839a49` on 2026-07-02, both copy changes to the success state.

**Method:**
- `static-checks.js --commit <sha>` on both commits.
- Manual REVIEW of the diffs against `code-gate`, `design-gate`, `test-gate`, `qa-gate`.
- A HEAD request to the invitation link, without following the redirect.

### 1.1 What the brain would have caught as it was built in Phase 6

| # | Finding in the real change | Brain rule | How | Evidence |
|---|---|---|---|---|
| R1 | Controller parses and refreshes the JWT itself instead of `\Auth::user()` | W6 / CG-W6 | **AUTO FAIL** (2 findings) | `InviteController.php:120, 124` (as added by `682e68dc`) |
| R2 | Literal `fontSize: 13` in new mobile style | M8 / CG-M8 | **AUTO FAIL** | `ReferralInviteModal.styles.js:140` |
| R3 | New service and model helpers shipped with no PHPUnit test | W8 / CG-W8 | REVIEW + CMD | `repos/web/tests` has no invite tests |
| R4 | Change touches T1 `V2/AuthController.php` and web `RegisterController` | `known-fragile` §3–§4 | QA tier rule → F01/F02 BLOCKER regression + API contract suite | `682e68dc` stat |
| R5 | Unrelated `CronController` log move inside a feature commit (payment cron file) | CG-A1 scope | REVIEW | `682e68dc` CronController hunk |
| R6 | Parity: the app requires a phone with ≥ 10 digits; the API accepts any non-empty digit string | TG-4 validation per platform + QG-9 parity | test cases per platform | `ReferralInviteModal.js` `isValidPhone`; `InviteController` `'phone' => 'nullable|string'` |
| R7 | Glossary and copy review of new UI text | CG-A8 / DG-A6 | REVIEW | — |

### 1.2 What it would have **missed**, and the gate changes made

| # | Missed finding (verified) | Why the Phase 6 brain missed it | Gate change (Phase 7) |
|---|---|---|---|
| M1 | **Copy promised an action the system doesn't take.** Mobile said "Invite sent! Your invite is on its way", but the API only stores a record and returns a link; nothing is sent. The copy was corrected twice the next day (`1b562bb`, then `4839a49` "Invite Link Generated!") | No gate item tied success copy to the code path; QG-6 accepted API-level evidence | **CG-A10** copy matches behaviour; **QG-6** end-to-end user-visible promise |
| M2 | **Credit reward correctness.** `applyRegistrationReward` runs from 4 call sites: V2 register (2), web `RegisterController`, and `HomeController::successRevenueCat` (`HomeController.php:882` inside `successRevenueCat`, from line 824). The invitee record is never consumed (the delete is commented out), so a second path for the same user could grant twice (**plausible, not reproduced**). If the inviter has no `UserCredit` row, nothing is granted, yet the log still says "applied" | No rule for credit or money side effects; S3 has no invite-reward rule | **CG-A9** credit side effects (rule exists, idempotent, missing row handled, tested); **TG-4** credit side-effect cases |
| M3 | **Unbounded lookup.** `findRegisteredUserByPhone` loads every user with a phone into PHP and loops | CG-W11 only said "no query in loops" | **CG-W11** tightened: no unbounded full-table load |
| M4 | **Error shown in success colour.** API failures ("User is already registered…") go to `fieldMessageText`, styled `theme.colors.success` | No design item for colour meaning | **DG-B11** colour meaning |
| M5 | **Link leaves staging.** `invitation_link` is hardcoded to `https://territoolapp.page.link/App`, which redirects (HTTP 302) to **production** `/register`. People invited from staging register on production, so the reward flow can't be tested on staging | QG-6 didn't require checking where links land | **QG-6** "a link opens on staging, not production" |

### 1.3 Verdict

Before Phase 7 the brain would have **blocked this change**: R1 and R2 are AUTO FAIL, R3 is a REVIEW FAIL, and the R4 regression is mandatory. It would still have let through the two defects that actually produced follow-up commits (M1 copy, M4 colour) and the credit-correctness risk (M2). The gates now cover all five misses.

The static gate is heuristic. M1–M5 still depend on REVIEW discipline, which the gates now make explicit.

## 2. A real bug from `fragile.md`: would the QA gate have caught it?

**Bug:** "bulk contact production error fix" (`fragile.md` §2, 2026-03-23, marked **reached production**).
- **Introduced by `2acec7fa`** (2026-03-21, "bulk contact count api change from apollo to fullenrich"). It moved the contact-count logic from `CompanylController` into a new **`Helper::batchFetchFullEnrichContactCounts(array $domains)`** in frozen `app/Globals/Helper.php`.
  - The helper makes parallel cURL calls to FullEnrich.
  - No try/catch.
  - A non-nullable array parameter.
  - **The provider API key is hardcoded as the `config()` fallback.**
- **Fixed by `fe1cfde2`** (2026-03-23) by wrapping the function in `try { … } catch (\Throwable $e) { Log::error(…); return $domainToContactCount; }` and making the parameter nullable. The exact production exception isn't recorded in git.

| Gate | Would it have caught it? | Evidence |
|---|---|---|
| Static (`static-checks.js --commit 2acec7fa`) | **Yes: AUTO FAIL W7-frozen** (new method in `Helper.php:1092`). It forces the code into `app/Services/**` with a DB-free PHPUnit test (W8) | run output 2026-09-15 |
| Code gate REVIEW CG-W12 (Phase 6 wording "External calls wrapped + reported") | **Probably**, but the criterion was vague ("—") | `code-gate.md` Phase 6 |
| Secret detection (M17 / W15-secret) | **No.** The key literal `config('services.fullenrich.api_key', '<uuid>')` didn't match any pattern | regex review |
| QA tests on staging | **Unlikely to reproduce.** It was a provider or production-data failure. Staging has the same fallback key and different data, and TG-4 didn't require provider-failure cases | `test-gate.md` Phase 6 |

**Gate fixes made:**
1. **CG-W12** now lists six checkable points: timeout, `\Throwable` catch, defined fallback, report without secrets, defined missing-key behaviour, user-safe state.
2. **TG-4** requires **provider failure** cases (timeout, 401/403, 429, 5xx, malformed JSON) for every touched external call.
3. **`static-checks.js` secret detector extended**: a key-like literal on a line naming a key, secret or token. New fixture in `static-checks.selftest.js`.
4. **W17 false positive fixed.** PHPDoc `array{lat: mixed}` in `fe1cfde2` was flagged as PHP 8 syntax; comment lines are now skipped. New fixture.
5. Self-test: **all fixtures pass**. `--commit fe1cfde2` now reports only the real W7-frozen finding.

**New verified defect (pre-existing; reported, not fixed, S0.2):**
- The hardcoded FullEnrich key fallback is **still in HEAD at 5 sites**: `app/Globals/Helper.php:1003, 1891, 1941, 2524, 2891`.
- The key value is not reproduced here.
- Recorded as **KG-SEC2**. Owner action: move it to `.env`/config without a literal default, and consider rotating the key.

## 3. Design skill Mode A on an existing screen

- **Screen:** Manager portal → Salespeople (F24, Business Agent).
- **Output:** `workspace/design-proposals/2026-09-15-manager-salespeople-audit/audit.md`.
- **Result:** **16 findings** (5 HIGH, 7 MEDIUM, 4 LOW).

**Specific or generic? Specific and actionable.** Every finding carries a measured value, `file:line` and a token fix. Examples:
- Remove label `#EF4444` on `#FEE2E2` is 3.08:1 (`manager-portal-responsive.css:951-955`). Fix: `color.danger-text` on `color.danger-subtle`, 5.30:1.
- No menu control at 390 px.
- The fixed app banner covers content.
- DM Sans and Space Grotesk loaded in `_portal_layout.blade.php:6` against D-DS3.
- Avatar initials at 1.67–2.98:1 at the light stop.
- 29 px row actions.

**What made it specific:**
- The approved token set.
- The glossary.
- Owner decisions (Business Agent is web-only, which made the app-download banner finding possible).
- The new `tools/probe-styles.js`, which measures computed styles instead of eyeballing.

**Where the design context is still thin** (recommendations would otherwise be guesses):
1. **No web component specs** for data tables (header style, row height, zebra or hover), pagination, avatars (colour palette), confirmation modal, overflow menu, promotional banners. `design-system.md` §5 covers mostly mobile-first rules.
2. **No mapping from portal CSS variables** (`manager-portal.css:3-30`) to `--tt-*` tokens, and no decision on whether legacy portal screens migrate.
3. **No approved web icon set** (FontAwesome, emoji and inline SVG all in use).
4. **Product decisions missing:** portal name ("TerriTool Cockpit"); whether app promotions show to web-only roles; what "Remove" does to a Business Sales Agent's access and data (needed for confirmation copy).
5. **Evidence gaps:** no captures of empty and error states, Admin pages, or 768 px reviews; mobile captures are older `IMG_*` files.

The probe first mis-reported off-canvas sidebar items as visible and couldn't measure text on gradients. `probe-styles.js` now records `inViewport` and `backgroundImage`, and DG-B6 and DG-B8 say how to use them.

## 4. BT-10 queue worker check (owner: "do it")

**Code facts (read-only):**
- `config/queue.php:18` defaults to `sync`; local `.env` sets `QUEUE_DRIVER=database`. The staging `.env` is not accessible.
- `database/migrations` has the `jobs` and `failed_jobs` tables.
- The repo has no Supervisor, Procfile or deploy config, and no `queue:work` in `app/Console/Kernel.php`.
- 9 `ShouldQueue` jobs, including `BuyContactsBulkJob`, `RedeemFullEnrichBulkJob` (F15 BLOCKER), `SendWelcomeEmails`, `GenerateSampleRoutes`, `CreateAdvancedRoute`, `GenerateAdvancedRoutePDF`.
- The team already worked around it. `V2/RouteController::createRoute` runs the job in-request with the comment "QUEUE_DRIVER=database leaves status=processing (Draft tab) until a worker picks up the job". `publishRoute`, `updateRoute` and `reRoute` still `dispatch()` to the queue (`V2/RouteController.php:3179, 3319, 3423`).

**Staging observation** (`tools/queue-probe-readonly.js`: V2 `login` + GET `routelist` only):

| Account | Draft list | Newest draft created |
|---|---|---|
| Sales Agent | 62 routes: **5 "Processing"**, 39 "Failed", 18 "Draft" | 2026-08-31 |
| Business Sales Agent | 1 route: **1 "Processing"** | 2026-08-17 |

`GenerateSampleRoutes::handle()` always ends by setting `status = "published"`. The 6 routes still "Processing" were created **29, 36, 209, 216, 216 and 280 days ago** (ages from `created_date`; the server timezone isn't verified, so allow ± a few hours). None was ever completed by a worker.

**Conclusion (strong evidence, not proof for today):** jobs dispatched to the database queue are **not being processed on staging**. Either no worker is running, or the jobs die before finishing and aren't reported. The newest stuck route is 29 days old, and there's no sign that any dispatched job completed since. This matches the team's own `createRoute` comment.

**Impact on staging testing:**
- F08 route publish, update and re-route stay in Draft.
- F15 bulk contact buys (queued jobs) won't complete.
- Welcome and onboarding emails and advanced-route PDFs don't run.
- Recorded as **KG-Q1**. QA must treat these as environment-blocked, not as code regressions.

**Not verified:**
- Production: never contacted, by rule.
- The `jobs` and `failed_jobs` table contents: no DB access to staging.

**Owner action:** on the staging server, check `ps aux | grep queue:work` / Supervisor and `SELECT COUNT(*) FROM jobs`, then decide whether production needs the same check.

## 5. Where the brain is still weak, and what shoebox material would fix it

| # | Weakness | Effect | What would fix it (shoebox / owner) |
|---|---|---|---|
| W1 | **Test suites are designed, not built.** `workspace/test-suites/{api-contract,web,mobile}` are empty; Maestro isn't installed | The loop can't run automated regression yet; the first real task must build the runners | Approval to install Maestro when the first mobile task starts; the staging app build to test (which build/TestFlight points at staging) |
| W2 | **Business rules missing from S3:** invite rewards, subscription renewal and cancellation (F03/F04), package ids 4–6, BSA credit allocation | Credit and money changes trigger an escalation (CG-A9) every time | Shoebox `06-business-rules/`: plans and pricing sheet, credit rules per plan and action, RevenueCat and Stripe product IDs, referral programme terms |
| W3 | **Ops truth missing:** queue worker, cron schedule, deploy method (`--no-dev`), staging vs production config differences | Production-only failures (like `fe1cfde2`) can't be predicted on staging | Deploy runbook, Supervisor and crontab config, list of env keys that differ between staging and production (names only, not values) |
| W4 | **Payment and Admin waived** | F03, F15 confirm steps and F25 / BT-1 remain unverified end to end | Later: Admin staging account; staging payment sandbox (Stripe test mode, RevenueCat sandbox) |
| W5 | **Web and portal design context thin** (§3) | Web component recommendations are partly judgment calls | Preferred reference screens for portal tables and modals, icon-set decision, portal-to-token mapping approval, portal naming decision |
| W6 | **Mobile evidence is static.** `IMG_*` screenshots predate recent commits; no Android captures; no screen recordings | Mobile design and QA checks rely on code plus old images | Fresh iOS and Android recordings of F01, F06, F08, F10, F13, F14, F15 happy paths on staging; or approval to capture on the second simulator |
| W7 | **`fragile.md` unreviewed** (§2 "caught before release?", §3, §7) | Risk tiers are git-derived only | Owner answers + recurring support-ticket themes |
| W8 | **Static gate is regex-based** | False positives and negatives are possible (Phase 7 found and fixed one of each); REVIEW items depend on discipline | Keep adding fixtures for every miss (a rule now enforced by the self-test) |
| W9 | **Staging data drift:** test accounts carry 318 published, 39 failed and 6 stuck routes | Assertions on counts are unreliable | A seeded QA account or a cleanup decision for old staging data |
| W10 | **Graphs go stale** when files move | Impact maps can miss new modules | Regenerate graphs in `territool-code` post-flight when files are added (already listed; not enforced) |
| W11 | **Committed secrets:** FullEnrich key fallback (KG-SEC2), plus the known `.env` / config credentials | Security risk outside the new-code-only scope | Owner decision on a one-off secret-removal task |

## 6. Brain changes made in Phase 7

| File | Change |
|---|---|
| `brain/gates/scripts/static-checks.js` | `--commit <sha>` mode; key-like literal secret detection; W17 skips comments |
| `brain/gates/scripts/static-checks.selftest.js` | Fixtures: commit mode, key fallback, storage-key non-secret, PHPDoc shape |
| `brain/gates/code-gate.md` | CG-A9 credit side effects, CG-A10 copy matches behaviour, CG-W11 tightened, CG-W12 six-point external call rule |
| `brain/gates/design-gate.md` | DG-B6 reachable nav + no covering banner; DG-B8 gradients at lightest stop; DG-B11 colour meaning; DG-B12 hit targets |
| `brain/gates/test-gate.md` | TG-4 provider failure + credit side effects |
| `brain/gates/qa-gate.md` | QG-6 end-to-end user-visible promise; standing owner waivers |
| `brain/skills/territool-design/SKILL.md` | `probe-styles.js` for token-level measurement |
| `brain/skills/territool-test/SKILL.md` | Payment flows run up to the step before paying; Admin waived; offline dropped |
| `brain/skills/territool-router/LOOP.md` | Safeguards approved; standing waivers don't trigger escalation |
| `brain/context/*` | S3.9 offline dropped; S6.4 payment and Admin; stack PHP 7.4.33 + queue result; parity F32; known-fragile new KG rows |
| `tools/probe-styles.js`, `tools/queue-probe-readonly.js` | New staging-only, read-only tools |
| `workspace/design-proposals/2026-09-15-manager-salespeople-audit/` | Mode A output + probe data + screenshots |

## 7. Approval record (USER SAID, 2026-09-15)

> "Approvde for Phase 7 also can you show teh brain Graph till now how it looks as given in screen shot … like obsidian view of brain graph/map"

- **Phase 7 approved.** Bootstrap Phases 0–7 are complete. The brain is live: every Territool task starts with `territool-router`.
- **Brain graph (Obsidian-style):** `node tools/brain-graph.js` scans the brain notes and dependency graphs and writes `workspace/brain-graph/graph-data.js`; the viewer is `workspace/brain-graph/index.html`. Re-run the script after brain changes.
- **Carried forward unchanged:**
  - staging queue worker (KG-Q1)
  - hardcoded provider key (KG-SEC2)
  - `fragile.md` review
  - business rules sheet
  - ops runbook
  - Q-P9
  - fresh mobile recordings

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (90)

**Documents (30):** [[_code/brain/brain/gates/scripts/static-checks.js|Automatic code checker]] · [[brain/gates/code-gate|Checklist – code]] · [[brain/gates/design-gate|Checklist – design]] · [[brain/gates/qa-gate|Checklist – final quality check]] · [[brain/gates/test-gate|Checklist – tests]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[workspace/design-proposals/2026-09-15-manager-salespeople-audit/audit|Design audit – manager Salespeople page]] · [[brain/assets/docs/design-audits/2026-09-15-manager-salespeople-audit/audit|Design audit (Mode A): Manager portal · Salespeople]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/memory/entries/bug/20260917-4c9620-kg-q1-staging-queue-not-processed-strong-evidenc|KG-Q1 — Staging queue not processed (strong evidence): 6 routes stuck "Processing" for 29–280 days; queued jobs (bulk…]] · [[brain/memory/entries/bug/20260917-91b586-kg-sec2-fullenrich-api-key-hardcoded-as-the-conf|KG-SEC2 — FullEnrich API key hardcoded as the config() fallback (5 sites; value not reproduced)]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[log|Log]] · [[brain/context/parity-map|Mobile vs web differences]] · [[workspace/design-proposals/2026-09-17-lists-library-filter/placement|Placement walk-through: "add a filter to the Lists library"]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/conventions-shared|Rules for all code]] · [[_code/brain/brain/gates/scripts/static-checks.selftest.js|Self-test for the code checker]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[CLAUDE|Start here – brain overview]] · [[brain/context/stack|Tech setup & environments]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[_code/brain/tools/brain-graph.js|Tool – build this map]] · [[_code/brain/tools/queue-probe-readonly.js|Tool – check the job queue]] · [[_code/brain/tools/probe-styles.js|Tool – measure page styles]]

**Product features (13):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F25|Admin HQ]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F32|App launch, permissions, crash, offline]] · [[_id/F24|Business Sales Agent management]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F15|Find & buy contacts]] · [[_id/F01|Login & session]] · [[_id/F10|Mark visited & visit log]] · [[_id/F02|Registration & onboarding]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F04|Subscription & credit renewal]]

**Coding rules (15):** [[_id/W7|Business logic in services]] · [[_id/S0.2|Change new code only]] · [[_id/M4|Every network call reports errors]] · [[_id/W6|Get the user safely]] · [[_id/M2|Network calls only through API.js]] · [[_id/M5|Never log users out on errors]] · [[_id/M1|New screens as function components]] · [[_id/M8|No hard-coded colours or sizes]] · [[_id/M17|No secrets in the code]] · [[_id/S3.9|Offline mode dropped]] · [[_id/W15|Settings only in config]] · [[_id/S6.4|Staging test data rules]] · [[_id/M3|Success only when status is 1]] · [[_id/W8|Tests for new services]] · [[_id/W17|Works on PHP 7.4]]

**Quality checks (17):** [[_id/CG-W6|\Auth::user()]] · [[_id/CG-W12|Code gate REVIEW]] · [[_id/DG-B11|Colour meaning]] · [[_id/DG-B8|Contrast of new text pairs]] · [[_id/CG-A10|Copy matches behaviour]] · [[_id/DG-A6|Copy uses glossary terms]] · [[_id/TG-4|Coverage per changed behaviour]] · [[_id/CG-A9|Credits and money side effects]] · [[_id/CG-A1|Diff touches only files needed for the task]] · [[_id/CG-A8|Glossary terms in new user-facing copy]] · [[_id/QG-6|New functionality verified against the request / spec…]] · [[_id/CG-W8|New services have DB-free PHPUnit tests that pass]] · [[_id/CG-M8|No hardcoded colours / font sizes in new lines]] · [[_id/CG-W11|No query in loops]] · [[_id/QG-9|Parity check for shared flows]] · [[_id/DG-B6|Screen shell rules]] · [[_id/DG-B12|Touch/click targets]]

**Owner decisions (6):** [[_id/BT-1|Block Admin on the mobile app]] · [[_id/BT-10|Check the background job worker]] · [[_id/D-DS3|DIN font everywhere]] · [[_id/BT-11|Offline mode dropped]] · [[_id/Q-P9|Question: is the customer AI connector sold?]] · [[_id/BT-12|Server PHP version]]

**Problem founds (3):** [[_id/KG-Q1|Background jobs not running on staging]] · [[_id/KG-BT11|Half-removed offline cache]] · [[_id/KG-SEC2|Provider API key inside the code]]

**Code files (6):** [[_code/web/app/Api/V2/Controllers/AuthController.php|AuthController]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/web/app/Api/V2/Controllers/InviteController.php|InviteController]] · [[_code/mobile/App/components/dashboard/ReferralInviteModal.js|ReferralInviteModal.js]] · [[_code/mobile/App/components/dashboard/ReferralInviteModal.styles.js|ReferralInviteModal.styles.js]] · [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]]

%% brain-links:end %%
