---
status: REVALIDATED-STRUCTURE-2026-09-17
area: context
tags: [brain/context]
ref: "Brain QA: questions the brain must answer correctly, and how it did"
---

# Brain QA: questions the brain must answer correctly, and how it did

> [!check] Re-validated 2026-09-17 (structure) — the earlier NEEDS-REVALIDATION flag is closed
> `node tools/note-revalidate.js` resolved all 59 structural claims in this note (endpoints, screens, tables, files
> and line numbers, ids) against the current code and brain data (mobile `f20c5aa`, web `21d6348c`): 0 unresolved.
> Checked against: the cited notes under `brain/context/`, `brain/context/evidence-ledger.md`, `brain/context/contradiction-register.md`, the test suites in `workspace/test-suites/api-contract/cases/` (TC ids).
> **Not re-observed:** runtime (RT) and owner-capture claims keep their original 2026-09-16 date and tier.

Tests the **brain**, not the product. Each question has an expected answer with its source in the brain.
An answerer that sees **only** the brain (never `repos/`) answers each question; the answers are graded.
The same set is run by at least two independent answerers to check consistency.

**Grading per question:** **2** = correct and cites the right note · **1** = correct but uncited or incomplete ·
**0** = wrong, or states as fact something the brain marks unknown. A question marked **(U)** expects the answer
"unknown / not verified", with the reason.

## Question bank (v1, 2026-09-16)

