---
title: "Wiki log"
---

# Wiki log

Append-only. Prefix every entry with `## [YYYY-MM-DD] kind | title` so `grep '^## \[' log.md` is a timeline.

Kinds: `ingest` · `query` · `lint` · `schema`

## [2026-09-21] ingest | Review-credits eligible landing UI

Implemented authenticated `/reviews/credits` as `HomeController@reviewCredits` → `front.review_credits`. The Blade page matches the review-credit mock's eligible state and opens the G2/Product Hunt links, but deliberately has no submission tracking, verification, email/mobile campaign, or credit write. Updated the Dashboard module, UC, flow, and screen spec.

## [2026-09-21] ingest | Review-credits landing design

Proposed day-two G2 (30) + Product Hunt (20) credit reward. Web uses email → dedicated Blade page so the dashboard flow is not interrupted. Mobile banner copy changes from 20 to 50. Spec and mocks: [features/02-Dashboard/flows/review-credits-landing-spec.md](features/02-Dashboard/flows/review-credits-landing-spec.md). Not implemented.

## [2026-09-18] ingest | ChatGPT setup landing order

`/chatgpt-plugin` now leads with install MCP (role tutorials from the start), then create a Project, then use MCP in a Project chat. Role cards no longer jump to `#step-7`. Spec and screenshots: [features/20-MCP/flows/chatgpt-setup-index-spec.md](features/20-MCP/flows/chatgpt-setup-index-spec.md).

## [2026-09-18] ingest | Desktop-only mobile-app promotion

The first-route mobile-app popup now opens only at desktop viewport widths (≥768px). Mobile route view deliberately has no popup or modal backdrop.

## [2026-09-18] ingest | Popup copies canonical mobile-app URL

Replaced the mail-compose action with “Copy the download link.” It copies `onboarding_segment_email.mobile_app_url`, the same canonical URL used in the onboarding email template, and confirms success inline without a server write.

## [2026-09-18] ingest | Popup visual fidelity pass

Reworked the first-route mobile-app popup to match the supplied desktop capture’s 738px width, header/body proportions, DIN typography scale, QR column, storefront-button dimensions, and phone/pin/route icon.

## [2026-09-18] ingest | Mobile-app popup reuses first-route session

Removed the dedicated popup dismissal endpoint and preference flag. The popup now uses `Helper::shouldShowFirstRouteOnboarding()` so the existing first-route onboarding conversion state is the only eligibility state.

## [2026-09-18] ingest | First-route mobile-app download popup

Implemented the requested route-detail popup from `/Users/picwa/Downloads/Codex Image 18 Sept 2026, 10_27_10.png`. The Routes module and dedicated screen spec document its Basic-Route-only eligibility, persisted dismissal flag, existing app-store assets, and zero credit impact.

## [2026-09-16] schema | LLM Wiki instantiated in this Brain

Mapped [Karpathy LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) onto `TerriTool AI Brain/` (ADR-009). Layers: raw = code + evidence; wiki = this markdown; schema = AGENTS.md + `operating/llm-wiki.md`. Added `index.md`, `log.md`, `skills/wiki.md`, `tools/wiki_index.py`. No second `wiki/` folder.

## [2026-09-16] ingest | Canonical local QA URL

Human: local project is `http://127.0.0.1:8000/login`, not MAMP `/webterritool/public`. Memory `local-qa-url-artisan-serve.md`; verify-ui / qa-loop / UI skills updated.

## [2026-09-16] ingest | Full-flow QA + missing UCs

`validation/qa-full-2026-09-16.md`. MCP reads (credits 100/18, L123, R123). UCs/flows for Maps, Clients, Cron, Business Team. Seven afternoon screenshots assigned. Playwright locked; artisan login was 500 that pass.

## [2026-09-16] ingest | Single Brain contract

ADR-008. Feature, UI spec, bug, QA all write here. SCREEN-SPEC + qa-loop.

## [2026-09-16] schema | Wiki wiring completed

