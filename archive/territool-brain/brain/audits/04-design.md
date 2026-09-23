---
area: audits
tags: [brain/audits]
ref: "Audit 4 – design review"
---

# Phase 4 — Design Audit

- **Date:** 2026-09-15
- **Status:** STOPPED. **The proposed unified token set (§7) and decisions D-DS1–D-DS8 need the owner's approval.** Nothing has been changed in either repo.
- **Scope rule:** tokens and patterns below are for **new code only** (USER SAID "do not touch the old code"). The token strategy is additive for that reason (D-DS1).

## Method and coverage

| Input | Used | Notes |
|---|---|---|
| Mobile screenshots | **all 48** (`Design-Brain/03-Assets/Screenshots/Archive-2/IMG_4563–4611`, iPhone 1170×2532 @3x = 390×844 pt). **40 viewed visually**; 8 near-duplicates (`4571, 4584, 4585, 4588, 4593, 4594, 4596, 4600`) checked only through pixel analysis | iOS TestFlight 42.30/42.31, account "Testim" |
| Video frames | 3 of 46 viewed (`VID3/v3_000_0s`, `x3_t28s`, `x3_t52s`) for loading states | frames are 389×844 |
| Pixel analysis | Every colour covering ≥ 0.4% of each screenshot (full resolution), matched to the nearest `App/styles/theme.js` token (RGB distance). Plus 5×5 median samples at 29 UI points, and WCAG contrast for token pairs | Converted with macOS `sips` → BMP, parsed in Node in the scratchpad; no installs |
| Claimed design system | `repos/mobile/Design-Brain/01-Brand-Guidelines/*`, `05-Design-System/*`, `App/styles/theme.js`, `components/common/AppButton.js` | `shoebox/04-design/` is **empty** |
| Code cross-check | Mobile: hex, fontSize, spacing, radius literal counts. Web: `public/css/*.css`, Blade inline styles, manager-portal JSX/CSS variables | counts are pattern-based (±5%) |
| **Web screenshots** | **none exist (gap B5)** | Web visual critique and mobile-vs-web visual comparison are **BLOCKED**; web findings below are code-only |
| Android | no captures | Android visual parity not assessed |
| Deferred by owner | Register, paywall, subscription screens | not audited visually |

---

## 1. The real mobile design system (from pixels), diffed against the claimed one

### 1.1 Colours that actually appear (48 screenshots)

| Colour | Screens | Nearest token | Verdict |
|---|---|---|---|
| `#FFFFFF` | 48 | `white` | ✅ |
| `#124AC6` | 36 | `primary` | ✅ header, CTAs, selected footer icon |
| `#F6F7FB` | 23 | `ccSurface` | ✅ body sheet |
| `#E5E7EB` | 21 | `border` | ✅ |
| `#F3F4F6` | 18 | `surfaceMuted` | ✅ |
| `#E2E4E9` | 7 | `borderStrong` | ✅ input borders |
| `#111827` / `#6B7280` | 7 / 5 | `textPrimary` / `textSecondary` | ✅ |
| `#4A90E4` | 6 | `secondary` | ✅ selected segment on blue header (`4565`, `4595`, `4603`) |
| `#FAFBFC` / `#F9FAFB` | 6 / 6 | `surfaceInput` | ✅ (two near-identical values in use) |
| `#225BD4` → `#2862DA` | all header screens | gradient stops | ✅ `theme.colors.linearGradient` |
| **`#F0F4FF`** | 3 (`4563`, `4591`, `4605`) | none (Δ6 to `publishBg`) | ❌ **off-token.** Unread tile/row tint, hardcoded in `dashboard/dashboard.styles.js`, `list/listIndex.styles.js`, `route/index.js` |
| **`#E0E7FF`** | `4605` | none | ❌ off-token. Hardcoded in `dashboard.styles.js`, `findLeads/aiFindLeads.js`, `findLeads/index.js` |
| **`#EAEEF8` / `#E9EDF7`** | `4572`, `4593`, `4594` | none (Δ6.5) | ❌ selected-card tint on Create Route/List (not a literal in code, so likely a computed overlay) |
| **`#D1FAE5`** | `4564` | none | ❌ "Business Client" chip background |
| **`#EFF6FF`** | `4581` | none | ❌ Finding-contacts modal header |
| `#00C851` | `4595`, `4592` | none | Status-tag stripe; likely a user-chosen tag colour (data-driven), not a design token |

Sampled UI points (5×5 median):
- Confirm Leads CTA `#124AC6` (`4567`)
- Settings "Upgrade" primary / "Cancel" **`#CF5B51`** (visual, `4564`)
- AI Find Leads "Clear all" **`#E94A5D`** family (`4565`)
- Disabled "Next step" `#B5B5B5` (`4565`)
- Create Route chips: All `#E5E7EB`, Find Leads **`#44AADA`**, Map View **`#FFB800`** (`4572`)
- Start pin `#43B895` ≈ `lightGreen`; End pin `#E94D60` ≈ `danger` (`4573`)
- Unread row `#F0F4FF` (`4591`)
- Company card `#F9FAFB`; distance pill `#F9FAFB` (`4576`, `4575`)

### 1.2 Claimed vs actual: mismatches

