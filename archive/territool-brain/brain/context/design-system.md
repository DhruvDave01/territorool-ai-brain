---
area: context
tags: [brain/context]
ref: "Design system (colours, fonts, spacing)"
---

# Territool — Design System (approved 2026-09-15)

Source: `brain/audits/04-design.md` §7 (token set), §10 (decisions D-DS1–D-DS8, USER SAID), §11 (web findings).

**All design assets live in the brain's own library, `brain/assets/`** (fonts, icon fonts, logos, app icons, images, themes, style files, screenshots). Rules: `brain/context/design-assets.md`. Ready-to-use tokens: `brain/assets/tokens/` (`tt-tokens.css`, `tokens.js`, `fonts.css`).

Evidence screenshots:
- mobile `brain/assets/screenshots/mobile/Archive-2/IMG_*.PNG`
- web `brain/assets/screenshots/web/**`

The `IMG_*` and `web_*` names in §6 refer to those folders.

**No Figma exists** (USER SAID).

## 0. How tokens are implemented (D-DS1: additive)

| Platform | File (created by the first design/code task that needs it) | Status |
|---|---|---|
| Mobile | `repos/mobile/App/styles/tokens.js` exporting `tokens` (values below; spacing via `scaledSize`) | **not created yet** |
| Web user app + portal | `repos/web/public/css/tt-tokens.css` defining `--tt-*` custom properties + its own DIN `@font-face` (`/fonts/DinBold.ttf`, `/fonts/DinLight.ttf`) | **not created yet** |
| Legacy | `App/styles/theme.js`, `public/css/custom.css`, portal CSS vars | **frozen**: don't change values; old screens keep them |

New code uses `tokens` / `--tt-*`. Where a needed token doesn't exist yet, add it to the tokens file (never inline a literal).

**Brain copies, ready to use:**
- `brain/assets/tokens/tt-tokens.css` (web)
- `brain/assets/tokens/tokens.js` (mobile)
- `brain/assets/tokens/fonts.css` (DIN @font-face from `brain/assets/fonts/`)

They mirror this file exactly. Mockups and artifact pages link them directly. The first repo task that needs tokens copies them into the paths in the table above.

## 1. Colour

