---
status: REVALIDATED-STRUCTURE-2026-09-17
area: context
tags: [brain/context]
ref: "Design states: loading, empty, error and their variants per surface"
---

# Design states: loading, empty, error and their variants per surface

> [!check] Re-validated 2026-09-17 (structure) — the earlier NEEDS-REVALIDATION flag is closed
> `node tools/note-revalidate.js` resolved all 29 structural claims in this note (endpoints, screens, tables, files
> and line numbers, ids) against the current code and brain data (mobile `f20c5aa`, web `21d6348c`): 0 unresolved.
> Checked against: the cited code files in `repos/mobile` / `repos/web`, `brain/context/evidence-ledger.md` (EV ids), `brain/context/known-fragile.md` (KG ids), `brain/audits/data/owner-mobile-captures.json` (capture ids).
> **Not re-observed:** runtime (RT) and owner-capture claims keep their original 2026-09-16 date and tier.

Rule S4.3 requires every data screen to have loading, empty and error states (plus refreshing on mobile).
This note records **what each surface actually shows today** and **what new code must show**, so a design or QA
pass can check a screen against its surface. It complements `design-system.md` §5 (the component rules).

**Status:** **RT** = seen at runtime 2026-09-16 · **Code** = read in the repo · **Owner** = owner capture.

## 1. Mobile (React Native)

| State | Today (verified) | New code (S4.3, design-system §5–6) | Evidence |
|---|---|---|---|
| Loading (screen) | full-screen brand loader with a message ("Loading your saved AI leads…", "Generating your sales route") | inline spinner + `type.body` label in the content area; blocking overlay only during a user-started mutation | RT (EV-M06); `mobile-flows-captured.md` loaders |
| Loading (lazy screen) | the debug build shows a "Downloading…" bar while `React.lazy` loads a screen | not applicable to production; automation must wait it out (EV-M12) | RT |
| Refreshing | pull-to-refresh on the Activity and list screens | keep pull-to-refresh; don't block the list while refreshing | Code (`RecentActivityScreen.js`) |
| Empty | "No upcoming activities yet." (Dashboard, BSA); "AI Find Leads – no leads found" | icon (optional) + `type.subheading` title + `type.caption` `text.secondary` body + optional CTA | RT (EV-M08); owner AI-03 |
| Error (field) | red helper text under the field ("Please provide valid login details.", copy issues KG-COPY1) | `color.danger-text`; humanised copy; the field keeps its value | Owner LR-02/03/19/21 |
| Error (network) | a toast at the top (`react-native-toast-message`); **six sites also log the user out on a network error** (KG-C2) | toast + keep the screen; never log out on a network error (S3.9: network loss is an error state) | Code `API.js:153`; KG-C2 |
| Error (crash) | the full-screen `AppCrashFallback` (unhandled rejections route here) | reuse it; report to Sentry (S5.6) | Code `utils/crashRecovery.js` |
| Session expired | the Session Expired modal → Login | reuse; never a silent logout | Code `App.js:171-199` |
| Known bad states (do not copy) | "Invalid Date PT" (KG-UI1), raw enum "Industry: hair_care" (KG-UI2), internal ids in the Add-to-route sheet (KG-UI7) | dates via D-DS7; humanised enums; no internal ids in UI | RT (EV-M02, EV-M03) |

## 2. Web user app (Blade + jQuery)

| State | Today (verified) | New code | Evidence |
|---|---|---|---|
| Loading | jqWidgets grids and `pace` page loader; some lists load by AJAX after the page | inline spinner + label; don't leave an empty table with no hint | RT (EV-W01) |
| Empty | tables render their header with no rows and no message | add an empty-state row: title + one line + a CTA | RT (list pages) |
| Error (form) | Bootstrap `.help-block` / validation text under fields | `--tt-color-danger`; keep the entered values | RT (`/login` errors) |
| Error (page) | Laravel/Backpack error page; on staging the Dingo/API paths expose `debug` (UI-SEC-02) | a friendly page; no stack traces (UI-SEC-02) | RT (EV-A03) |
| Destructive | a red **Delete** in **every** table row (routes, lists) | move to an overflow menu or a confirm step (S4.3 §8, KG "Red Delete in every row") | RT; design-system §6 |
| Known bad states | DD/MM vs MM/DD dates across pages; 7 actions per row | one date format (D-DS7); fewer row actions | RT; design-system §6 |

## 3. Manager portal (React + Vite) — the model surface

| State | Today (verified) | New code | Evidence |
|---|---|---|---|
| Loading | per-card skeletons / spinners; the API calls (`/manager/api/*`) fill each card | keep per-card loaders; this is the pattern to copy | RT (EV-W08); `web-surfaces.md` §1 |
| Empty | `/manager/reports` is a **blank placeholder** (a dead end) | hide unbuilt sections; give real empties a title + line | RT (EV-W08); UI-UX-02 |
| Error | cards show an error state; the JSON API returns `{error}` with 401/404 | keep `{error}` + a card message; never leak internals | RT (EV-A13) |
| Responsive | **no navigation at 390 px** (KG-UI3, KG-UI5) | a menu button / drawer below 768 px (S4.3 §5) | Owner web_390 captures |

## 4. Admin HQ (Backpack) — out of scope for restyle

Backpack-generated DataTables (loading spinner, "No data available" empty row, inline validation). Treat as
out of scope unless a task targets it (S0.2). Runtime not observed (captcha, U-ADM-01); states known from the
owner's `ADM-*` captures and the framework defaults.

## 5. Coverage of this note

- Verified at runtime for mobile (SA + BSA) and the three web surfaces this cycle.
- **Not** a per-screen matrix: it is per surface. A full per-screen state matrix is future work (design CREATE mode, formerly Mode C).
- Design claims here are labelled; none is inferred from "several screens look alike" (owner rule).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (29)

**Documents (9):** [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[brain/memory/entries/qa/20260917-75ee1f-four-flagged-context-notes-re-validated-structur|Four flagged context notes re-validated structurally (410 claims, 0 unresolved)]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[workspace/qa-reports/2026-09-16-brain-improvement-loop|QA report: autonomous brain improvement loop (iteration 1)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/web-surfaces|The three web surfaces, and how each one is built]]

**Coding rules (4):** [[_id/S0.2|Change new code only]] · [[_id/S4.3|Loading, empty & error states]] · [[_id/S3.9|Offline mode dropped]] · [[_id/S5.6|Report handled errors]]

**Owner decision (1):** [[_id/D-DS7|Standard date formats]]

**Problem founds (7):** [[_id/KG-UI1|“Invalid Date” on home screen]] · [[_id/KG-UI7|Internal IDs shown to users]] · [[_id/KG-UI3|Manager portal has no menu on phones]] · [[_id/KG-UI5|Manager Salespeople page issues]] · [[_id/KG-C2|Network error logs the user out]] · [[_id/KG-UI2|Raw industry codes shown]] · [[_id/KG-COPY1|Spelling & grammar mistakes in messages]]

**Screenshots (5):** [[_capture/AI-03|AI Find Leads – no leads found]] · [[_capture/LR-02|Login – password missing message]] · [[_capture/LR-03|Login – wrong email or password]] · [[_capture/LR-21|Sign-up – invalid email message]] · [[_capture/LR-19|Sign-up – invalid password message]]

**Code files (3):** [[_code/mobile/App/utils/API.js|API.js]] · [[_code/mobile/App/utils/crashRecovery.js|crashRecovery.js]] · [[_code/mobile/App/components/dashboard/RecentActivityScreen.js|RecentActivityScreen.js]]

%% brain-links:end %%