| # | Claim (source) | Actual (evidence) | Finding |
|---|---|---|---|
| M-1 | "Confirm Leads is **near-black**" (`Design-Brain/01-Brand-Guidelines/Colors.md`, `Token-Inconsistencies.md`) | `IMG_4567` CTA pixel = **`#124AC6`** (primary). In `IMG_4568`/`4569` the same button sits under a dark modal scrim, which makes it look navy | **Design-Brain is wrong here.** Don't carry it into the brain |
| M-2 | "Find Leads chip is **teal**" (`Colors.md`, `Component-States.md`) | `IMG_4572`/`4592` pixel = **`#44AADA`** (`ttBlue`, sky blue) | Design-Brain mislabels the colour |
| M-3 | "Copy **DIN Condensed**; do not introduce Inter" (`Usage-Rules.md`, `Typography.md`) | **System font (SF Pro)** renders on Dashboard tiles/activity (`4563`, `4605`, `v3_000_0s`), Share-the-app modal (`4602`), Calendar rows (`4608`), QR scanner (`4609`). Code: `ReferralInviteModal.styles.js` 0 `fontFamily` / 7 `fontWeight`; `ActivityRowBody.js` 0 / 1; `QrCodeScannerScreen.js` 0; `dashboard.styles.js` 1 active `fontFamily` (10 commented out) / 18 `fontWeight` | **Three typefaces live on mobile:** DIN Condensed Bold, DIN Regular (wide) and SF Pro |
| M-4 | `theme.colors.danger` `#E94A5D` is the danger colour | `AppButton` danger variant hardcodes **`#CF5B51`** (`AppButton.js:17`); both reds visible (`4564` Cancel vs `4565` Clear all / `4601` Log out) | Two reds for the same meaning |
| M-5 | Spacing tokens 4/6/8/12/16/20/24 | Code literals: `padding/margin` **8 (292), 12 (266), 10 (214), 4 (187), 16 (183), 14 (157), 6 (122), 5 (70)**, against `theme.spacing` used 154 times | 10, 14 and 5 are off-scale and more common than tokens |
| M-6 | Radius tokens 4/8/10/12/16/20/24 + screen body 25 | Literals: **12 (157)**, 10 (46), 20 (36), 16 (29), 8 (27), **14 (26)**, 5 (20); `theme.radius` used 28 times | 14 and 5 off-scale |
| M-7 | Typography tokens (`theme.typography`) | `fontSize` literals **758** (16×158, 14×129, **15×98**, **13×93**, 12×51, 20×43, 18×42); `theme.typography` used 166 times | 15 and 13 aren't in the scale |
| M-8 | Single overlay value `overlayDark` 0.35 | `AppConfirmModal` backdrop **0.45** (`AppConfirmModal.js:52`); FilterModule **0.4** (`filterModule/index.js:832`) | three scrims |
| M-9 | Theme palette is "single source of truth" (`theme.js:1-4`) | Near-duplicate tokens inside it: `secondary`/`info` `#4A90E4` vs `blue` `#4a90e2`; `black`/`textBlackPure`/`shadowBlack` all `#000000`; `primaryDark` is **teal** `#00A99D`; teal family `ttGreen` `#12AA9D` / `boldActive` `#12A090` / `ttTab` `#3E918B` | the token set itself needs consolidation |
| M-10 | Legacy font names removed | `"DIN2014-Light"` / `"Din2014-Light"` still used as `fontFamily` 16 times (not linked on mobile, so these fall back) | leftover |

---

## 2. Inconsistency inventory (same element, different treatment)

| Element | Variants observed (evidence) | Count |
|---|---|---|
| **Buttons** | (1) primary fill: most CTAs. (2) **outline 2px primary**: `4604` Register Here, `4565` Select all, `4569` Add to a list, `4583` All Done, `4590` Clear Filter, `4601` Cancel. (3) **grey fill + blue text + grey border**: `4572`/`4592` Select All. (4) **grey fill + dark text**: `4569` Return to Dashboard, `4570` Clear. (5) **white + grey border + dark text**: `4573` Go Back, `4583` Reset, `4580` Cancel. (6) danger `#E94A5D`: `4565` Clear all, `4601` Log out. (7) danger `#CF5B51`: `4564` Cancel. (8) **dark slate `#374151`**: `4586` Gallery (AppButton `neutral`). (9) **white + grey border + black text as the primary action**: `4602` Send invite. (10) tinted outline pill: `4583` Add. (11) glass on header: `4576` pager/back/info | **11 styles**; `AppButton` defines 5 (primary, danger, neutral, dark, ghost) and is imported in only 12 files |
| **Disabled button** | grey `#B5B5B5` fill + grey text (`4565`, `4603`); **light primary** (`4580` Submit report); **~80% primary** (`4611` Share) | 3 |
| **Button label font** | DIN Condensed Bold (most); **DIN Regular wide** on company action buttons (`4576` More Info/Mark/Call/Navigate) and Quick Actions (`4578`); **SF Pro** (`4602`, `4605` View All) | 3 |
| **Segmented control** | (a) on blue header: selected `#4A90E4` fill + white text (`4565`, `4595`); (b) in body: grey container, selected **white** + primary text (`4563` Upcoming/Recent, `4565` City/ZIP, `4602` Email/Phone); (c) selected **primary fill** (`4587` Search/Manual) | 3 |
| **Chips on Create Route/List** | All/Selected toggle between primary and grey, while "Find Leads" is **sky `#44AADA`** and "Map View" is **gold `#FFB800`**: both look permanently "selected" (`4572`, `4592`) | action vs filter chips indistinguishable |
| **Credits indicator** | glass pill with wallet icon "2952 Credits" (`4563`); stacked number + "Credits" text (`4565`, `4583`) | 2 |
| **Header / screen shell** | gradient header + 25 pt curved sheet (majority); **flat, no sheet** (`4608` Calendar); **wave** shape + avatar (`4598` View Contact); **glass button header** (`4576`, `4610`); **dark full-screen** (`4609` QR); **no header, slate `#F1F5F9` page** (`4574` publish loader); status band "Unclassified" in grey under the header (`4587`, `4599`) | 6 |
| **Close control on modals** | plain X (`4570`, `4602`, `4611`); **grey filled circle X** (`4590`); none, cancel button only (`4601`, `4580`) | 3 |
| **Form field labels** | uppercase + colon in DIN Regular (`4587` "SEARCH COMPANY NAME:", `4599` "FIRST NAME:"); DIN Condensed Bold sentence case (`4565` "1. City or ZIP", `4590` "City Name", `4611` "Email address"); uppercase condensed with icon (`4606`/`4607`) | 3 |
| **Empty states** | title + body + CTAs (`4576` "No contacts found."); body only (`4576` "No activities yet."; `4563` "No upcoming activities yet."). Code has ≥ 15 distinct empty strings (e.g. "No matching results found..." ×19, "No upcoming activities." vs "No upcoming activities yet.") | 2 layouts, 15+ copies |
| **Loading states** | full-screen blocking overlay with logo "LOADING." + "Loading credits…" (`v3_000_0s`: blocks the whole dashboard for a credits call); inline spinner + label (`x3_t28s` "Loading lists…"); inline spinner **without** label (`x3_t52s` Contacts); progress modal with % (`4568`, `4574`) | 4 |
| **Date/time formats** | "Sep 11 2026" (`4589`, `4591`); "Fri, Sep 11 · 7:39 AM PT" (`v3_000_0s`); **"Invalid Date PT"** (`4563`, `4605`); "09/02/2026, 2:07 AM" and "09/11/2026" (`4608`); "Visited 05/14, 09:18 am" (lowercase am, `4592`); "18 min ago" (`4605`) | **6 formats + 1 bug** |
| **List row pattern** | Routes: date column left + stats (`4589`); Lists: meaningless ordinal circle + date · count (`4591`); Route detail: stop number circle (`4575`); Address Book: no leading element (`4595`) | 4 |
| **Row affordance** | overflow "•••" **and** chevron in the same row (`4589`, `4591`) | double affordance |
| **Footer icons** | mixed outline (home, routes, settings) and filled (search, address book, lists) (`4564`, `4575`) | 2 icon styles |
| **Scroll hint chevron** | floats over content and overlaps card titles/buttons (`4572` over "Aire Serv of South Tulsa", `4589`, `4592`, `4595`, `4603`, `4566` over map zoom) | `ScrollHintArrow` used in 10 files |
| **User-facing vocabulary** | "Waypoint" in UI copy: "Search Company (Waypoint)" (`4572`, `4577`, `4592`), "99 Waypoints remaining" (`4589`), ~45 strings in code. The approved glossary says **Stop**. "Business Client" chip (`4564`; `editstatus.js:781, 797`): the approved role name is **Business Agent** | glossary violations |
| **Raw data shown** | "Industry: hair_care" (`4595`, `4592`: raw enum via `` `Industry: ${item.type}` `` at `route/create.js:1015`, `list/edit.js:643` …); "Not entered" ×5 as values (`4578`); "Industry: Not found" vs "Not entered" | formatting |
| **Toast types** | `error` 212, `success` 84, `info` 44, custom `danger` 7 | `danger` duplicates `error` |