| Token | Value | Mobile key | Web variable | Use / constraint |
|---|---|---|---|---|
| `color.brand.primary` | `#124AC6` | `tokens.color.brand.primary` | `--tt-color-primary` | CTAs, links, selected; white text 7.45:1 |
| `color.brand.primary-pressed` | `#0E3DA6` | `…primaryPressed` | `--tt-color-primary-pressed` | pressed/hover |
| `color.brand.primary-subtle` | `#F0F4FF` | `…primarySubtle` | `--tt-color-primary-subtle` | unread/hover tint |
| `color.brand.primary-muted` | `#E0E7FF` | `…primaryMuted` | `--tt-color-primary-muted` | selected chip/segment background |
| `color.brand.on-primary-selected` | `#4A90E4` | `…onPrimarySelected` | `--tt-color-on-primary-selected` | selected segment on blue header; **labels ≥ 17 pt/px bold only** (3.28:1) |
| `color.accent.teal` | `#00A99D` | `…accentTeal` | `--tt-color-accent-teal` | fills/icons only; **never white text** (2.93:1) |
| `color.accent.teal-strong` | `#0F766E` | `…accentTealStrong` | `--tt-color-accent-teal-strong` | teal text on white (5.47:1) |
| `color.danger` | `#E94A5D` | `…danger` | `--tt-color-danger` | destructive confirm fills; **labels ≥ 17 pt/px bold** (3.75:1) |
| `color.danger-text` | `#B91C1C` | `…dangerText` | `--tt-color-danger-text` | red text on white (6.47:1) |
| `color.danger-subtle` | `#FEE2E2` | `…dangerSubtle` | `--tt-color-danger-subtle` | error backgrounds |
| `color.success` | `#15803D` | `…success` | `--tt-color-success` | success text/icons (5.02:1) |
| `color.success-subtle` | `#DCFCE7` | `…successSubtle` | `--tt-color-success-subtle` | success backgrounds |
| `color.warning` | `#F59E0B` | `…warning` | `--tt-color-warning` | **dark text only** (`#111827` on it 8.26:1) |
| `color.warning-subtle` | `#FEF3C7` | `…warningSubtle` | `--tt-color-warning-subtle` | warning backgrounds |
| `color.text.primary` | `#111827` | `…textPrimary` | `--tt-color-text` | body/titles |
| `color.text.secondary` | `#6B7280` | `…textSecondary` | `--tt-color-text-secondary` | secondary text (4.83:1 white, 4.52:1 on page) |
| `color.text.strong-muted` | `#374151` | `…textStrongMuted` | `--tt-color-text-muted` | tertiary button label |
| `color.text.disabled` | `#9CA3AF` | `…textDisabled` | `--tt-color-text-disabled` | not for essential text |
| `color.text.on-primary` | `#FFFFFF` | `…textOnPrimary` | `--tt-color-text-on-primary` | — |
| `color.surface.page` | `#F6F7FB` | `…surfacePage` | `--tt-color-bg` | page / mobile body sheet |
| `color.surface.card` | `#FFFFFF` | `…surfaceCard` | `--tt-color-card` | cards, modals |
| `color.surface.muted` | `#F3F4F6` | `…surfaceMuted` | `--tt-color-surface-muted` | tertiary buttons, segment containers |
| `color.surface.input` | `#FAFBFC` | `…surfaceInput` | `--tt-color-input` | inputs |
| `color.border.default` | `#E5E7EB` | `…border` | `--tt-color-border` | cards, dividers |
| `color.border.input` | `#E2E4E9` | `…borderInput` | `--tt-color-border-input` | inputs |
| `color.overlay.scrim` | `rgba(17,24,39,0.45)` | `…scrim` | `--tt-color-scrim` | all modal backdrops |
| `color.gradient.header` | `#124AC6 → #2963DB`; exact 7 stops in the app: `#124AC6 #164FCA #1B54CF #2059D3 #255ED7 #2963DB #124AC6` (`theme.js:12-20`) | `…headerGradient` (array) | `--tt-gradient-header` | mobile header |

Neutral family = **Tailwind gray** (D-DS2). **Status tag colours are user data** (e.g. `#b1ff34`, `#ffffff`, `#ffd700`): render them as provided, with a `color.border.default` outline so light tags stay visible (A4 §11.2).

## 2. Typography: DIN only, everywhere (D-DS3)

| Token | Family | Mobile pt (size/line) | Web px (size/line) (D-DS8) |
|---|---|---|---|
| `type.display` | DIN Condensed Bold | 24/30 | 24/30 |
| `type.title` | DIN Condensed Bold | 22/28 | 20/26 |
| `type.heading` | DIN Condensed Bold | 20/25 | 18/24 |
| `type.subheading` | DIN Condensed Bold | 17/21 | 15/20 |
| `type.body` | DIN Regular | 16/20 | 14/20 |
| `type.body-strong` | DIN Condensed Bold | 16/20 | 14/20 |
| `type.caption` | DIN Regular | 14/18 | 13/18 |
| `type.eyebrow` | DIN Condensed Bold, UPPERCASE, letter-spacing 0.5 | 12/15 | 11/14 |
| `type.button` | DIN Condensed Bold | 17/19 | 14/18 |
| `type.micro` | DIN Regular | 12/15 | 12/16 |

Font names:
- Mobile `fonts.dinCondensedBold` (iOS `DINCondensed-Bold`, Android `DIN-Condensed-Bold`) and `fonts.dinCondensedRegular` (iOS `DIN-Regular`) (`App/styles/fonts.js`).
- Web `"DIN 2014 Bold"` / `"DIN 2014 Light"`.
- **Never** system font, Inter, Lato, DM Sans or Space Grotesk in new screens.

## 3. Spacing (4-pt grid)

