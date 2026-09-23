---
area: workspace
tags: [brain/workspace]
ref: "Placement walk-through: \"add a filter to the Lists library\""
---

# Placement walk-through: "add a filter to the Lists library"

- **Skill:** `territool-design`, routing + PLACE (worked example requested by the owner, 2026-09-17).
- **Status:** routing and candidate ranking only. **Stopped before A3 tokens** because the filter criteria are a product
  decision (see Open questions). No code, no repo changes.
- **Feature:** F11 Lists (HIGH). **Screens:** mobile `Lists` (`LS-20`), web `/lists` (`SLS-19`).

## Owner decisions (USER SAID 2026-09-17)

| Question | Decision |
|---|---|
| Criteria | **Exactly what web has: name, company count, date range.** This is a parity gap, not a feature. Anything more would open a new divergence (UI-UX-07 covers the extra criteria, on both platforms together) |
| Does the filter button count as a group? | **Yes.** Different panel, different intent (filter, not search). **7 → 8 stands. The next addition to the Lists screen goes to EXTEND or a restructure, not PLACE.** |
| Trailing or leading? | **Trailing** (Address Book). Having both conventions is a design-system defect: D-DS9, UI-UX-06 (List details to change) |
| The hard-coded button | Rebuild on tokens for this screen. The shared component is separate work (UI-DX-02); Address Book stays hard-coded until then |
| Implementation | The spec may proceed. **Implementation waits** until the production-config question is closed (incident `VAULT-20260917-ef8968`) |

Decision entry: `brain/memory/entries/decision/20260917-54748f-lists-library-filter-placement.md`.

## Routing

**1. Does a screen already exist where a user would look for this?** Yes, on both platforms.
- Mobile: the `Lists` stack screen (`repos/mobile/App/App.js:350`, component `App/components/list/index.js`), reached
  from the Lists tab. Captured as `LS-20` (Lists library).
- Web: `/lists` (`repos/web/resources/views/front/list/list.blade.php`), captured as `SLS-19`.
A user who wants "only some of my lists" is already on this screen; nowhere else would they look.

**2. Same intent as the screen's primary job?** Yes. The job is *find a list and open it*; the screen already has a
narrowing control (Search Lists). A filter narrows the same collection → **PLACE**.

**3. Complexity gate (mobile `LS-20`).**

| # | Interactive group today | Source |
|---|---|---|
| 1 | Back | header, `LS-20` |
| 2 | Create list (+) — the screen's primary action | header, `LS-20` |
| 3 | Search Lists + its clear button | `list/index.js:946-967` |
| 4 | Open a list (card tap / chevron) | `LS-20` |
| 5 | Per-list "…" menu (Generate Route, rename, share, delete — the code calls it `showFilter`) | `list/index.js:371`, `LS-21` |
| 6 | Scroll-hint arrow | `LS-20` (`common/ScrollHintArrow.js`) |
| 7 | Tab bar | `LS-20` |

- **Count: 7 → 8** if the filter button is its own group; **7 → 7** if it joins the search group (same purpose,
  same row). I used **8**, the stricter count: the screen is **at** the threshold, not clearly over it.
- Second primary action? **No** — create (+) stays the only primary action.
- Primary action pushed below the fold? **No** — (+) is in the header.
- New scroll region? **No** on the screen. (The filter panel may scroll internally, like `LS-42`, but it is a modal.)
- New mental model? **No** — "search or filter your lists" is one idea.

**Decision: PLACE**, with the count recorded so that **the next addition to this screen routes to EXTEND or to a
restructure proposal**. Reference: the sibling top-level screen Address Book (`AB-01`) already carries 9 groups
(back, +, Companies/Contacts segment, search, filter, delete, rows, scroll hint, tab bar).

**Web `/lists`: the filter already exists.** The jqxGrid runs with `showfilterrow: true` and filters Name, Quantity
and a Date Created range (`list.blade.php:344-368`). On web this request is **not new UI**. It is either nothing, or a
new criterion (see Open questions). **The real finding is a parity gap:** web filters lists by name, size and date;
mobile only searches by name, on the device (`list/index.js:236-242`).