---

## 3. Mobile ↔ web visual parity

**Visual comparison is BLOCKED (no web screenshots, gap B5).** The code-level comparison:

| Aspect | Mobile | Web user app (Blade) | Manager portal (React) | Parity |
|---|---|---|---|---|
| Primary | `#124AC6` | `#124ac6` (custom.css 30, Blade 76) + **Bootstrap 3 blue `#337ab7`** (Blade 26, CSS) + `#2563eb`, `#007bff`, `#268efd` | `--blue: #124ac6` | brand blue shared ✅; web has 4 extra blues ❌ |
| Accent teal | `primaryDark` `#00A99D` (+ 3 near-teals) | — | `--teal`/`--green: #00a99d` | shared value ✅, naming differs |
| Neutrals | **Tailwind gray** (`#111827`, `#6B7280`, `#E5E7EB`, `#F3F4F6`) + slate in a few sheets | **Tailwind slate** (`#64748b`, `#f1f5f9`, `#e2e8f0`, `#94a3b8`) + Bootstrap greys `#333/#666/#eee` | custom: `--text #1a1a1a`, `--text-secondary #6e6e8a`, `--border #e5e5e5`, `--bg #f5f6fa` | ❌ three neutral families |
| Typeface | DIN Condensed Bold + DIN Regular + SF Pro (§1.2 M-3) | **`"DIN 2014 Bold/Light"` does load as a web font on every page.** ~~probably falls back~~ is corrected: the `@font-face` lives in the vendor file `public/vendor/adminlte/dist/css/AdminLTE.min.css:5, 9` → `/fonts/DinBold.ttf`, `/fonts/DinLight.ttf`, verified by the Playwright font probe (§11). **Inter** also loads on register/b2b; FontAwesome/Glyphicons icon fonts | Computed h1/body = **DIN 2014 Bold** (the global rule applies), buttons = **DM Sans**, plus **Space Grotesk** loaded | ⚠ DIN family shared (mobile DIN Condensed vs web DIN 2014); portal mixes DIN with DM Sans / Space Grotesk |
| Type sizes | 16/14/15/13 pt dominant | 14/13/12 px dominant | 12/13/14 px | different densities (expected), no shared scale |
| Radius | 12 dominant, body sheet 25 | 8 px dominant | `--radius 14`, `--radius-sm 10`, 6/8 px | ❌ |
| Shadows | `theme.shadows` sm/md/lg (0/1/.08/2, 0/2/.12/4, 0/4/.16/8) | ad hoc | `--shadow-sm 0 1px 3px .06`, `-md 0 4px 16px .08`, `-lg 0 12px 40px .12` | ❌ |
| Spacing | 4/8/12/16 + off-scale 10/14/5 | 10px (61), 5px (28), 15px (16): off 4-pt grid | px values in CSS | ❌ |
| Design variables | `theme.js` object | 4 CSS custom properties in custom.css | ~30 CSS variables (`--blue`, `--radius`, `--shadow-*`, `--text-*`) | the portal is the only web surface with tokens |

**Conclusion:** both products share the **brand blue and the teal**. Everything else (typeface, neutrals, radius, shadow, spacing) differs, and web itself runs three visual systems (Blade/AdminLTE, auth pages on Lato, React portal). They don't yet look like one product at the type and neutral level.

---

## 4. Hardcoded values in code

A full per-occurrence list would run to thousands of lines. Counts, top values and where they sit are below. Each count can be re-generated with the command noted.

| Repo | What | Count | Where / top values | Re-generate |
|---|---|---|---|---|
| Mobile | hex colours outside `theme.js` (excl. `customPackage`) | **1,329** | `#6B7280`×163, `#111827`×130, `#000`×81, `#9CA3AF`×79, `#E5E7EB`×65, `#FFFFFF`×63: most **duplicate existing tokens** | `grep -rEoh --include='*.js' --exclude-dir=customPackage '#[0-9A-Fa-f]{6}\b\|#[0-9A-Fa-f]{3}\b' App` |
| Mobile | inline `style={{…}}` | **913** (ESLint `no-inline-styles` 1,229) | — | `01-mobile.md` §1 |
| Mobile | `fontSize: <number>` | **758** | 16, 14, 15, 13 | `grep -rEoh 'fontSize: *[0-9.]+'` |
| Mobile | padding/margin literals | **~2,000** | 8, 12, 10, 4, 16, 14 | `grep -rEoh '(padding\|margin)…: *[0-9.]+'` |
| Mobile | `borderRadius` literals | **~400** | 12, 10, 20, 16, 8, 14 | `grep -rEoh 'borderRadius: *[0-9.]+'` |
| Mobile | `AppButton` pressed/danger colours | 8 hex in `AppButton.js:11-44` | `#CF5B51`, `#0d4bb8`, `#374151`, `#1a1a1a` | — |
| Web | hex in app CSS (`public/css/*.css`, excl. jqwidgets/vendor) | **~2,280** | `custom.css` 506, `app.css` 492, `manager-portal-responsive.css` 230, `list-view.css` 175, `route-view.css` 175, `manager-ai-find-leads.css` 158, `subscribe.css` 118 | `grep -Eoi '#[0-9a-f]{3,8}\b' public/css/*.css` |
| Web | hex inside Blade views | **1,607** | `#124ac6`×76, `#ffffff`×49, `#666666`×27, `#337ab7`×26 | `grep -rEoi --include='*.blade.php' …` |
| Web | inline `style="…"` attributes / `<style>` blocks in Blade | **1,841 / 102** | — | — |
| Web | portal JSX/JS hex / inline `style={{}}` | **143 / 58** | chart palette `#8b5cf6`, `#f59e0b`, `#ef4444`, `#ec4899`, `#10b981`, `#06b6d4` | — |
| Web | padding/margin px in CSS | custom.css 371, app.css 199, manager-portal-responsive.css 200 | 10px, 5px, 15px | — |

---

## 5. Accessibility findings (WCAG 2.x contrast; ≥ 4.5 normal text, ≥ 3.0 large/bold ≥ 14 pt bold)