| Token | Value | Mobile | Web |
|---|---|---|---|
| `space.1` | 4 | `scaledSize(4)` | `--tt-space-1: 4px` |
| `space.2` | 8 | `scaledSize(8)` | `--tt-space-2: 8px` |
| `space.3` | 12 | `scaledSize(12)` | `--tt-space-3: 12px` |
| `space.4` | 16 | `scaledSize(16)` | `--tt-space-4: 16px` |
| `space.5` | 20 | `scaledSize(20)` | `--tt-space-5: 20px` |
| `space.6` | 24 | `scaledSize(24)` | `--tt-space-6: 24px` |
| `space.8` | 32 | `scaledSize(32)` | `--tt-space-8: 32px` |

Layout defaults: screen gutter `space.4`; card padding `space.4`; gap between cards `space.3`.

## 4. Radius, elevation, sizes

| Token | Value | Mobile | Web | Use |
|---|---|---|---|---|
| `radius.sm` | 8 | 8 | `--tt-radius-sm: 8px` | chips, small controls |
| `radius.md` | 12 | 12 | `--tt-radius-md: 12px` | buttons, inputs, cards |
| `radius.lg` | 16 | 16 | `--tt-radius-lg: 16px` | modals, sheets |
| `radius.sheet` | 25 | `SCREEN_BODY_TOP_RADIUS` | n/a | mobile body sheet only |
| `radius.pill` | 999 | 999 | `--tt-radius-pill: 999px` | pills, badges |
| `elevation.1` | y1 blur3 α.06 | iOS offset {0,1} radius 1.5 opacity .06; Android 1 | `--tt-shadow-1: 0 1px 3px rgba(0,0,0,.06)` | cards |
| `elevation.2` | y4 blur16 α.08 | iOS {0,4} r8 .08; Android 4 | `--tt-shadow-2: 0 4px 16px rgba(0,0,0,.08)` | sticky footers, popovers |
| `elevation.3` | y12 blur40 α.12 | iOS {0,12} r20 .12; Android 8 | `--tt-shadow-3: 0 12px 40px rgba(0,0,0,.12)` | modals |
| `size.touch-min` | mobile 44 / web 40 | `scaledSize(44)` | 40px | minimum hit target |
| `size.control-height` | mobile 48 / web 40 | 48 | `--tt-control-h: 40px` | inputs, buttons |

## 5. Component rules (new code)

1. **Buttons: 5 variants.**
   - `primary`: primary fill + white `type.button`.
   - `secondary`: white, 2 px primary border, primary label.
   - `tertiary`: `surface.muted` fill, `text.strong-muted` label.
   - `danger`: `danger` fill, white label; only to confirm destructive actions, never at equal weight beside a primary on a normal screen.
   - `text`: primary label, no container.
   - **Disabled = the variant at 40% opacity** (D-DS5).
2. **Segmented control: 2 variants.** On primary header (container white 16% + selected `on-primary-selected`); in body (container `surface.muted`, selected `surface.card` + primary label). No primary-filled segments.
3. **Chips:** filter chip (selected primary fill / unselected `surface.muted`) vs **action chip** (`surface.card` + `border.default` + icon + primary label). "Find Leads", "Map View", web "Find Leads"/"Find Contacts" actions are **action chips** (D-DS6).
4. **Mobile screen shell:** gradient header (`CustomHeader`) + `surface.page` sheet with `radius.sheet`. Full-screen exceptions only for camera and blocking task progress.
5. **Web portal:** below 768 px provide a menu button / drawer (A4 §11.4).
6. **Loading:** inline spinner + label in the content area. Blocking overlay only while a user-started mutation runs.
7. **Empty state:** optional icon + `type.subheading` title + `type.caption` `text.secondary` body + optional CTA.
8. **Destructive actions** are never repeated in every table row as filled/red buttons. Use an overflow menu or a confirm step (A4 §11.2).
9. **Dates:** D-DS7 (see `conventions-shared.md` S1.4); never "Invalid Date".
10. **Copy:** glossary terms; humanised enums; required fields marked (not only optional ones).
11. **Modals:** one close control style (plain X, top-right) + scrim token + `radius.lg` + `elevation.3`.
12. **Scroll hints** must never overlap content or controls.
13. **Filter trigger (D-DS9, owner decision 2026-09-17):**
    - Place it at the **trailing end of the search row**, as a square button with the `options` (sliders) icon and
      the "filter applied" dot. Reference: Address Book `AB-01`.
    - The search field is the primary control and leads; the filter modifies it and trails. The trailing edge is
      also the easier one-handed thumb reach.
    - List details (`LS-37`) puts it at the leading edge. That is a **design-system defect** (UI-UX-06), not a
      second convention.
    - New code builds the button on tokens. Address Book's hard-coded version stays until the shared component
      lands (UI-DX-02), so two implementations exist on purpose for a while.