## A1. The screen as it is (mobile)

- **Layout:** blue gradient header (back · "Lists" · +), build strip, white search band, grey list area with white
  cards (index badge, name, "date · N Companies", "…", chevron), scroll-hint arrow, tab bar (`LS-20`).
- **States in code:** loading ("Loading lists…", `list/index.js:890-898`); empty card, with a `hasFilters` branch
  already built into the empty state (`list/index.js:885-889`); pull to refresh (`onRefresh`, `:709`).
- **Data:** `GET getlist` → `data{lists[]}` (`brain/context/api-map.md` row 53). Search filters the loaded array on the
  device, with no new request.
- **Sibling patterns already shipped:**
  - Address Book: a square **filter button with the `options` (sliders) icon at the trailing end of the search row**,
    plus a green "applied" dot (`company/list.js:1724-1750`, `styles/common.js:218`).
  - List details: sliders icon **leading** the search row (`LS-37`). Its filter is a centred "Filter By" modal with
    Clear Filter / Filter buttons (`LS-41`, `LS-42`).
  - The app has **two conventions** for where the filter button sits. Unifying them is a separate proposal (A7),
    not part of this one.
- **Earlier placement decisions for this screen:** none recorded.

## A2. Candidates (mobile)

| Rank | Candidate | Cost | Gain | Wins when | Reach | Density |
|---:|---|---|---|---|---|---|
| **1** | **Filter button at the trailing end of the search row** (Address Book pattern) | Search field loses about one button width; nothing moves vertically | Next to the control it pairs with; matches the closest sibling screen; "applied" dot shows state when the panel is closed | Filters are occasional and have more than about 3 options | top third — fine for an occasional control | +1 control in an existing row |
| 2 | Filter icon **leading** the search row (List details pattern) | Same as 1 | Matches the list-details screen the user opens next | The owner prefers the list-details convention | same | same |
| 3 | Always-visible **chip row** under search (e.g. Newest · Most companies · Shared) | Pushes every card down by one chip row on every visit, including 0–1 lists | One tap, no panel; state always visible | Just 2–3 fixed options, used on most visits | good | adds a row to a screen that is already 7 groups |
| 4 | Header icon beside + | Two icons compete in the header; farthest from the thumb | Always visible | Never here — it competes with the primary action | poor | header crowding |
| 5 | Inside the per-list "…" menu | — | — | Never — that menu acts on **one** list, not the collection | — | — |

**Recommendation: 1.**
- Why: the filter serves the search row's purpose, the closest sibling top-level screen (Address Book) already
  teaches users this exact spot, and nothing moves vertically.
- Why not 3: the chip row would beat it only if the criteria turn out to be a few fixed sorts; that depends on the
  open question.
- Why not 2: it would match a detail screen rather than a library screen.

**Filter panel:** reuse the centred "Filter By" modal pattern (`LS-41/42`: fields + Clear Filter / Filter), **not**
a new bottom sheet. A bottom sheet reaches better, but it would be a second panel pattern in the app. Record: consistency
chosen over reach.

## A3. Integration (partial — blocked on criteria)

- **Component:** there is **no shared filter-button component**. Address Book renders it inline with hard-coded
  values (`companyList.styles.js:153-163`: radius 12, `#E2E4E9`, `#FAFBFC`), which the spec rules forbid copying.
  Options:
  - (a) Build the same `Pressable` + `options` icon in the Lists screen, mapped to design-system tokens.
  - (b) Extract a shared `FilterIconButton`. That changes old Address Book code (S0.2), so it would be a separate,
    approved task.
  - Recommendation: **(a)** now; list (b) in `UPCOMING_IMPROVEMENTS.md`.
- **Layout:** the search field goes from full width to flex, with a filter button of the Address Book size at the end
  of the row. Row height, band height and card positions don't change.