| Pair (where) | Ratio | Result |
|---|---|---|
| white on primary `#124AC6` (all CTAs, headers) | 7.45 | ✅ |
| `textPrimary` on white | 17.74 | ✅ |
| `textSecondary` `#6B7280` on white / on `#F6F7FB` | 4.83 / 4.52 | ✅ (borderline on sheet) |
| white on danger `#E94A5D` (`4565`, `4601`) | 3.75 | ⚠ passes only because labels are ≥ 17 pt bold |
| white on `#CF5B51` (`4564`) | 3.99 | ⚠ large text only |
| white on `#4A90E4` (selected segment) | 3.28 | ⚠ large text only |
| **white on `#44AADA` Find Leads chip** (`4572`, `4592`) | **2.62** | ❌ fails |
| **white on `#FFB800` Map View chip** (`4572`, `4592`) | **1.73** | ❌ fails badly |
| **white on teal `#00A99D`** (portal/mobile accent fills) | **2.93** | ❌ fails for text |
| placeholder `#9CA3AF` on `#FAFBFC` (all inputs) | 2.45 | ❌ low (placeholders are exempt, but they carry example formats) |
| grey label on disabled `#B5B5B5` (`4565` Next step) | ~2.4 | disabled (exempt), but reads as broken |

Also:
- `allowFontScaling={false}` in 18 places and `maxFontSizeMultiplier` in 13 cap Dynamic Type.
- `accessibilityRole` appears 230 times, sparse against 1,406 testIDs.
- Icon-only header buttons (glass back/pager/info on `4576`) need labels; not verified.

---

## 6. Per-screen critique (mobile, iOS)

Severity:
- **S1**: visible bug or broken information.
- **S2**: accessibility failure, misleading hierarchy, or a pattern that breaks consistency.
- **S3**: polish.

| Screen (file) | Findings |
|---|---|
| Dashboard `4563`, `4605`, `v3_000_0s` | **S1** "Invalid Date PT" under Activity (the video shows a valid date, so the formatter fails intermittently). **S2** whole dashboard blocked by a full-screen loader while only credits load. **S2** tiles/activity rows in SF Pro while the rest of the app is DIN. S3 name truncated "Testi…" beside a large credits pill. S3 badge + "New route ready" + blue border + tint = four signals for one unread state |
| Settings `4564`, `4601` | **S2** "Cancel" (subscription) is a large red button with equal weight to "Upgrade" (destructive action as prominent as the primary). **S2** "Business Client" chip uses the retired role name. S2 red `#CF5B51` differs from Log out red `#E94A5D`. S3 promotional "Rate the app" card uses a different type style |
| Login `4604` | S3 placeholder contrast 2.45. S3 footer links float without separation. Otherwise clean and consistent |
| AI Find Leads form `4565` | **S2** "Clear all" red at equal weight beside "Search". S2 disabled "Next step" grey-on-grey. S3 credits shown as stacked text (different from dashboard pill). S3 "refridgeration" typo is user data, not UI |
| AI map `4566` | S2 scroll-hint chevron overlaps map zoom control. S3 third toolbar style (Clear/Start segmented + outline List) |
| Selected leads / confirm `4567`, `4568` | S3 progress modal says 100% while the CTA behind still spins |
| Choice modal `4569` | S3 copy says "added to the database" (internal jargon). Otherwise good 3-level button hierarchy |
| Add leads to route `4570` | S3 long instructional paragraph; two identical grey "Clear" buttons |
| Create Route / List `4572`, `4592` | **S2** Find Leads / Map View chips fail contrast and look like selected filters. **S2** "Search Company (Waypoint)" exposes the internal term. **S2** raw "Industry: hair_care". S2 scroll-hint chevron overlaps a card title. S3 "Select All" grey-with-blue-text differs from "Select all" outline on `4565`. S3 date "Visited 05/14, 09:18 am" (lowercase) |
| Start/End points `4573` | S3 helper text collides with the footer divider; third secondary-button style ("Go Back") |
| Route publish loader `4574` | S3 different page background (slate) and no header/escape; acceptable as a blocking task screen |
| Route detail `4575` | S3 good numbered stops + leg distance; header crowded (title, subtitle, share, edit, filter, search, Map) |
| Active map `4577` | S2 "Search Company (Waypoint)"; S3 start marker not distinguished from stop 1 |
| Company on route/list `4576`, `4610` | **S2** unlabeled circle beside the company name (visited/select? affordance unclear). S2 action-button labels in wide DIN Regular vs condensed elsewhere. S3 two empty-state styles in one screen. S3 "Mark" (bookmark) easily confused with "Mark Visited" (glossary) |
| More Info `4578` | S2 disabled social buttons shown instead of hidden. S3 "Not entered" repeated as values |
| Route info `4579` | good pattern (labelled fields, clear primary/secondary) |
| Report company `4580` | S3 disabled submit uses light-primary (third disabled style) |
| Finding / empty contacts `4581`, `4582` | S3 off-token header tint `#EFF6FF`; S3 copy "We looked for contacts and other things" |
| Find Contacts `4583` | S3 "Contacts 8 found" word order; S3 three button styles in one row (primary / grey outline / primary outline) |
| Scan card `4586`, `4606`, `4607` | S3 dark slate "Gallery" button is a style used nowhere else. Otherwise a well-structured form (sectioned, iconed labels) |
| Add Company `4587` | S2 segmented control selected = primary fill (third segmented style). S3 grey "Unclassified" band breaks the curved-sheet shell. S3 labels uppercase with colons |
| Filter `4590` | S3 filled grey circle close (third close style). S3 "Sort By Availability" control clipped by the scroll area |
| Routes / Lists library `4589`, `4591` | S2 "99 Waypoints remaining (99…" truncates mid-parenthesis and uses "Waypoint". S3 ordinal numbers on Lists carry no meaning. S3 "•••" + chevron double affordance |
| Address Book `4595`, `x3_t52s` | **S2** raw "Industry: hair_care"; S3 inconsistent "Not entered"/"Not found". S3 contacts loading spinner has no label (lists has one) |
| View Contact `4598` | **S2** "Delete" as a prominent tile in the same row as LinkedIn/Call/Email. S3 unique wave header. S3 disabled action tiles without explanation |
| Add Contact `4599` | S2 required fields not marked (only optional ones are). S3 placeholder "Title" for Position |
| Share the app `4602` | **S2** entire modal in SF Pro. **S2** primary action "Send invite" styled as a neutral outlined button. S3 orange/peach icon colour outside the palette |
| AI results `4603` | S2 scroll-hint overlaps a card |
| Calendar `4608` | S2 no curved sheet (shell break); rows in SF Pro. S3 dates "09/02/2026, 2:07 AM" vs "09/11/2026" (missing time) |
| QR scanner `4609` | S3 system font + iOS-style "<" back vs arrow elsewhere; acceptable as a camera screen |
| Share route `4611` | S3 "Share" at ~80% primary looks disabled (no explicit disabled state) |