| # | Question | Expected answer (short) | Source in the brain |
|---|---|---|---|
| Q01 | What happens after a Sales Agent submits the mobile login form? | `POST login` with device fields; a `usertoken` row is inserted; the JWT is stored in Realm; the app opens the Dashboard (iOS may show "Save Password?") | `system-map.md` M1; EV-M01 |
| Q02 | Can a Business Agent use the mobile app? | No. The API refuses the login ("not authorized"); the product rule makes them web-only | `roles-permissions.md` §2; TC-F01-007 |
| Q03 | Can an Admin log in to the mobile API today? | Yes. The API admits Admin and issues a token, which is a defect against the BT-1 target (refuse Admin) | `roles-permissions.md` §4; EV-A02 |
| Q04 | Where is a company's "visited" state stored, and does marking a stop visited affect other routes? | On the Company (`companies.is_visited` / `visited_at`) plus a `user_visited_companies` log row. It is company-wide, so it shows wherever that company appears | `data-model.md` §2; `system-map.md` M8 |
| Q05 | Which table holds subscriptions, and what marks one active? | `user_packages` (model `Subscription`), `status = 'enable'`. There is no `subscriptions` table | `data-model.md` §2; `glossary.md`; CR-01 |
| Q06 | What API powers the mobile Routes Library screen? | `GET routelist` (returns `draft_routes` and `published_routes`) | `system-map.md` M6; `api-map.md`; TC-F08-001 |
| Q07 | Does the mobile app call `publishroute`? | No. No mobile or MCP caller was found; the `PublishRoute` screen calls `createroute` | `flows.md` F08; CR-02 |
| Q08 | What differs between a Sales Agent's and a Business Sales Agent's Settings on mobile? | The BSA has no credits, plan, Cancel/Upgrade or Buy credits block, and 6 status tags instead of 7 | `roles-permissions.md` §3; EV-M09 |
| Q09 | How many status tags does each role have, and is that the same on web and API? | SA 7 (incl. Gold); BSA 6 (no Gold); the same on mobile, web and API | `web-flows.md` §1; EV-W05, EV-A07 |
| Q10 | How does a Business Sales Agent receive leads from its manager? | The manager assigns leads in the portal's AI Find Leads; they arrive in the rep's account as a list "manager assigned leads – <date>" | `system-map.md` W8, M10 |
| Q11 | Is Mark Visited available on web? | No. Web is display-only (intentional, owner-confirmed); mobile and MCP can mark visited | `parity-map.md` F10; `web-flows.md` W-F08 |
| Q12 | What does the web `/notification` page do, and who can reach it? | It broadcasts a push to every device token; any signed-in web user can reach it. It is a critical security finding (UI-SEC-04), not fixed | `web-flows.md` W-F27; `UPCOMING_IMPROVEMENTS.md` |
| Q13 | Is `API_DEBUG` off in production? **(U)** | Unknown. Staging has it on (observed); the owner said off; production is not verified (CR-06, U-ENV-01) | `contradiction-register.md`; `UNKNOWN_REGISTER.md` |
| Q14 | What does Admin HQ show at runtime today? **(U)** | Not verified at runtime: `/hq/login` has a reCAPTCHA and `/login` refuses Admin. Known from code routes and the owner's ADM screenshots | `UNKNOWN_REGISTER.md` U-ADM-01; `web-flows.md` W-F25 |
| Q15 | How long does a JWT last, and what happens after it expires? | 7-day ttl; an expired token is refreshed server-side per request but the new token is never returned; after the 28-day refresh window the client gets 401 and logs out (intended) | `api-map.md` §1 |
| Q16 | Which design tokens must new mobile code use, and where do they live? | the approved additive tokens in `App/styles/tokens.js` (planned; legacy `theme.js` values are frozen); DIN only | `design-system.md` §0–2; S4.1 |
| Q17 | Which files must a change to `V2/RouteController.php` re-verify? | T1: F05, F08–F13, F20, F27, F29 + the API contract suite | `known-fragile.md` §3 |
| Q18 | What does a hand-added contact cost today, and what should it cost? | 1 credit on the API today (KG-BT3); target: free (BT-3) | `known-fragile.md`; `conventions-shared.md` S3.3 |
| Q19 | How is the manager portal built and how does it talk to the server? | React 18 + Vite in `resources/manager-portal`; `/manager/api/*` over session + CSRF; not V2 | `architecture.md` §4; `api-map.md` §3 |
| Q20 | What happens past the Pay button in the web subscription flow? **(U)** | Not verified: no payment setup; flows stop before paying (S6.4, U-PAY-01) | `UNKNOWN_REGISTER.md`; `web-flows.md` W-F03 |
| Q21 | Which V2 endpoints are public, and which one exposes personal data? | 25 public; `GET getUsers` returns name, email and phone of today's new users (UI-SEC-01) | `api-map.md` §2 |
| Q22 | What stores does Territool use? | MySQL for business data; MongoDB for geography reference; Realm on the phone; files for PDFs/CSVs | `data-model.md` §1 |
| Q23 | What is the mobile Dashboard made of, and does it have a footer? | header (name, credits, QR, settings), referral banner, six tiles, Activity (Upcoming/Recent), version; **no footer** | EV-M02; `architecture.md` §3 |
| Q24 | Is a known product bug a reason to lower the brain's score? | No, provided the brain documents it accurately (owner rule 2026-09-16) | `brain-scorecard.md` |
| Q25 | Where are test credentials stored, and may they appear in a report? | Only in `.local/test-accounts.md`; never in brain/workspace/reports (S0.4) | `conventions-shared.md` S0.4 |
| Q26 | Who may write to `brain/**` and run `brain-sync`? | Only Claude Code; Codex runs suites and writes only under `workspace/handoff/` | `agent-brief.md`; `tooling.md` §3 |
| Q27 | Why does `companylist` return HTTP 500 for an empty request? | the SQL is built from missing parameters and the MySQL syntax error is returned (with debug on staging); UI-API-02 | `UPCOMING_IMPROVEMENTS.md`; TC-F12-002 |
| Q28 | Is offline route mode supported? | No. Offline is dropped (S3.9); a half-removed cache read remains; network loss is an error state | `conventions-shared.md` S3.9 |
| Q29 | How many V2 routes exist, and how many does mobile use? | 145 routes; mobile references 96; customer MCP 20; 47 with no consumer found | `api-map.md` §4 |
| Q30 | What is the evidence that the dashboard date bug still exists? **(verify label)** | KG-UI1 "Invalid Date PT" was observed at runtime on 2026-09-16 (build 42.32) | EV-M02; `known-fragile.md` KG-UI1 |

## Runs

### Run 1 — 2026-09-16 (two independent answerers, brain-only)

Two separate agents answered the 30 questions with access to `CLAUDE.md`, `AGENTS.md`, `brain/**` and
`workspace/test-cases|qa-reports` only (no `repos/`, no answer key). Answerer B also listed every place two brain
files disagreed.

