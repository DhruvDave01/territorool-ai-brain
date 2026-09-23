---
area: audits
tags: [brain/audits]
ref: "Audit 10 — Territool AI Brain final audit"
---

# Audit 10 — Territool AI Brain final audit

Response to the owner's "AUTONOMOUS IMPROVEMENT LOOP" request (2026-09-16): inspect, test, document, score and
improve the **brain itself** to ≥ 90 in every major category, with **application code frozen**. Task brief:
`workspace/tasks/2026-09-16-brain-improvement-loop.md`.

## 1. Executive summary

The brain was audited against a written 18-category rubric (`brain/context/brain-scorecard.md`), tested by
running the real apps read-only on staging, and corrected where evidence disagreed with it. The average category
score rose from **67 to 92**; **17 of 18 categories reached ≥ 90**, and the one below (QA coverage, **75**) is
held down by product constraints the brain cannot remove alone (no payment sandbox, no CI, most write flows
untestable without spending credits) — those are named, not hidden.

Nothing in `repos/` changed: `git status` in both repos equals the baseline in
`workspace/loop/2026-09-16-brain-loop/baseline-git.txt`. No credential left `.local/`. `brain-parity` is OK and
`brain-check` passes except the two report files that this audit is one of.

The work also **found 11 previously-unrecorded application issues**, four of them Critical/High security
findings, all filed in `UPCOMING_IMPROVEMENTS.md` and **not** fixed (per the freeze).

## 2. Overall brain score

| | Iteration 0 (before) | Iteration 1 (this audit) |
|---|---:|---:|
| Average of 18 categories | 67 | **92** |
| Lowest category | 40 (Data) | **75 (QA coverage)** |
| Categories ≥ 90 | 2 | **17 / 18** |

Companion per-feature confidence score (`tools/brain-score.js`): **43 → 55 / 100** (it weights heavily on tests
and QA reports existing for every feature, which is deliberately hard to raise).

## 3. Category scores (see `brain-scorecard.md` §2 for the per-check detail)

| # | Category | 0 → 1 | # | Category | 0 → 1 |
|---|---|---|---|---|---|
| 1 | Product understanding | 70 → 95 | 10 | QA coverage | 40 → **75** |
| 2 | Mobile flow knowledge | 80 → 95 | 11 | Evidence quality | 70 → 95 |
| 3 | Web flow knowledge | 60 → 95 | 12 | Documentation completeness | 60 → 95 |
| 4 | Role & permission | 50 → 95 | 13 | Documentation accuracy | 70 → 90 |
| 5 | Design brain | 80 → 90 | 14 | Brain consistency | 60 → 95 |
| 6 | Architecture | 70 → 95 | 15 | Uncertainty handling | 70 → 95 |
| 7 | API | 50 → 95 | 16 | Maintainability | 90 → 90 |
| 8 | Data / model | 40 → 95 | 17 | Searchability | 90 → 95 |
| 9 | Cross-platform mapping | 70 → 90 | 18 | Future developer usefulness | 80 → 95 |

## 4. Mobile coverage

Ran the app on a **second** iOS simulator (build 42.32 (1), staging) as **Sales Agent** and **Business Sales
Agent** with Maestro (`workspace/test-suites/mobile/F01-login-main-nav.yaml`, `run.js`). 18 screenshots,
evidence EV-M01–M12. Verified login, the footer-less Dashboard, Address Book, Routes Library, Lists, AI Find
Leads and Settings, and the SA↔BSA differences (credits, plan controls, 7 vs 6 status tags). Confirmed KG-UI1
("Invalid Date PT") still present. Write flows rely on the owner's captures/recordings (U-MOB-01); Android is
untested (U-MOB-02). The owner's booted simulator was never driven.

## 5. Web coverage

Read-only crawl of staging as SA, BSA and Business Agent (`tools/web-explore.js`; 69 pages; every non-GET
aborted). Built `web-flows.md` (page inventory per role, step-level flows, a role access matrix) and the
manager-portal contract suite (`workspace/test-suites/web/`, 9 cases, all pass). Admin HQ could not be driven
(reCAPTCHA on `/hq/login`, U-ADM-01).

## 6. Admin coverage

Read-only by owner authorisation. Login is blocked by a reCAPTCHA, so Admin HQ is documented from code
(`routes/web.php:97-180`) and the owner's `ADM-*` screenshots, not from runtime. The Admin credential is stored
only in `.local/`. Finding UI-SEC-03 (HQ state-changing GET routes) came out of this review.

## 7. Role coverage

`roles-permissions.md`: role × surface and role × capability matrices with evidence, plus the enforcement points.
Runtime-verified: the mobile API admits Admin (BT-1 defect) and refuses a Business Agent; web redirects reps
from `/manager` and `/hq`; the manager portal API gates by team. Ownership probes found two IDOR reads
(UI-SEC-10, UI-SEC-11).

## 8. Design brain score — 90

`design-system.md` verified against code (tokens mirror `brain/assets/tokens/`); new `design-states.md` records
loading/empty/error per surface. Held below 95 by the lack of a per-screen state matrix and a full re-verification
of every design claim (design Mode C, future work).

## 9. Architecture / API / Data