Skills `territool-wiki`, loop/Learn pointers, `wiki_index.py --lint`, connection map in `operating/llm-wiki.md`. Catalog regenerated. No second `wiki/` folder.

## [2026-09-16] lint | Feature completeness after wiki wiring

All 21 feature folders have `MODULE.md`, `use-cases.md`, and `flows.md`. No `evidence.md` yet on 11-Maps, 14-Settings-Profile, 18-Clients, 19-Cron-Jobs-Webhooks, 20-MCP, 21-Business-Team. Company-detail associations spec no longer claims a mock screenshot as evidence.

## [2026-09-17] lint | Removed 5 duplicate legacy trees

Deleted `use-cases/{01-20}-*.md`, `ui-flows/{01-20}-*.md`, `mcp/` (all 6 files), `learnings/known-issues/`, `learnings/limits/` — `features/<module>/` was already the canonical, more complete copy of each (confirmed by diff; only `mcp/` self-declared non-canonical in its own MODULE.md, and one `learnings/known-issues/07-Routes.md` was strictly stale vs. its feature copy). `use-cases/` and `ui-flows/` now hold only README/TEMPLATE/UC-trace/SCREEN-SPEC. Also deleted `product/personas.md` (byte-identical dup of `roles.md`). Fixed ~16 pre-existing broken links across `product/`, `knowledge/code/`, `evidence/README.md`, `features/20-MCP/api-surfaces.md`, and `features/03-Company-AddressBook/flows/company-detail-associations-spec.md` — mostly a `features/README.md`-as-link-text bug that resolved to the wrong depth depending on the linking file's location. `knowledge/`'s flat-file-vs-`architecture/`+`code/`-subfolder split was investigated and left alone: `knowledge/README.md` documents it as a deliberate short-index/deep-doc pair, not a duplicate. Verified with `python3 tools/wiki_index.py --lint` (6 pre-existing "no evidence.md" notes only) and a full markdown-link sweep (0 broken .md→.md links remaining).

## [2026-09-17] schema | Obsidian graph labels fixed with `title:` frontmatter

Obsidian's graph view always labels nodes by bare filename, never by H1 or frontmatter — with `MODULE.md`/`use-cases.md`/`flows.md`/`evidence.md`/`README.md` repeated in every `features/*/` folder, the graph showed dozens of indistinguishable "MODULE"/"flows"/"README" nodes even though each file already had a unique, well-written H1. Added `title: "..."` frontmatter to all 200 `.md` files (mirroring the existing H1; for the 35 `memory/*.md` files, which have no H1, humanized from `name:`). Also caught and fixed while in there: 9 `skills/*.md` files had a pre-existing `territorool-*` (extra "or") typo in their `name:` field — their new titles use the correct body H1 instead of that slug. Rendering the new `title:` field in Obsidian's actual graph still needs the "Front Matter Title" community plugin (not installed — requires the vault owner to enable Community Plugins once, a deliberate Obsidian security gate for third-party code execution).

## [2026-09-17] ingest | Unassigned evidence triage — 77 captures assigned

Root `evidence/screenshots/Web/Salespeople/` (19 files) and `evidence/screenshots/Mobile/` (58 files) had zero filename overlap with the 82 images already in `features/*/evidence/` — they were the genuinely unassigned remainder, not a duplicate of assigned evidence. Viewed all 77 and identified every one by its on-screen UI (no forced guesses); moved each into the matching `features/<module>/evidence/` and added a row to that module's `evidence.md` (new "Additional captures (triaged 2026-09-17)" table alongside the original 15-Sep-catalog table). Filenames use a narrow no-break space (`U+202F`) before `AM`/`PM`, which silently breaks plain-string tools (`mv`, Edit's exact-match) — used Python `glob`/explicit ` ` construction instead.