---

## 7. PROPOSED UNIFIED TOKEN SET: for owner approval

**Principle (D-DS1, recommended): additive.** New code uses a new token namespace on both platforms; existing `theme.js` keys and existing CSS **keep their current values**, so no old screen changes (USER SAID: don't touch old code).
- **Mobile implementation:** `App/styles/tokens.js` exporting `tokens` (new file, new code only).
- **Web implementation:** `public/css/tt-tokens.css` defining `--tt-*` CSS custom properties (new file; the manager portal already works with CSS variables).
- Values are chosen from **colours already in use**, so new screens look like the best existing screens. The only new value is `color.accent.teal-strong`, which fixes contrast.

### 7.1 Colour

| Token | Value | Replaces / aliases (legacy, frozen) | Mobile impl | Web impl | Evidence |
|---|---|---|---|---|---|
| `color.brand.primary` | `#124AC6` | `theme.colors.primary`, portal `--blue` | `tokens.color.brand.primary` | `--tt-color-primary` | 36/48 screens; all web surfaces |
| `color.brand.primary-pressed` | `#0E3DA6` | AppButton `#0d4bb8`, portal `--blue-dark` | `…primaryPressed` | `--tt-color-primary-pressed` | portal CSS var |
| `color.brand.primary-subtle` | `#F0F4FF` | hardcoded unread tint (3 files) | `…primarySubtle` | `--tt-color-primary-subtle` | `4563`, `4591` |
| `color.brand.primary-muted` | `#E0E7FF` | hardcoded `#E0E7FF`; portal `--blue-light #e6eefb` | `…primaryMuted` | `--tt-color-primary-muted` | `4605` |
| `color.brand.on-primary-selected` | `#4A90E4` | `secondary`, `info`, `blue` | `…onPrimarySelected` | `--tt-color-on-primary-selected` | `4565`, `4595` (large bold text only) |
| `color.accent.teal` | `#00A99D` | `primaryDark`, `ttGreen`, `boldActive`, `ttTab`, portal `--teal`/`--green` | `…accentTeal` | `--tt-color-accent-teal` | **fills/icons only; never white text** (2.93) |
| `color.accent.teal-strong` | `#0F766E` | — (**new**) | `…accentTealStrong` | `--tt-color-accent-teal-strong` | teal text on white (5.47:1) |
| `color.danger` | `#E94A5D` | `danger`, AppButton `#CF5B51` (retire for new code), portal `--red #ef4444` | `…danger` | `--tt-color-danger` | `4565`, `4601`; **labels must be ≥ 17 pt/px bold** (3.75) |
| `color.danger-text` | `#B91C1C` | `publishErrorText`, portal `#b91c1c` | `…dangerText` | `--tt-color-danger-text` | red text on white (6.47:1) |
| `color.danger-subtle` | `#FEE2E2` | `publishErrorBg`, portal `--red-light` | `…dangerSubtle` | `--tt-color-danger-subtle` | existing |
| `color.success` | `#15803D` | `publishSuccessIcon`; `success #4CAF50` retired for new code | `…success` | `--tt-color-success` | text/icon on white (5.02:1) |
| `color.success-subtle` | `#DCFCE7` | `publishSuccessBg`, portal `#dcfce7` | `…successSubtle` | `--tt-color-success-subtle` | existing |
| `color.warning` | `#F59E0B` | `ttYellow #FFB800`, `warningOrange`, portal `--amber` | `…warning` | `--tt-color-warning` | **dark text only** (`#111827` on it: 8.3:1) |
| `color.warning-subtle` | `#FEF3C7` | portal `--amber-light` | `…warningSubtle` | `--tt-color-warning-subtle` | existing |
| `color.text.primary` | `#111827` | `textPrimary`; portal `--text #1a1a1a`; `nearBlack` | `…textPrimary` | `--tt-color-text` | 17.7:1 |
| `color.text.secondary` | `#6B7280` | `textSecondary`, `ccMuted`; web slate `#64748b`; portal `#6e6e8a` | `…textSecondary` | `--tt-color-text-secondary` | 4.83:1 white |
| `color.text.strong-muted` | `#374151` | `textMuted` | `…textStrongMuted` | `--tt-color-text-muted` | — |
| `color.text.disabled` | `#9CA3AF` | `ccSubtle`, `disabled`; portal `--text-muted #bfbfbf` | `…textDisabled` | `--tt-color-text-disabled` | not for essential text |
| `color.text.on-primary` | `#FFFFFF` | — | `…textOnPrimary` | `--tt-color-text-on-primary` | — |
| `color.surface.page` | `#F6F7FB` | `ccSurface`; portal `--bg #f5f6fa` | `…surfacePage` | `--tt-color-bg` | 23 screens |
| `color.surface.card` | `#FFFFFF` | `white`, portal `--card` | `…surfaceCard` | `--tt-color-card` | — |
| `color.surface.muted` | `#F3F4F6` | `surfaceMuted` | `…surfaceMuted` | `--tt-color-surface-muted` | 18 screens |
| `color.surface.input` | `#FAFBFC` | `surfaceInput`, `#F9FAFB` | `…surfaceInput` | `--tt-color-input` | `4604` |
| `color.border.default` | `#E5E7EB` | `border`; portal `--border #e5e5e5`; web `#e2e8f0` | `…border` | `--tt-color-border` | 21 screens |
| `color.border.input` | `#E2E4E9` | `borderStrong` | `…borderInput` | `--tt-color-border-input` | 7 screens |
| `color.overlay.scrim` | `rgba(17,24,39,0.45)` | 0.35 / 0.40 / 0.45 black | `…scrim` | `--tt-color-scrim` | `AppConfirmModal.js:52` |
| `color.gradient.header` | `#124AC6 → #2963DB` | `linearGradient` 7 stops | `…headerGradient` (array) | `--tt-gradient-header` | mobile only unless web adopts |

### 7.2 Typography

**Family (D-DS3, owner decides):**
- **Recommended: DIN on every surface.** Titles, buttons and labels use DIN Condensed Bold; body uses DIN Regular. Mobile already ships both. Web already loads DIN 2014 (`/fonts/DinLight.ttf`, `/fonts/DinBold.ttf`) through `@font-face` in the vendor file `public/vendor/adminlte/dist/css/AdminLTE.min.css:5, 9` (verified by the font probe, §11). `tt-tokens.css` should declare its own `@font-face` for the same files (check the web-font licence). The portal would move off Space Grotesk / DM Sans for new screens.
- **Alternative:** keep DM Sans for the Manager portal as a separate "dashboard" family (desktop analytics, dense tables), and make DIN the rule for mobile and the Blade user app.
- **Never:** system font in new screens (fixes M-3).

Names are shared across platforms. Sizes are intentionally different (web desktop density), with the same hierarchy.

| Token | Family | Mobile size / line (pt) | Web size / line (px) | Replaces |
|---|---|---|---|---|
| `type.display` | DIN Cond Bold | 24 / 30 | 24 / 30 | `theme.typography.display` |
| `type.title` | DIN Cond Bold | 22 / 28 (screen titles, modal titles) | 20 / 26 | `title` |
| `type.heading` | DIN Cond Bold | 20 / 25 (section headings) | 18 / 24 | `heading` |
| `type.subheading` | DIN Cond Bold | 17 / 21 (card titles, form labels) | 15 / 20 | `subheading` |
| `type.body` | DIN Regular | 16 / 20 | 14 / 20 | `body`; literals 15/16 |
| `type.body-strong` | DIN Cond Bold | 16 / 20 | 14 / 20 | `bodyBold` |
| `type.caption` | DIN Regular | 14 / 18 | 13 / 18 | `caption`; literals 13/14 |
| `type.eyebrow` | DIN Cond Bold, uppercase, letter-spacing 0.5 | 12 / 15 | 11 / 14 | ad-hoc "CAPTURE CARD", "COMPANY" labels (`4606`, `4579`) |
| `type.button` | DIN Cond Bold | 17 / 19 (min 17 → danger/teal contrast OK) | 14 / 18 | `buttonLabel`; `fontSize={20}` override on Login |
| `type.micro` | DIN Regular | 12 / 15 | 12 / 16 | `micro` |

### 7.3 Spacing (4-pt grid)

| Token | Value | Mobile impl | Web impl | Replaces (frozen legacy) |
|---|---|---|---|---|
| `space.1` | 4 | `scaledSize(4)` | `--tt-space-1: 4px` | `spacing.xxs`, literal 5 |
| `space.2` | 8 | `scaledSize(8)` | `--tt-space-2: 8px` | `spacing.sm`, literals 6/10 |
| `space.3` | 12 | `scaledSize(12)` | `--tt-space-3: 12px` | `spacing.md`, literal 14 |
| `space.4` | 16 | `scaledSize(16)` | `--tt-space-4: 16px` | `spacing.lg`, literal 15 (web) |
| `space.5` | 20 | `scaledSize(20)` | `--tt-space-5: 20px` | `spacing.xl` |
| `space.6` | 24 | `scaledSize(24)` | `--tt-space-6: 24px` | `spacing.xxl` |
| `space.8` | 32 | `scaledSize(32)` | `--tt-space-8: 32px` | literal 28/32 |

Screen gutter: `space.4` (16). Card padding: `space.4`. Gap between cards: `space.3` (12).

### 7.4 Radius, elevation, sizes

| Token | Value | Mobile | Web | Notes |
|---|---|---|---|---|
| `radius.sm` | 8 | `8` | `--tt-radius-sm: 8px` | chips, small controls; web card legacy 8 |
| `radius.md` | 12 | `12` | `--tt-radius-md: 12px` | buttons, inputs, cards (157 mobile uses) |
| `radius.lg` | 16 | `16` | `--tt-radius-lg: 16px` | modals, sheets (`AppConfirmModal`) |
| `radius.sheet` | 25 | `SCREEN_BODY_TOP_RADIUS` | n/a | mobile screen body only (intentionally different) |
| `radius.pill` | 999 | `999` | `--tt-radius-pill: 999px` | pills, badges |
| `elevation.1` | y1 blur3 α.06 | iOS `shadowOffset {0,1}`, radius 1.5, opacity .06; Android `elevation 1` | `--tt-shadow-1: 0 1px 3px rgba(0,0,0,.06)` | cards (portal `--shadow-sm`) |
| `elevation.2` | y4 blur16 α.08 | iOS {0,4} r8 .08; Android 4 | `--tt-shadow-2: 0 4px 16px rgba(0,0,0,.08)` | popovers, sticky footers |
| `elevation.3` | y12 blur40 α.12 | iOS {0,12} r20 .12; Android 8 | `--tt-shadow-3: 0 12px 40px rgba(0,0,0,.12)` | modals |
| `size.touch-min` | 44 | `scaledSize(44)` | 40 px (pointer) | `theme.layout.minTouchTarget` |
| `size.control-height` | mobile 48 / web 40 | inputs + buttons | `--tt-control-h: 40px` | Login 54 / AppButton 50 legacy |

### 7.5 Component rules that come with the tokens (new code)

1. **Buttons: 5 variants only.**
   - `primary`: primary fill, white `type.button`.
   - `secondary`: white, 2 px primary border, primary label.
   - `tertiary`: `surface.muted` fill, `text.strong-muted` label.
   - `danger`: `danger` fill, white label; only for confirming a destructive action, never beside a primary at equal weight on a normal screen.
   - `text`: primary label, no container.
   - **One disabled state: the variant at 40% opacity.**
   - Mobile uses `AppButton` (D3 approved); web adds matching classes in `tt-tokens.css`.
2. **Segmented control: 2 variants.** "On primary header" (container white 16%, selected `on-primary-selected`) and "in body" (container `surface.muted`, selected `surface.card` + primary label). No primary-filled segments.
3. **Chips:** filter chip (selected = primary fill / unselected = `surface.muted`) vs **action chip** (`surface.card` + `border.default` + icon + primary label). Map View / Find Leads become action chips; no gold/sky fills with white text.
4. **Screen shell (mobile):** gradient header (`CustomHeader`) + `surface.page` sheet with `radius.sheet`. Full-screen exceptions only for camera and blocking task progress.
5. **Loading:** inline spinner + label in the content area. Blocking overlay only while a user-initiated mutation runs.
6. **Empty state:** icon (optional) + `type.subheading` title + `type.caption` `text.secondary` body + optional CTA.
7. **Dates (D-DS7):**
   - Relative ("18 min ago") under 24 h.
   - `MMM D` in the current year, `MMM D, YYYY` otherwise.
   - Time `h:mm A`.
   - Timezone suffix only on scheduled activities.
   - Never render "Invalid Date": fall back to "—".
8. **Copy:** approved glossary terms (Stop, not Waypoint; Business Agent, not Business Client). Enum values are always humanised ("Hair care", not "hair_care").

---

## 8. DECISIONS NEEDED (owner)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **D-DS1** | Token strategy | (a) **additive** new `tokens.js` / `tt-tokens.css` for new code, legacy values frozen; (b) change `theme.js`/CSS values in place (restyles old screens) | **(a)**, required by "don't touch old code" |
| **D-DS2** | Neutral family | (a) **Tailwind gray** (mobile majority); (b) Tailwind slate (web custom.css); (c) portal custom greys | **(a)** |
| **D-DS3** | Typeface | (a) DIN everywhere incl. portal (needs web `@font-face` + licence check); (b) DIN for mobile + Blade, DM Sans stays in manager portal; (c) system fonts | **(a)** if the DIN web licence is OK, else **(b)** |
| **D-DS4** | Danger red | (a) `#E94A5D` + `danger-text #B91C1C`, retire `#CF5B51` for new code; (b) `#CF5B51` | **(a)** |
| **D-DS5** | Disabled buttons | (a) one rule: 40% opacity of the variant; (b) keep grey fill | **(a)** |
| **D-DS6** | Create Route/List chips | (a) Find Leads / Map View become outline action chips; (b) keep sky/gold fills (contrast fails) | **(a)** (for new screens and whenever a task touches these) |
| **D-DS7** | Date/time formats | the §7.5 rule 7 set; or supply your preferred formats | adopt §7.5 rule 7 |
| **D-DS8** | Web type sizes | shared names with web-specific sizes (§7.2) vs identical pt/px on both | **shared names, web-specific sizes** |

## 9. BLOCKED / NEEDED to finish Phase 4

- **Web screenshots (B5)** of the user app (Blade), auth pages and manager portal at 1440 px plus 3 screens at tablet/mobile width. Without them the web critique and visual parity stay code-only. (Self-capture is possible once installs and logins are approved; staging logins are now available.)
- Android captures for at least Dashboard, Create Route, Company view.
- Deferred packs (Register, paywall, subscription) when you're ready.
- Figma or reference designs, if any exist (`shoebox/04-design/figma`, `references` are empty).

---

## 10. APPROVAL RECORD (USER SAID, 2026-09-15)

| # | Decision (final) |
|---|---|
| **D-DS1** | **Add new tokens; do not change existing values** (`App/styles/tokens.js`, `public/css/tt-tokens.css`, new code only) |
| **D-DS2** | **Gray neutral family** |
| **D-DS3** | **DIN only, everywhere, including the manager portal.** Web already loads DIN 2014 via `@font-face` in the vendor file `public/vendor/adminlte/dist/css/AdminLTE.min.css:5, 9` (`/fonts/DinBold.ttf`, `/fonts/DinLight.ttf`). `tt-tokens.css` should declare its own `@font-face` for the same files so new pages don't depend on the vendor file. Portal new screens stop using DM Sans / Space Grotesk. Web font licence to confirm at implementation. |
| **D-DS4** | **One danger red `#E94A5D`**, plus **`#B91C1C` for red text** |
| **D-DS5** | **Disabled buttons = the normal button at 40% opacity** |
| **D-DS6** | **Find Leads and Map View become outline action chips** (web too: see §11.2) |
| **D-DS7** | **Web and mobile use the standard date formats in §7.5 rule 7** |
| **D-DS8** | **Web uses the same token names with its own, smaller sizes** (§7.2) |

- The §7 token set is **APPROVED** with these decisions.
- **No Figma exists** (USER SAID).
- **Playwright install approved** (USER SAID), used to capture web screenshots (gap B5) on staging.

---

## 11. Web visual audit (added 2026-09-15, from staging captures)

**Method:**
- `tools/capture-web.js` (Playwright Chromium 1.63) against **staging**, read-only.
- Non-GET requests were blocked except login; destructive-looking URLs were blocked (static assets exempt).
- Roles: public, Sales Agent, Business Sales Agent, Business Agent (Manager).
- **51 screenshots:** every page at 1440 px full-page, plus 768 and 390 px for the first two pages per role. A font probe recorded computed fonts and the web fonts actually loaded.
- Manifest: `shoebox/03-web/screenshots/CAPTURED-BY-CLAUDE.md`.

**Limits:**
- **Admin** was not captured (no login yet).
- **Address Book company grid** is captured in its loading state: the grid waits on `company/buyContactsProgress`, which the guard blocks by design.
- 768 px captures were not reviewed in detail.
- Data shown is staging test data.

### 11.1 Web runs three visual languages

| Surface | Evidence (`shoebox/03-web/screenshots/…`) | Look |
|---|---|---|
| Auth: login, register, password reset, B2B signup | `public/web_auth_01_login_w1440.png`, `web_auth_02_register_w1440.png`, `web_auth_01_login_w390.png` | **Modern:** split card with blue gradient panel, 12 px inputs, gradient primary button with glow, light grey labels; register is a 3-step checkbox-card flow with testimonial; Inter also loaded. Works at 390 px |
| User app (Blade), Sales Agent + Business Sales Agent | `sales-agent/web_01_dashboard_w1440.png`, `03_company`, `04_contact`, `06_findleads`, `09_routes`, `10_lists`, `11_salesperson-edit` | **Legacy AdminLTE / Bootstrap 3:** icon sidebar; top bar with QR, credits button, store badges, "Report Bug"; tiles with heavy drop shadow + teal hairline border; square Bootstrap buttons; **two table libraries** (jqxGrid on companies/contacts/lists/find-leads, DataTables on routes) |
| Manager portal (React), Business Agent | `business-agent/web_01_manager-dashboard_w1440.png` … `08_manager-settings` | Branded **"TerriTool Cockpit: Sales Intelligence Hub"**; gradient sidebar card; KPI cards with **pastel purple/orange/pink/teal** icon tiles and trend pills; 12–14 px radii; soft shadows; DIN headings with **DM Sans** buttons and Space Grotesk loaded |

### 11.2 Findings (severity as §6)

| Sev | Finding | Evidence |
|---|---|---|
| **S1** | **Manager portal has no navigation at 390 px**: sidebar hidden, no menu button; a fixed "Download the App" banner also covers content | `business-agent/web_01_manager-dashboard_w390.png` |
| **S2** | **Destructive actions in every row:** Routes rows carry 7 actions incl. red Delete; Lists rows 7 incl. Delete; Contacts rows Edit + Delete plus an always-visible filled red "Delete" | `sales-agent/web_09_routes_w1440.png`, `web_10_lists_w1440.png`, `web_04_contact_w1440.png` |
| **S2** | **Button styles:** square Bootstrap primary; **cyan "Find Leads" and teal "Find Contacts" fills** (same problem as mobile chips, D-DS6); four tinted-outline bulk actions (red/blue/teal); gradient "Search" with glow; off-brand bright blue "Next Step"; "Export CSV" rendered disabled in every row; red **"Cancel" for discarding form edits** placed near the subscription "Cancel" | `03_company`, `06_findleads`, `09_routes`, `10_lists`, `11_salesperson-edit` |
| **S2** | **Ambiguous date formats:** "15 September 2026 13:54", "09/14/2026" (MM/DD), **"21/08/2026" and "26/05/2026" (DD/MM)**, "09/15/2026, 4:06 PM", "2 weeks ago" | `09_routes`, `10_lists`, `11_salesperson-edit`, `business-agent/web_08_manager-settings`, `01_dashboard`, `web_05_manager-activity` |
| **S2** | **Glossary violations on web:** "Manager" label + "TerriTool Cockpit" name (portal); "Salespeople / Add Salesperson" for Business Sales Agents; **"No upcoming notes."** (Activity); "Life Cycle Stage" (Contact stage); "All companies / contacts in the database"; sidebar "AI Find Leads" (Sales Agent) vs "Find Leads" (Business Sales Agent); plan names "Pro Package", "Deluxe Business" vs mobile chip "Business Client" | `business-agent/*`, `business-sales-agent/web_01_dashboard_w1440.png`, `sales-agent/web_04_contact_w1440.png`, `web_03_company_w1440.png` |
| S3 | Capitalisation: "Add Company" vs "Add contact" | `03_company`, `04_contact` |
| S3 | Two web tab styles (underline: dashboard Activity, Routes Published/Draft, Find Leads Search Multiple/One/Yelp; pill: portal period + feed filters), against three on mobile | multiple |
| S3 | Credits shown three ways on the user app: "8393 Credits" button, "Current Balance: 8393" badge, "Lead Credits: 8393" badge | `01_dashboard`, `06_findleads`, `11_salesperson-edit` |
| S3 | "Coming soon" Reports page reachable by URL (not in nav) | `business-agent/web_06_manager-reports_w1440.png` |
| S3 | Settings mixes profile, password, subscription, CRM connections, MCP buttons, status colours and categories in one long form | `11_salesperson-edit` |
| S3 | Low-contrast light grey helper text (login subtitle, portal "vs 0 last week", "2 weeks ago"): visual only, not pixel-measured | `public/web_auth_01_login_w1440.png`, `business-agent/web_01_manager-dashboard_w1440.png` |
| note | **Status tag colours are user-chosen hex values** (`#b1ff34`, `#1cdbdb`, `#ffbb33`, `#0000ff`, `#ff4444`, `#ffffff`, `#ffd700`), which confirms the mobile stripe colour is data. New UI should render tag colours with a neutral border so white/yellow tags stay visible | `11_salesperson-edit` |

### 11.3 Mobile ↔ web visual parity (now observed)

- **Shared:** brand blue `#124AC6`; DIN family (mobile DIN Condensed, web DIN 2014); the dashboard-of-tiles concept; identical AI Find Leads heading copy ("Set your selling territory — we'll do the rest."); unread rows tinted light blue on both.
- **Different:**
  - Button shape (mobile radius 12 vs Blade square vs portal 8–10).
  - Neutrals and shadows.
  - Tile sets. Web: Find Leads, Routes, Recently Added, Address Book, Lists, Upload CSV, Tutorial. Mobile: AI Find Leads, Scan Card, Add Company, Routes, Lists, Address Book.
  - Tables on web vs cards on mobile (intentional for desktop).
- **Role behaviour consistent with approved BT-2:** the Business Sales Agent web dashboard hides the credits button (the rep follows the manager's plan).

### 11.4 Effect on the approved token set

No decision changes. Implementation notes:
1. D-DS3: `tt-tokens.css` declares its own DIN `@font-face`.
2. D-DS6 applies to web cyan/teal filled action buttons.
3. D-DS7 month-name formats remove the DD/MM vs MM/DD ambiguity.
4. **New layout rule for new portal code:** below 768 px the portal must provide a menu button / navigation drawer.

### 11.5 §9 update

- **Web screenshots: done** (51), except **Admin** pages (need an Admin login) and the Address Book grid data state.
- Still open: Android captures; deferred Register/paywall packs.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (49)

**Documents (25):** [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/assets/brand/guidelines/Colors|Colors]] · [[brain/assets/brand/design-system-notes/Component-States|Component states]] · [[workspace/design-proposals/2026-09-15-manager-salespeople-audit/audit|Design audit – manager Salespeople page]] · [[brain/assets/docs/design-audits/2026-09-15-manager-salespeople-audit/audit|Design audit (Mode A): Manager portal · Salespeople]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/memory/entries/bug/20260917-fd9a47-kg-ui4-contrast-failures-on-sky-gold-chips|KG-UI4 — contrast failures on sky/gold chips]] · [[shoebox/09-known-issues/fragile|Known issues draft]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/context/conventions-mobile|Mobile app coding rules]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/audits/08-design-brain-review|Review of the old Design-Brain]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/context/stack|Tech setup & environments]] · [[brain/assets/brand/design-system-notes/Token-Inconsistencies|Token inconsistencies (do not normalize)]] · [[_code/brain/tools/capture-web.js|Tool – take web screenshots]] · [[brain/assets/brand/guidelines/Typography|Typography]] · [[brain/memory/entries/product/20260917-0aa87d-ui-ux-09-web-registration-page-renders-inter-fro|UI-UX-09 — Web registration page renders Inter from Google Fonts, not DIN (D-DS3)]] · [[brain/assets/brand/design-system-notes/Usage-Rules|Usage rules for a new screen]] · [[brain/context/conventions-web|Web app coding rules]] · [[shoebox/03-web/screenshots/CAPTURED-BY-CLAUDE|Web screenshots — CAPTURED BY CLAUDE]]