## 6. Don't copy these existing patterns (evidence)

| Pattern | Evidence |
|---|---|
| System font on dashboard tiles/activity, referral modal, calendar rows | `IMG_4563`, `IMG_4602`, `IMG_4605`, `IMG_4608`; `dashboard.styles.js`, `ReferralInviteModal.styles.js` |
| Sky `#44AADA` / gold `#FFB800` chips with white text (2.62 / 1.73:1) | `IMG_4572`, `IMG_4592` |
| Two reds (`#CF5B51` AppButton danger vs `#E94A5D`) | `IMG_4564`, `IMG_4565`, `AppButton.js:17` |
| Grey `#B5B5B5` / light-primary / 80% primary disabled buttons | `IMG_4565`, `IMG_4580`, `IMG_4611` |
| "Waypoint", "Business Client", "notes", "Salesperson/Manager" in UI copy | `IMG_4572`, `IMG_4589`, `IMG_4564`; web `business-sales-agent/web_01_dashboard_w1440.png`, `business-agent/*` |
| Raw enum "Industry: hair_care"; "Invalid Date PT" | `IMG_4595`, `IMG_4563`; `route/create.js:1015` |
| Red Delete in every table row; 7 actions per row | web `sales-agent/web_09_routes_w1440.png`, `web_10_lists_w1440.png` |
| DD/MM vs MM/DD dates | web `web_11_salesperson-edit_w1440.png`, `web_10_lists_w1440.png` |
| Manager portal without navigation at 390 px | web `business-agent/web_01_manager-dashboard_w390.png` |
| Order-based testIDs, scroll hint over content | `IMG_4572`, `IMG_4589`, `IMG_4595` |

## 7. Mobile implementation specifics (verified in code 2026-09-15)

Source: the mobile Design-Brain, re-verified line by line in `brain/audits/08-design-brain-review.md` §2. Where a legacy value differs from an approved token, **new code uses the token** (right-hand column).

| Area | How the app does it today (verified) | New code |
|---|---|---|
| Header | `CustomHeader`: toolbar 56 (72 with subtitle), 7-stop brand gradient, white DIN Bold title, back chevron, optional credits pill (`customheader.styles.js:6, 8`) | reuse `CustomHeader`; never a second gradient |
| Body sheet | `screenCurvedBodyStyles`, top radius 25 unscaled (`screenCurvedBody.js:7`) on the page surface | `radius.sheet` + `color.surface.page` |
| Bottom navigation | `CustomFooter`: 6 icon tabs (Dashboard, AI Find Leads *push*, Address Book, Routes, Lists `Supply3.png`, Settings *push*); active tint primary, inactive gray; offline and already-on-tab toasts. **Only on module screens; Dashboard has none** | reuse; no tab/drawer navigator |
| Buttons | `AppButton` variants primary / danger `#CF5B51` / neutral / dark / ghost, minHeight 50, radius 12 (`AppButton.js:11-31, 62`) | map to the 5 approved variants (§5.1); danger fill = `color.danger` (D-DS4); disabled 40% (D-DS5) |
| Confirms | `AppConfirmModal` (radius 16, backdrop 0.45); never native `Alert` | same component, `color.overlay.scrim`, `radius.lg` |
| Async feedback | `react-native-toast-message`, top position (`API.js:153`) | same |
| Filters | `FilterModule` inline modal, control height 48 iOS / 42 Android (`filterModule.styles.js:39`) | reuse; `size.control-height` for new controls |
| Address Book add menu | `HeaderAddMenu`: "Add Company" / "Find Leads" (Address Book only) | reuse |
| Company workspace CTAs | the company workspace action bar switches on `parent_screen` (`customcompany/index.js:4816-4827`): `ViewCompany` shows Add To, `CompanyView`/`ClusterCompany` show Mark/Unmark and Mark Visited | keep the context rule (BT-4: visited is per company, reached from route/list context) |
| Forms | label above with icon, radius 12, minHeight 48 (`login/index.js:476, 525`) | `color.surface.input`, `color.border.input`, `radius.md`, `size.control-height` |