Distribution: 09-Contact-Enrichment-Credits +22 (bulk Find Contacts flow, web + mobile + simulator), 07-Routes +15, 05-Find-Leads +7, 04-Contacts +7 (incl. Scan Business Card, not previously catalogued anywhere), 10-Bulk-Upload +6, 03-Company-AddressBook +4, 08-Lists +4, 02-Dashboard +3, 12-Subscription-Payments +3, 13-CRM-Integrations +3, 01-Authentication-Onboarding +1. Created `features/14-Settings-Profile/evidence.md` from scratch (2 screenshots) — closes one of the pre-existing "no evidence.md" lint gaps. Corrected one misclassification during the pass: the two "Add custom connector" screenshots initially filed under 14-Settings-Profile were moved to 13-CRM-Integrations after finding that module's evidence.md already establishes CRM/MCP-connector screens as its convention, not Settings'.

Updated `evidence/catalog-unassigned.md` and `evidence/README.md` counts; regenerated `index.md`. `wiki_index.py --lint` down to 5 notes (was 6; only the modules with no evidence at all — 11-Maps, 18-Clients, 19-Cron-Jobs-Webhooks, 20-MCP, 21-Business-Team — remain, unchanged from before). Full markdown-link sweep: 0 broken links. Root `evidence/screenshots/` now holds no real files, only stray `.DS_Store`. Walkthrough videos in `evidence/video/` were left in place by design (never feature-assigned, per `evidence/README.md`).

## [2026-09-17] ingest | Mobile screen-flow catalog — 230 screenshots, 10 flows

Phase 2 of bringing mobile into this Brain (Phase 1: `knowledge/architecture/mobile.md`, same day). Source: `/Users/picwa/Downloads/Archive (3)/` — 10 flow-wise folders of iPhone-simulator screenshots, ordered by capture timestamp within each folder (24-hour filenames, no AM/PM gotcha this time). Viewed every screenshot individually (no forced mapping) and copied each into `features/<module>/evidence/mobile/<FlowName>/`, with a numbered walkthrough added to that feature's `flows.md` (embedded images, grouped near-duplicate frames) and an index table in `evidence.md`.

Mapping used (all verified by content, not assumed from folder name): `LoginRegistrationFlow` (21) → 01-Authentication-Onboarding; `Dashboard` (7) + `ActivityCalendar` (4) → 02-Dashboard (ActivityCalendar's last frame crosses into company detail — cross-referenced, not duplicated); `AddCompany` (9) + `AddressBookFlow` (18) → 03-Company-AddressBook (kept as two separate flow sections — different journeys); `ScanCardFlow` (11) → 04-Contacts (no UC id yet, flagged as a `UC-CT-06` candidate); `AIFindLeadsFlow` (49) → 05-Find-Leads; `List` (42) → 08-Lists; `RouteFlow` (81 total) → 07-Routes; `Setting` (7) → 14-Settings-Profile. All matched cleanly onto existing `UC-*` ids (UC-ONB, UC-LEAD, UC-LST, UC-RTE, etc.) with mobile-only steps (ROI calculator, in-app paywall step, referral invite, QR route-scan) explicitly flagged as having no web equivalent rather than force-fit.

`RouteFlow` and `List` shared 19 byte-identical screenshots (the bulk Find Contacts flow, apparently exported into both source folders) — de-duplicated: kept the copy under 08-Lists, deleted the physical duplicates from 07-Routes, and cross-referenced instead of re-describing. Real behavior caught along the way worth flagging: onboarding validation copy has a doubled-word bug ("Please enter Enter Valid Password/Email"); Dashboard's Activity header shows "Invalid Date PT"; Route "Re-Route" requires a filter first or it's rejected; mobile subscriptions aren't always RevenueCat-managed — some are web-billed and the app detects this and redirects to web instead.

Created `features/14-Settings-Profile` mobile section on top of the evidence.md this Brain already had for that module. Verified: `wiki_index.py --lint` unchanged (5 pre-existing notes, none mobile-related), full markdown-link sweep 0 broken links (fixed one unrelated pre-existing broken link found along the way — `features/03-Company-AddressBook/flows/company-detail-associations-spec.md`'s embedded screenshot was missing the U+202F before "AM"). `knowledge/architecture/mobile.md` updated with the final per-flow → feature table. 230 unique images total, all confirmed linked from their feature's `flows.md`/`evidence.md` (0 unlinked).