New generated, self-checking notes: `architecture.md`, `api-map.md` (145 routes, generator + `--check`),
`data-model.md` (66 models, generator + `--check`), `system-map.md` (role→…→next). Business-rule credit logic was
read from the code (`business-rules.md` §10). API envelopes, auth, public endpoints and per-role response shapes
are runtime-observed (`api-map.md` §6).

## 10. Testing & QA — 75 (the one category below 90)

- **Built and run:** the API contract suite grew from 8 to **44 cases** (32 pass, 9 known gaps, 2 waived, 0 fail)
  across F01–F03, F05, F06, F08–F14, F20, F26, F27; a **web contract suite** (F23, F24, 9 cases); and a **mobile
  Maestro flow** (F01/F05, both roles). Test-case docs are generated (`tools/test-cases-doc.js`).
- **Brain QA:** 30 adversarial questions answered by two independent agents from the brain alone — **97% each,
  identical answers, unknowns handled** (`brain-qa.md`), which surfaced and fixed 10 inconsistencies.
- **Why not 90:** no staging payment sandbox, so F03/F15 stop before Pay (U-PAY-01); write flows (create route,
  add company/contact, buy contacts) are not run by the brain because they mutate data or spend credits;
  Playwright visual assertions and Maestro write flows are not built; there is no CI. These need owner setup or
  are out of the freeze. **Blocker recorded** in `brain-scorecard.md` and `UNKNOWN_REGISTER.md`.

## 11. Findings handed to the product (not fixed — code freeze)

`UPCOMING_IMPROVEMENTS.md` §1. Highlights:
- **UI-SEC-04 (Critical):** any signed-in web user can broadcast a push to every device (`/notification`).
- **UI-SEC-07 (Critical):** webhooks (Apollo, FullEnrich, RevenueCat) verify no signature — a forged RevenueCat
  event can grant a paid plan.
- **UI-SEC-11 / UI-SEC-10 (High):** `simplerouteview` and `getlastvisitedentry` return other users' routes and
  visit logs by id (IDOR, confirmed at runtime).
- **UI-SEC-01 / UI-SEC-08 / UI-SEC-09 (High):** unauthenticated `getUsers` (personal data), `zapier*` writes by
  `user_id`, and a public `validate-phone` with a hard-coded key.
- Plus API-robustness (UI-API-02/03/04), performance (UI-PERF-01/02) and UX (UI-UX-01…05) items.

Pre-existing gaps stay in `known-fragile.md` §5; KG-BT1 was runtime-confirmed this cycle.

## 12. Method, honesty and limits

- Evidence priority and VERIFIED/INFERRED/UNKNOWN labelling per the owner's rules; runtime ≠ code-read.
- Every generated table is provably current (`--check`); citations are drift-checked (`cite-check.js`);
  the two graph views are proven equal (`brain-parity.js`).
- **Score integrity:** a known product defect that the brain documents does not raise or lower the score.
  Categories held below 90 are named with their blockers rather than rounded up.
- **Open owner items** unchanged by this audit: Q-P9, Q-T1, Q-T2, Q-T4, Q-T5, CR-06, CR-07, CR-17, CR-22, S5,
  and the unknowns needing access in `UNKNOWN_REGISTER.md` §1.

## 13. Stopping condition

Stopped per the prompt's condition (B): every category is ≥ 90 **except** QA coverage (75), which cannot reach 90
without unavailable evidence (payment sandbox, CI) or prohibited application changes. That blocker is documented.
Iteration 2's gap→action plan is in `brain-scorecard.md` §3 for when the owner unblocks payments/CI.

## 14. Verification record

- Repos vs baseline: **unchanged** (`workspace/loop/2026-09-16-brain-loop/baseline-git.txt`).
- `node tools/brain-check.js`: all green after this report exists.
- `node tools/brain-parity.js`: PARITY OK.
- QA report: `workspace/qa-reports/2026-09-16-brain-improvement-loop.md`.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (40)

**Documents (19):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/business-rules|Business rules: plans, credits and money]] · [[_code/brain/tools/brain-score.js|Confidence score: how well the brain equips an agent to take a task on each product feature.]] · [[brain/context/data-model|Data model: what Territool stores and where]] · [[brain/context/design-states|Design states: loading, empty, error and their variants per surface]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[_code/brain/tools/brain-parity.js|Proves the two views of the brain show the same graph.]] · [[workspace/qa-reports/2026-09-16-brain-improvement-loop|QA report: autonomous brain improvement loop (iteration 1)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[brain/context/system-map|System map: role → platform → screen → action → API → data → result → next]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product features (12):** [[_id/F14|Activities / notes / log meetings]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F24|Business Sales Agent management]] · [[_id/F08|Create route]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F15|Find & buy contacts]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F27|Notifications & push]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F26|Support tickets]]

**Coding rule (1):** [[_id/M12|Meaningful test IDs]]

**Owner decisions (6):** [[_id/BT-1|Block Admin on the mobile app]] · [[_id/Q-T1|Question: are the automated app tests run today?]] · [[_id/Q-T5|Question: does staging have test payments?]] · [[_id/Q-P9|Question: is the customer AI connector sold?]] · [[_id/Q-T2|Question: keep Detox or only Maestro?]] · [[_id/Q-T4|Question: review the known-issues draft]]

**Problem founds (2):** [[_id/KG-UI1|“Invalid Date” on home screen]] · [[_id/KG-BT1|Admin can log in to mobile]]

%% brain-links:end %%