- **testIDs:** `screen.lists.filters`, `screen.lists.iconoptions` (same shape as `screen.companyList.*`).
- **Filter fields (decided):** Name (text), Company count (range), Date created (range), matching the web grid columns (`list.blade.php:366-368`).
- **Filtering runs on the device** over `lists[]`. No new request is needed, provided the list payload carries the date and company count the cards already show.
- **Tokens and copy:** to be written in `spec.md`.

## A4. States (to finish in the spec)

| State | Decision so far |
|---|---|
| Empty (no lists) | **Hide** the filter button: there is nothing to narrow, and the empty card stays intended. |
| Empty (filters match nothing) | Reuse the existing `hasFilters` empty branch (`list/index.js:886`). Its copy must offer **Clear filters**. |
| Loading | Filtering runs on the device over the loaded `lists[]` (if the criteria only use fields the API already returns), so there is no second spinner. |
| Error | Same as the screen's own error: the button is disabled while `getlist` has failed. |
| Long content | Unchanged cards. The search placeholder "Search Lists" still fits at 390 pt with the button — **not verified**, check at spec time. |
| Permissions | Sales Agent and Business Sales Agent both have Lists (`web-flows.md` role table). No role variant. |
| Zero-to-one | First list created → button appears. With one list it still shows (predictable, avoids a jump at 2). |
| Filter applied | Green dot on the button (Address Book `filterAppliedDot`), and the result count stays visible via the list itself. |

## A5. Before / after (mobile, `LS-20`)

```
BEFORE                                   AFTER
┌──────────────────────────────┐         ┌──────────────────────────────┐
│ ←        Lists            +  │         │ ←        Lists            +  │   header unchanged
├──────────────────────────────┤         ├──────────────────────────────┤
│ [🔍 Search Lists           ] │         │ [🔍 Search Lists     ] [⚙︎•] │   search narrows; filter button added
├──────────────────────────────┤         ├──────────────────────────────┤   (• = applied dot)
│ (1) Test List Brain 0001 … > │         │ (1) Test List Brain 0001 … > │   cards: no vertical movement
│ (2) L10                  … > │         │ (2) L10                  … > │
│ …                            │         │ …                            │
├──────────────────────────────┤         ├──────────────────────────────┤
│ tab bar                      │         │ tab bar                      │
└──────────────────────────────┘         └──────────────────────────────┘
```
**Nothing crosses the fold.** Only the search field's width changes.

## A6. Cross-platform

| Platform | Placement | Reason |
|---|---|---|
| Web `/lists` | **Existing grid filter row** (no new UI unless a new criterion needs a column) | Filters already present (`list.blade.php:344-368`) |
| Mobile `Lists` | Filter button in the search row → Filter By modal | Candidate 1 above |

Intentional divergence: **web inline filter row ↔ mobile modal** (screen width).
**Not yet written to `parity-map.md`**: the F11 row is owned by the pending register migration, and the criteria are
undecided. Add it with the spec.

## Impact

- **Tests and baselines that will change:**
  - `LS-20` as a visual reference (the search row changes).
  - The brain's Maestro suite `workspace/test-suites/mobile/F01-login-main-nav.yaml` captures the screen
    (`${SHOT}-05-lists`, line 89). That screenshot will differ (**expected, not a regression**); the flow itself
    asserts nothing on the search row, so it keeps passing.
  - Test cases `TC-M-F11-001` ("Lists" with search and numbered cards) and `TC-M-F11-002`
    (`workspace/test-cases/F01-mobile-login-main-nav.md`) still hold. Add a case for the filter button and its
    applied dot.
  - No flow in `repos/mobile/.maestro` targets the Lists library (grep 2026-09-17).
  - The API suite is unaffected (no endpoint change).