**Coding rule (1):** [[_id/D3|Pressable for rows, AppButton for buttons]]

**Owner decisions (9):** [[_id/D-DS3|DIN font everywhere]] · [[_id/D-DS5|Disabled = 40% faded]] · [[_id/D-DS6|Find Leads & Map View as outline chips]] · [[_id/D-DS2|Grey colour family]] · [[_id/D-DS4|One danger red]] · [[_id/D-DS1|Only add new design tokens]] · [[_id/BT-2|Sales reps follow their manager's plan]] · [[_id/D-DS7|Standard date formats]] · [[_id/D-DS8|Web uses the same tokens, smaller sizes]]

**Problem found (1):** [[_id/KG-UI4|Hard-to-read coloured chips]]

**Code files (13):** [[_code/mobile/App/components/dashboard/ActivityRowBody.js|ActivityRowBody.js]] · [[_code/mobile/App/components/findLeads/aiFindLeads.js|aiFindLeads.js]] · [[_code/mobile/App/components/common/AppButton.js|AppButton.js]] · [[_code/mobile/App/components/common/AppConfirmModal.js|AppConfirmModal.js]] · [[_code/mobile/App/components/dashboard/dashboard.styles.js|dashboard.styles.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/components/filterModule/index.js|filterModule/index.js]] · [[_code/mobile/App/components/findLeads/index.js|findLeads/index.js]] · [[_code/mobile/App/components/list/listIndex.styles.js|listIndex.styles.js]] · [[_code/mobile/App/components/dashboard/QrCodeScannerScreen.js|QrCodeScannerScreen.js]] · [[_code/mobile/App/components/dashboard/ReferralInviteModal.styles.js|ReferralInviteModal.styles.js]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