| Measure | Answerer A | Answerer B |
|---|---|---|
| Correct and cited (2) | 28 | 28 |
| Correct, incomplete (1) | 2 (Q27 root cause not in the brain; Q30 relied on the unwatched MV-01 claim) | 2 (same) |
| Wrong / invented (0) | 0 | 0 |
| **Score** | **58 / 60 (97%)** | **58 / 60 (97%)** |
| Unknown questions answered "unknown" (Q13, Q14, Q20) | 3 / 3 | 3 / 3 |
| Same answer as the other answerer | 30 / 30 | 30 / 30 |

**Brain defects the run exposed** (all fixed the same day, see `contradiction-register.md` CR-22…CR-29):

1. The first F01 QA report still said TC-F01-008 was BLOCKED → annotated as superseded (CR-12, CR-25).
2. KG-UI1 claimed a "re-confirmation" from a recording that was never watched → now cites the runtime screenshot EV-M02.
3. `api-map.md` said "no role gate" although login refuses a Business Agent → reworded (CR-26).
4. `api-map.md` said no public endpoint was called, and left the leak question open, although three were called → fixed; §6 now lists the observed shapes.
5. `parity-map.md` still had F20, F26 and F27 as UNVERIFIED despite runtime evidence → updated (CR-27).
6. Pro-plan credits differ between two owner screenshots (180 vs 120) → **open** product inconsistency (CR-22, UI-UX-05).
7. Contact-pricing rule written three ways → one rule stated, copy issue kept as O12 (CR-23).
8. "Visited" stored at two levels with two writers → stated precisely (CR-24).
9. `mobile-flows-captured.md` said videos were not provided → updated (CR-28).
10. The F12 case cited the wrong line → fixed (CR-29); the F20 case now asserts 7 vs 6 per role.

**Result:** consistent answers, correct handling of unknowns, and 10 brain inconsistencies found and fixed.
Q27 and Q30 remain partial by design: the brain records the symptom of UI-API-02, not a root cause (the code was
not debugged, per the code freeze).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (54)

**Documents (27):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/context/glossary|Approved words (glossary)]] · [[brain/context/architecture|Architecture: how Territool is built, end to end]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/context/data-model|Data model: what Territool stores and where]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[brain/memory/entries/qa/20260917-75ee1f-four-flagged-context-notes-re-validated-structur|Four flagged context notes re-validated structurally (410 claims, 0 unresolved)]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[log|Log]] · [[brain/context/parity-map|Mobile vs web differences]] · [[brain/context/flows|Product features list]] · [[workspace/qa-reports/2026-09-16-brain-improvement-loop|QA report: autonomous brain improvement loop (iteration 1)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[brain/context/conventions-shared|Rules for all code]] · [[CLAUDE|Start here – brain overview]] · [[brain/context/system-map|System map: role → platform → screen → action → API → data → result → next]] · [[workspace/tasks/2026-09-16-brain-improvement-loop|Task brief: autonomous brain improvement loop to 90+]] · [[brain/context/agent-brief|Territool brain — operating brief for any AI coding tool]] · [[brain/context/tooling|Tooling: which agent runs the brain, and what each one needs]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product features (10):** [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F29|Customer MCP connectors]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F01|Login & session]] · [[_id/F10|Mark visited & visit log]] · [[_id/F27|Notifications & push]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F26|Support tickets]]

**Coding rules (10):** [[_id/S3.3|Hand-added contacts free]] · [[_id/M1|New screens as function components]] · [[_id/M8|No hard-coded colours or sizes]] · [[_id/M6|No silent error catching]] · [[_id/S3.9|Offline mode dropped]] · [[_id/M10|Search before creating]] · [[_id/S0.4|Secrets stay private]] · [[_id/S6.4|Staging test data rules]] · [[_id/W8|Tests for new services]] · [[_id/S4.1|Use approved design tokens]]

**Owner decisions (2):** [[_id/BT-1|Block Admin on the mobile app]] · [[_id/BT-3|Hand-added contacts are free]]

**Problem founds (2):** [[_id/KG-UI1|“Invalid Date” on home screen]] · [[_id/KG-BT3|Hand-added contact costs a credit]]

**Code files (2):** [[_code/web/app/Api/V2/Controllers/RouteController.php|RouteController]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