- **Flows:** F11 on mobile. Web F11 is unchanged. Generate Route from a list (`LS-21`) is unaffected.
- **Data:** none new **if** the criteria use fields already in `getlist` (name, date, company count). A criterion
  such as "shared with me" or "unread" needs data the mobile card doesn't show today. That is a performance change,
  an error-state change and possibly an API change (QG-8 for mobile + MCP consumers).
- **Shared code:** none if option (a) is used.

## Placement decision record

| Field | Value |
|---|---|
| Screen | mobile `Lists` (`LS-20`); web `/lists` (`SLS-19`) |
| Added | filter for the list collection |
| Routing | PLACE (same intent as Search Lists) |
| Candidates | trailing filter button · leading filter button · chip row · header icon · per-list menu |
| Winner | trailing filter button → Filter By modal (Address Book pattern) |
| Rejected | header icon (competes with +) · per-list menu (wrong scope) · chip row (conditional, pending criteria) · leading button (detail-screen convention) · bottom sheet (second panel pattern) |
| Interactive groups | **7 → 8** (strict count; 7 → 7 if filter counts with search). **Next addition → EXTEND or restructure.** |
| Web | no new UI; grid filter row already covers name / quantity / date |
| Recorded | here; queued as a `decision` entry for `brain/memory/` |

## Open questions for the owner (answered 2026-09-17, see Owner decisions above)

1. **Which criteria?**
   - Fields the app already loads: name, date created, number of companies.
   - Fields it doesn't load: shared with me, unread (web has an Unread tile), assigned by manager (BSA
     "manager assigned leads" lists, `web-flows.md` W-F11).
   - The answer decides candidate 1 vs 3 and whether an API change is involved.
2. **Group counting:** does a control that joins an existing group (filter beside search) count as a new
   interactive group? This example counted it (stricter).
3. **Filter-button position:** trailing (Address Book) or leading (List details)? The app uses both today. A
   unification proposal would be separate.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (30)

**Documents (13):** [[brain/context/api-map|API map: every V2 endpoint, who calls it, and how it behaves]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[workspace/qa-reports/2026-09-17-knowledge-memory-audit|Knowledge memory audit — 2026-09-17]] · [[log|Log]] · [[brain/context/parity-map|Mobile vs web differences]] · [[brain/memory/entries/decision/20260917-54748f-lists-library-filter-placement|Placement: a filter on the Lists library (mobile LS-20)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[workspace/test-cases/F01-mobile-login-main-nav|Test cases — F01/F05 mobile login and main navigation (P0/P1)]] · [[brain/memory/entries/pattern/20260917-ef5512-ui-dx-02-no-shared-filter-button-component-addre|UI-DX-02 — No shared filter-button component. Address Book builds it inline with hard-coded values (radius 12, #E2E4E9,…]] · [[brain/context/UPCOMING_IMPROVEMENTS|Upcoming improvements: application findings not fixed during the brain work]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]]

**Product features (3):** [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]]

**Coding rule (1):** [[_id/S0.2|Change new code only]]

**Quality check (1):** [[_id/QG-8|API contract suite for mobile + MCP consumers when V2 /…]]

**Screenshots (7):** [[_capture/AB-01|Address book – companies]] · [[_capture/LS-41|List – filter]] · [[_capture/LS-42|List – filter options]] · [[_capture/LS-37|List details]] · [[_capture/LS-21|List menu]] · [[_capture/SLS-19|Lists index — 'List has been created successfully'; Total Lists / Unread / Companies tiles; row actions Send List, Export CSV (disabled), View On Map, Generate Route, Edit, View, Delete]] · [[_capture/LS-20|Lists library]]

**Code files (5):** [[_code/mobile/App/styles/common.js|common.js]] · [[_code/mobile/App/components/company/companyList.styles.js|companyList.styles.js]] · [[_code/mobile/App/components/company/list.js|list.js]] · [[_code/mobile/App/components/list/index.js|list/index.js]] · [[_code/mobile/App/components/common/ScrollHintArrow.js|ScrollHintArrow.js]]

%% brain-links:end %%
