---
title: "Last verified"
---

# Last verified

Copied into `TerriTool AI Brain/` so agents do not need an external pack. **This folder is the only Brain.** Update this ledger in **this folder** when you re-verify.

A dated ledger so an agent (or reviewer) can tell whether a claim in this pack was checked against the running code/staging, or is just inherited prose. Update the row when you re-verify a section — don't bump the date without actually re-checking.

## Convention

- **Verified against code** — grep/read of the actual controller, route, or config file confirmed the claim.
- **Verified against evidence** — matched to a screenshot or video timestamp in `06-Evidence/`.
- **Not yet verified** — written from product knowledge / prior docs, not re-checked this pass.

When you change behavior in the app, update the matching Bible module **and** this ledger in the same commit/session — a stale ledger is worse than none.

## Ledger

| Section | Last verified | Method | Notes |
|---|---|---|---|
| knowledge/ + execution wiring | 2026-09-16 | Code + execution (`composer.lock`, `phpunit`, browser, `package.json`, `npm run test:e2e`) | PHP 7.4.33 CLI; Laravel lockfile 5.3.31; Manager PHPUnit 17/51 OK; MAMP PHP 7.4.33 renders login (PHP 8.2.20 does not); declared E2E script has no config/specs and Node 14 cannot launch Playwright (needs Node 20+). See `validation/qa-recheck-2026-09-16.md` and `qa-auth-run-2026-09-16.md`. |
| product/ (TerriTool_OverView, glossary, roles) | 2026-09-15 | Not re-verified this pass | Carried over from prior authoring session |
| product/overview.md, FLOWS.md | 2026-09-15 | Evidence (screenshots, 15 Sep walkthrough) | Former `02-Bible/00-Overview` |
| product/use-cases-overview.md | 2026-09-15 | Evidence | Actors / global chrome / cross-flow from the former `03-Use-Cases/use-cases.md` (split 2026-09-16) |
| product/FLOWS.md + ui-flows/source | 2026-09-15 | Not re-verified this pass | Mermaid source copied; PNGs not copied |
| features/01–15 MODULE.md (core field-rep modules) | 2026-09-15 | Evidence (screenshots, 15 Sep walkthrough) | See each module's `evidence.md` |
| features/16-Manager-Portal/MODULE.md | 2026-09-15 | Code (`routes/web.php` `manager` group) | Route table; 14 manager captures now in its `evidence.md`, screen names from filenames only |
| features/17-Admin-HQ/MODULE.md | 2026-09-15 | Code (`routes/web.php` `hq` group) | Route table; 21 HQ captures now in its `evidence.md` but **not catalogued to screens** — see module's "Evidence gap" |
| features/18-Clients/MODULE.md | 2026-09-15 | Not re-verified this pass | |
| features/19-Cron-Jobs-Webhooks/MODULE.md | 2026-09-15 | Not re-verified this pass | |
| features/20-MCP/MODULE.md (new 2026-09-16) | 2026-09-16 | Code (`app/UserMcp`, `app/FindMcp`, `app/AdminMcp` exist; route list in ROUTEMAP) | Written from the former `05-MCP/README.md` + `api-surfaces.md`; no new facts beyond those files and the ROUTEMAP |
| features/20-MCP/api-surfaces.md, example-utterances.md | 2026-09-15 | Code (`app/UserMcp`, `app/FindMcp`, `app/AdminMcp`; tool names/thresholds spot-checked) | `BUY_WITHOUT_CONFIRM_MAX=25` and MCP instructions string confirmed live in `app/UserMcp/Services/*` |
| features/20-MCP/conversations.md | 2026-09-15 | Derived from api-surfaces + limits | No new facts — sequencing/tone only |
| features/21-Business-Team/MODULE.md | 2026-09-15 | Code (`routes/web.php`, `BusinesssalespersonController`) | Route table added |
| features/*/use-cases.md (all) | 2026-09-15 | Evidence (§1–15), Code only (§16 Admin, §15 MCP) | Split verbatim from `03-Use-Cases/use-cases.md` on 2026-09-16; UC IDs and text unchanged |
| features/*/flows.md (all) | 2026-09-15 | Not re-verified this pass | Generated 2026-09-16 from the moved `.mmd` sources; PNGs not re-rendered |
| features/*/evidence.md (01–08, 12, 13, 15) | 2026-09-15 | Evidence (own catalog) | Rows split verbatim from `06-Evidence/screenshot-catalog.md` on 2026-09-16; files moved beside the feature |
| features/{05,07,09,20}/limits.md | 2026-09-15 | Code (`AILeadFinderController`, `ContactsTools.php`, `territool_app.php`) | Split verbatim from `07-Operational-Reference/limits-and-performance.md` on 2026-09-16 |
| features/{03,05,07,09}/known-issues.md | 2026-09-15 | Code (live error strings grepped from controllers) | Split verbatim from `07-Operational-Reference/known-issues-and-error-messages.md` on 2026-09-16 |
| engineering/CODEMAP.md | 2026-09-15 | Code (spot-checked `CompanylController` class name, controller list) | Former `02-Bible/22-Development-Reference` |
| engineering/ROUTEMAP.md | 2026-09-16 | Code (`php artisan route:list` on local checkout — 725 routes, 77 controllers; each `Controller@method` body scanned for `view()`/JSON/redirect/download) | Generated file. View detection is a text scan of the method body only — delegated/trait rendering shows `—`. Regenerate after route changes rather than hand-editing |
| engineering/operational-notes.md | 2026-09-15 | Code + live DB query of `support_ticket` (title + status only, no PII pulled) | Remainder of `07-Operational-Reference` after the per-feature split; the support-ticket finding (155 rows, ~150 QA noise) is unchanged |
| engineering (conventions, stack map, data model, runbook, tokens, tooling) | 2026-09-15 | Code + **live database** (`vite.config.js`, every `resources/views/front/manager/*.blade.php`, MySQL `SHOW TABLES`/`SHOW COLUMNS` against `territool`, 83 real tables; `.playwright-mcp/` console logs; `public/css/custom.css` frequency count) | `data-model-reference.md` reflects the **live schema**. `design-tokens-stopgap.md` and `tooling-proposal.md` are drafts, not installed |
| evidence/catalog-unassigned.md | 2026-09-16 | Evidence (directory listing) | 26 afternoon web captures + 58 mobile captures + video, none yet matched to screens |
| Wiki schema (`index.md`, `log.md`, `operating/llm-wiki.md`) | 2026-09-16 | Schema (ADR-009) | Catalog generated from markdown; not a product re-verify |

## Known stale-risk areas

- Any module not re-verified this pass could drift from code as features ship — the "Verified" column above is the guard rail, not a guarantee.
- `database/webterritool.sql` is a 2021 snapshot with 37 tables; the live DB has 83. Treat any future reference to the dump with the same suspicion — don't just trust a "there's a schema dump" claim.
- `reports.blade.php` (Manager Portal) has no confirmed root-div mount — flagged as an open question in `engineering/stack-migration-map.md`, not yet resolved.
- **The `territool` MySQL database contains an unrelated application's tables** (`coffee_orders`: 3,436 rows, `bookings`: 6,002 rows, and related tables) with real production-scale data. This is flagged in `engineering/data-model-reference.md` — raise it with whoever owns the database. This pack treats those tables as out of scope; no TerriTool tooling should query or migrate them.
- MySQL's local availability is intermittent in this environment (it was down earlier this session, then up later) — don't assume "DB unreachable" means a real outage vs. MAMP just not running; also don't assume "DB reachable now" stays true for the next session.
- The 21 Admin HQ and 14 Manager captures are in their feature `evidence/` folders but only the Manager set has screen names (from filenames); neither is matched to use-case IDs yet.
- The **Related** blocks appended to every `MODULE.md` on 2026-09-16 were derived by reading each module's prose and use cases — they are navigation, not new verified behavior. If a link looks wrong, fix the link, not the module.

## Changes to this pack

- **2026-09-16 (LLM Wiki)** — ADR-009. This folder is the Karpathy LLM Wiki (ingest / query / lint). Catalog `index.md`, timeline `log.md`, schema `operating/llm-wiki.md`. Rebuild: `python3 tools/wiki_index.py`. Memory: `llm-wiki-is-this-brain.md`.

- **2026-09-16 (authenticated QA smoke)** — [validation/qa-authenticated-smoke-2026-09-16.md](validation/qa-authenticated-smoke-2026-09-16.md). Valid Sales Agent login now verified on local MAMP PHP 7.4.33. Dashboard, Address Book render, free Find Leads search (142 results, balance unchanged), Lists, and Settings rendered. Found a published route list/detail stop-count mismatch and `zipAutocomplete` console error. Credit-spending, writes, privileged/integration and manager flows were not run.

- **2026-09-16 (live auth QA)** — [validation/qa-auth-run-2026-09-16.md](validation/qa-auth-run-2026-09-16.md). MAMP PHP 7.4.33 reached the real login form; the supplied local QA account was rejected with the expected form error. Guest rendering and invalid-credential handling pass; valid role landing and all authenticated flows still require a known local fixture.

- **2026-09-16 (QA execution recheck)** — [validation/qa-recheck-2026-09-16.md](validation/qa-recheck-2026-09-16.md). Manager PHPUnit passes (17 tests, 51 assertions); `npm run test:e2e` is unavailable because it has no config/specs and Node 14 is below Playwright's Node 20+ requirement. Source re-confirmed the guest `AuthUser` defect. Browser recheck shows MAMP PHP 8.2.20 cannot render legacy Laravel 5.3 login. Local/staging/fixture blockers prevented credential submission and authenticated flow runs; existing product diagrams already cover the flow inventory.

- **2026-09-16 (local QA URL)** — Canonical local QA is `http://127.0.0.1:8000/login`. Do not use `http://localhost:8888/webterritool/public`. Memory: `local-qa-url-artisan-serve.md`.

- **2026-09-16 (full flow QA)** — [validation/qa-full-2026-09-16.md](validation/qa-full-2026-09-16.md). Customer MCP: credits 100/18, 19 companies, list L123, published route R123, no active route. Playwright locked; local `/login` 500. Added UCs+flows for modules 11, 18, 19, 21 and flows for 02, 04, 06, 14, 17. Assigned 7 afternoon screenshots. Modules 09 and 10 now have `evidence.md`.

- **2026-09-16 (single Brain)** — ADR-008. This folder is the only knowledge system for feature, UI design, bugfix, and QA. Added `ui-flows/SCREEN-SPEC.md`, `skills/design-ui.md`, `loops/qa-loop.md`, memory `single-brain.md`. Cursor/Claude skills `territool-design-ui` and `territool-qa-loop` are pointers here.

- **2026-09-16 (memory + Claude skills)** — Root `CLAUDE.md` now includes verification commands. Added `memory/MEMORY.md` plus ten one-fact files. Brain `skills/*.md` have YAML frontmatter. Claude Code copies live in `.claude/skills/territool-*`. Execution protocol has a subagent split. ADR-007.

- **2026-09-16 (media)** — Screenshots, walkthrough videos, and flow PNGs now live only in this folder (75 assigned, 84 unassigned, 5 videos, 21 flow PNGs). Copied that day from a former pack that was then removed. Catalogs in `features/*/evidence.md` resolve to local files.

- **2026-09-16 (folder arrange)** — Renamed `terri-engineering-brain/` → `TerriTool AI Brain/`. Nested `architecture/` and `code/` under `knowledge/`. Cursor rules/skills and root `AGENTS.md`/`CLAUDE.md` point at `TerriTool AI Brain/`.

- **2026-09-16 (AI Brain execution layer)** — Wired the Brain to Cursor: always-apply `.cursor/rules/territool-ai-brain.mdc`, project skills `.cursor/skills/territool-*`, repo-root `AGENTS.md` + `CLAUDE.md`. Added `knowledge/` indexes, `product/business-rules.md`, `product/constraints.md`, UI + refactoring loops, execution protocol, learning loop. Ran PHPUnit: Manager 17 OK; full suite fails `ExampleTest` when MySQL is down. Playwright MCP still profile-locked. Staging login HTTP 200; local/MAMP login unreachable.

- **2026-09-16 (later)** — Added `tools/brain-map/` (graph extractor + page builder → `dist/territool-brain-map.html`, the source of the claude.ai brain-map artifact) and `tools/routemap.py` (regenerates `engineering/ROUTEMAP.md` from `php artisan route:list`), with `tools/README.md` describing the rebuild → republish loop. Both are generators; their outputs are build products, not hand-edited files.

- **2026-09-16 — Reorganized by feature.** The layered layout (`01-Product` … `09-Engineering-Practices`) became: `00-Product/` (overview, glossary, roles, journeys, use-case and flow index), `features/NN-Name/` (one folder per module holding `MODULE.md` plus that feature's `use-cases.md`, `flows.md` + `flows/`, `evidence.md` + `evidence/`, `limits.md`, `known-issues.md`), `engineering/` (code map, route map, conventions, stack map, data model, runbook, operational notes), `evidence/` (unassigned captures + video) and `tools/`. Mapping: use cases were split by their `UC-*` prefix onto the owning feature (UC-CO-02 and UC-CT-06 → 06-Recently-Added; UC-CT-01/02 → 09-Contact-Enrichment-Credits; UC-SET-02…05 → 13-CRM-Integrations; UC-SET-01/06 → 14-Settings-Profile; §15 → 20-MCP; §16 → 17-Admin-HQ); the 21 mermaid flows moved to the feature they draw (product-wide ones to `00-Product/flows/`); the 40 catalogued Salespeople screenshots moved to the feature their catalog row names, all Manager captures to 16, all Admin captures to 17, everything else to `evidence/`; `07-Operational-Reference` sections moved to 05/07/09/20 (`limits.md`) and 03/05/07/09 (`known-issues.md`) with the cross-feature remainder in `engineering/operational-notes.md`. Every `MODULE.md` gained a **Related** block (sibling modules, own files, MCP, code, terms). **Module 20 is now MCP** (former `05-MCP` + `08-Example-Conversations`), filling the 19 → 21 gap; module 22 (Development Reference) moved to `engineering/`. `00-Overview/FLOWS.md` is linked from OVERVIEW and the product README (it was an orphan). A full pre-reorganization backup tarball may still exist at the repo root.


- **2026-09-15** — Removed every `MODULE.txt` / `OVERVIEW.txt` / `FLOWS.txt` / `README.txt` duplicate across the Bible (24 files). They were byte-for-byte copies of their `.md` counterpart in 16 of 21 modules and had already silently drifted in the other 5 (stripped backticks/bold, unlinked paths) — pure duplication with no plain-text value and nothing outside this repo consumed them. `MODULE.md` is now the sole source of truth; see `02-Bible/README.md`.
- **2026-09-15** — Added `09-Engineering-Practices/` (coding conventions, frontend stack migration map, data-model reference, bug-repro runbook) to cover how the code is built, not just what the product does. Fixed a stale "Sentry, Bugsnag" claim in `01-Product/TerriTool_OverView.md` — Bugsnag is not a dependency in `composer.json`; only Sentry is.
- **2026-09-15 (same session, DB came online)** — Rewrote `data-model-reference.md` against the live database (83 tables, real columns, real row counts), discovered and flagged the shared unrelated-app tables (coffee/bookings), re-verified `known-issues-and-error-messages.md`'s support-ticket section with real (if sparse/low-quality) data, and added `design-tokens-stopgap.md` (extracted from real CSS frequency, not designed) and `tooling-proposal.md` (draft lint/CI configs, explicitly not installed).
- **2026-09-16** — Added `02-Bible/22-Development-Reference/ROUTEMAP.md`: every registered route (725) grouped by area and owning controller, with the Blade view / JSON / redirect each method returns. Closes the gap where `CODEMAP.md` named 18 of 42 app controllers at feature level only. Linked from `CODEMAP.md`, `02-Bible/README.md` and the root `README.md`.
- **2026-09-16** — Removed a stray machine-local canvases directory that had been accidentally created inside the original pack. Removed two dead canvas links. Documented the unexplained module numbering gap (`19` → `21`, no `20-*`) instead of leaving it silent.