**Copy voice (from captures, `brain/assets/brand/guidelines/Brand-Usage-Rules.md`):**
- **Headers are nouns:** "AI Find Leads", "Routes Library", "Address Book".
- **CTAs are verbs:** "Next step", "Create Route", "Find Contacts", "Mark Visited".
- **Empty states are one short sentence:** "No upcoming activities yet."
- **Loaders say what's happening:** "Loading lists…", "Generating your sales route".
- **Glossary still applies:** "Waypoint" in "Search Company (Waypoint)" is retired.

**Finding evidence for a mobile screen:** `brain/assets/brand/coverage-notes/Screenshot-Video-Index.md` maps every `IMG_*` still and video segment to screen, code and flow.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (87)

**Documents (47):** [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/context/brain-qa|Brain QA: questions the brain must answer correctly, and how it did]] · [[brain/README|brain/ - GENERATED OUTPUT. Do not hand-edit during build.]] · [[brain/assets/brand/guidelines/Brand-Usage-Rules|Brand usage rules (observed)]] · [[brain/gates/design-gate|Checklist – design]] · [[CLAUDE-CODE-BOOTSTRAP|Claude Code Bootstrap Prompt]] · [[brain/assets/colors/PALETTE|Colour inventory (generated: do not edit)]] · [[workspace/handoff/2026-09-17-company-details/result|Company details mobile UI]] · [[workspace/design-proposals/2026-09-15-manager-salespeople-audit/audit|Design audit – manager Salespeople page]] · [[brain/assets/docs/design-audits/2026-09-15-manager-salespeople-audit/audit|Design audit (Mode A): Manager portal · Salespeople]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/assets/README|Design library guide]] · [[brain/context/design-states|Design states: loading, empty, error and their variants per surface]] · [[brain/memory/entries/decision/20260917-0a51a8-filter-trigger-trails-the-search-row-d-ds9-list-|Filter trigger trails the search row (D-DS9); List details is a defect to fix]] · [[brain/context/conventions-mobile|Mobile app coding rules]] · [[brain/memory/entries/decision/20260917-54748f-lists-library-filter-placement|Placement: a filter on the Lists library (mobile LS-20)]] · [[workspace/qa-reports/2026-09-16-brain-improvement-loop|QA report: autonomous brain improvement loop (iteration 1)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/audits/08-design-brain-review|Review of the old Design-Brain]] · [[brain/context/conventions-shared|Rules for all code]] · [[brain/assets/brand/coverage-notes/Screenshot-Video-Index|Screenshot and video index]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-router/SKILL|Skill – task router (start of every task)]] · [[brain/skills/territool-code/SKILL|Skill – writing code]] · [[brain/memory/SOURCE-OF-TRUTH|Source of truth — which source wins, per question]] · [[brain/skills/territool-loop/SKILL|TERRITOOL LOOP — superseded, moved to LOOP.md]] · [[workspace/test-cases/F01-login-visual|Test cases — F01 Login page (visual, design-gate §B) (P0)]] · [[workspace/test-cases/F02-register-visual|Test cases — F02 Registration page (visual, design-gate §B) (P0)]] · [[workspace/test-cases/F03-subscription-visual|Test cases — F03 Subscription page (visual, design-gate §B) (P0)]] · [[workspace/test-cases/F05-dashboard-visual|Test cases — F05 Dashboard (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F06-findleads-visual|Test cases — F06 AI Find Leads page (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F08-routes-visual|Test cases — F08 Routes library (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F11-lists-visual|Test cases — F11 Lists library (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F12-companies-visual|Test cases — F12 Address Book (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F13-contacts-visual|Test cases — F13 Contacts (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F20-settings-visual|Test cases — F20 Settings (visual, design-gate §B) (P2)]] · [[workspace/test-cases/F23-manager-dashboard-visual|Test cases — F23 Manager portal dashboard (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F24-manager-salespeople-visual|Test cases — F24 Manager portal Salespeople (visual, design-gate §B) (P1)]] · [[workspace/test-cases/F25-hq-login-visual|Test cases — F25 Admin HQ login page (visual, design-gate §B) (P2)]] · [[workspace/test-cases/F26-support-visual|Test cases — F26 Support tickets (visual, design-gate §B) (P3)]] · [[workspace/test-cases/F27-notification-page-visual|Test cases — F27 Push notification page (visual, design-gate §B) (P3)]] · [[brain/skills/territool-router/LOOP|The fix-until-done loop]] · [[brain/context/web-surfaces|The three web surfaces, and how each one is built]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]] · [[workspace/handoff/2026-09-17-company-details-web/result|Web Company Details UI — handoff]]

**Product features (15):** [[_id/F25|Admin HQ]] · [[_id/F06|AI Find Leads → save leads]] · [[_id/F24|Business Sales Agent management]] · [[_id/F12|Companies (Address Book)]] · [[_id/F13|Contacts]] · [[_id/F08|Create route]] · [[_id/F05|Dashboard, activity feed, calendar]] · [[_id/F11|Lists]] · [[_id/F01|Login & session]] · [[_id/F23|Manager portal]] · [[_id/F27|Notifications & push]] · [[_id/F02|Registration & onboarding]] · [[_id/F20|Settings / status tags / stages]] · [[_id/F03|Subscription / paywall / upgrade / cancel / credits…]] · [[_id/F26|Support tickets]]

**Coding rule (1):** [[_id/S1.4|Standard date formats]]

**Owner decisions (9):** [[_id/BT-4|“Visited” is per company]] · [[_id/D-DS3|DIN font everywhere]] · [[_id/D-DS5|Disabled = 40% faded]] · [[_id/D-DS6|Find Leads & Map View as outline chips]] · [[_id/D-DS2|Grey colour family]] · [[_id/D-DS4|One danger red]] · [[_id/D-DS1|Only add new design tokens]] · [[_id/D-DS7|Standard date formats]] · [[_id/D-DS8|Web uses the same tokens, smaller sizes]]

**Screenshots (3):** [[_capture/AB-01|Address book – companies]] · [[_capture/LS-37|List details]] · [[_capture/LS-20|Lists library]]

**Code files (12):** [[_code/mobile/App/utils/API.js|API.js]] · [[_code/mobile/App/components/common/AppButton.js|AppButton.js]] · [[_code/mobile/App/components/route/create.js|create.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/mobile/App/components/customheader/customheader.styles.js|customheader.styles.js]] · [[_code/mobile/App/components/dashboard/dashboard.styles.js|dashboard.styles.js]] · [[_code/mobile/App/components/filterModule/filterModule.styles.js|filterModule.styles.js]] · [[_code/mobile/App/styles/fonts.js|fonts.js]] · [[_code/mobile/App/components/login/index.js|login/index.js]] · [[_code/mobile/App/components/dashboard/ReferralInviteModal.styles.js|ReferralInviteModal.styles.js]] · [[_code/mobile/App/styles/screenCurvedBody.js|screenCurvedBody.js]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
