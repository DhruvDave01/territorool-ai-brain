---
area: audits
tags: [brain/audits]
ref: "Review of the old Design-Brain"
---

# 08: Review of the mobile Design-Brain (2026-09-15)

**Request (USER SAID):** "we have created the one mini Design Brain at … TerriTool_Mobile/Design-Brain. Can you check if that also helps? If yes, copy the required files and add them to the Brain folder as needed."

**What was reviewed:** `TerriTool_Mobile/Design-Brain/`, gitignored in the mobile repo, last changed 2026-09-11, 176 files:
- 57 Markdown docs, including `MINI-DESIGN-BRAIN.md` and `MASTER-DESIGN-BRAIN.md`
- 111 screenshots and video frames
- 3 videos
- 4 font files
- logos and icons

Every document was read. Every claim the brain now relies on was re-checked in the mobile code (`TT_80@e9fd05e`) or in the captures.

**Copy status:** 174 of 176 files were already in the design library (`brain/assets/`, matched by sha1). The 2 missing notes (`03-Assets/Asset-Inventory.md`, `03-Assets/README.md`) are now copied to `brain/assets/brand/asset-notes/`.

**Where it lives in the brain:**

| Design-Brain part | Library path |
|---|---|
| Root docs (`MINI-DESIGN-BRAIN.md`, `MASTER-DESIGN-BRAIN.md`) | `brain/assets/brand/design-brain-root/` |
| 01 Brand Guidelines | `brain/assets/brand/guidelines/` |
| 02 User Interface | `brain/assets/brand/ui-notes/` |
| 03 Assets notes | `brain/assets/brand/asset-notes/` |
| 04 User Flows | `brain/assets/brand/flow-notes/` |
| 05 Design System | `brain/assets/brand/design-system-notes/` |
| 06 Coverage | `brain/assets/brand/coverage-notes/` |
| Screenshots + video frames | `brain/assets/screenshots/mobile/` |
| Videos | `brain/assets/videos/mobile/` |
| Icons, logos, fonts | `brain/assets/icons/mobile-png/`, `brand/logos/mobile/`, `fonts/mobile/` |

## 1. Does it help? Verdict per part

| Part | Verdict | Why | Used by |
|---|---|---|---|
| `06-Coverage/Screenshot-Video-Index.md` | **High value** | Maps every `IMG_4563–4611` still and each video segment to screen, route, source file and flow. The brain had screenshots but no index | design Mode A evidence, test evidence, `flows.md` |
| `04-User-Flows/*` (18) | **High value** | Step-level mobile flows (`Start → action → screen → result`) with capture references and loading/error branches: the flow descriptions the owner wanted test cases built from | `territool-test` sources, `flows.md` |
| `02-User-Interface/Screen-Inventory.md`, `States.md`, `Forms.md`, `Modals-and-Popups.md`, `Maps.md`, `Platform-Differences.md` | **High value** | Per-screen chrome, captured states, validation copy ("Please provide position."), field layouts, map pin semantics, iOS/Android differences | design specs (DG-A3 states), test cases |
| `02-User-Interface/Components.md`, `Navigation.md`, `05-Design-System/Components.md` | **Useful, verified** | Component APIs, footer map, reuse order. Key facts re-verified (§2) | `design-system.md` §7, `conventions-mobile.md` §4 |
| `01-Brand-Guidelines/Icons.md`, `Logos.md`, `03-Assets/Asset-Inventory.md` | **Useful** | Config export → PNG mapping (footer/tile icons, `Supply3.png` for Lists), potentially-unused files. Logo question now resolved (§3) | `design-assets.md` |
| `01-Brand-Guidelines/Brand-Usage-Rules.md` (voice/copy part) | **Useful** | Header, CTA, empty-state and loader copy taken from captures | `design-system.md` §7 |
| `01-Brand-Guidelines/Colors.md`, `Typography.md`, `Spacing.md`, `Shapes-and-Radius.md`, `Shadows-and-Elevation.md`, `05-Design-System/Design-Tokens.md` | **Legacy reference only** | Accurate description of `theme.js` (legacy values), useful for auditing old screens. **Not** a source for new values: approved tokens win (D-DS1–D-DS8) | audits only |
| `05-Design-System/Token-Inconsistencies.md` | **Useful inventory; resolutions superseded** | The list matches what the brain found. Its "do not normalize" answer was replaced by owner decisions on 2026-09-15 (§4) | `04-design.md` cross-check |
| `05-Design-System/Usage-Rules.md`, `MINI-DESIGN-BRAIN.md` §3, §9–§10 | **Partly superseded** | Shell recipe is right. "Copy mixed reds/teal/gold chips, don't fix" conflicts with approved rules for new code (§4) | read with §4 overrides |
| `06-Coverage/Needs-Manual-Verification.md`, `Deferred-Scope.md`, `Functionality-Coverage-Matrix.md` | **Useful** | Open questions and visual gaps; 3 items now resolved (§3); deferral of Register/payment matches the owner's current waiver | `known-fragile.md`, open items |
| Screenshots / video frames / videos / icons / logos / fonts | **Already in library** | — | `brain/assets/` |

## 2. Claims verified in code (safe to use)

| Claim | Evidence |
|---|---|
| Header gradient has 7 stops: `#124ac6 #164fca #1b54cf #2059d3 #255ed7 #2963db #124ac6` | `App/styles/theme.js:12-20` (`brandLinearGradient`) |
| `CustomHeader` toolbar 56, 72 with subtitle | `customheader/customheader.styles.js:6, 8` |
| Curved body top radius 25 (unscaled) | `styles/screenCurvedBody.js:7` |
| `AppButton` variants: primary (pressed `#0d4bb8`), danger `#CF5B51`, neutral `#374151`, dark `#1a1a1a`, ghost; minHeight 50 | `common/AppButton.js:11-31, 62` |
| `AppConfirmModal` backdrop opacity 0.45 | `common/AppConfirmModal.js:52` |
| Toasts at the top | `utils/API.js:153, 179, 294`; mounted `App.js:400` |
| `FilterModule` control height 42 Android / 48 iOS | `filterModule/filterModule.styles.js:39` |
| Footer Lists tab icon is `Supply3.png`; active tint primary, inactive gray | `config/index.js:173`; `customfooter/customfooter.styles.js:46, 52` |
| Address Book add menu: "Add Company" / "Find Leads" | `company/list.js:1661, 1666` |
| Company workspace CTAs depend on context: `ViewCompany` → **Add To**; `CompanyView` / `ClusterCompany` → **Mark/Unmark** (+ Mark Visited) | `customcompany/index.js:4816-4835` |
| `HIDE_SUBSCRIPTION_ACTIONS_ON_ANDROID = false` | `dashboard/editstatus.js:98` |
| Theme spacing 4/6/8/12/16/20/24 and radius 4/8/10/12/16/20/24 (legacy) | `styles/theme.js` `spacing`, `radius` |

## 3. Open questions resolved by this review

| Question (Design-Brain NMV) | Answer | Evidence |
|---|---|---|
| Login logo: "3D TT cube" in captures vs "`TerriTool_logo_NEW.jpg` wordmark" | **Same asset.** `TerriTool_logo_NEW.jpg` *is* the TT cube mark (square image in a 300×110 contain box). Web `tt_smal_logo.png` is the same cube; web `logo_blue.png` is cube + "TERRITOOL" wordmark | `brain/assets/brand/logos/mobile/TerriTool_logo_NEW.jpg`; `screenshots/mobile/Archive-2/IMG_4604.PNG`; `brand/logos/web/*` |
| `ClusterList`: crash risk? | **Confirmed broken.** Navigated from 2 places, not registered in `App/App.js` (49 screens, none named `ClusterList`) | `utils/navigateToRouteDetail.js:37`, `route/index.js:964` → **KG-NAV1** |
| `COLOR_PRIMARY` import in bizContacts styles | **Confirmed.** Imported and used 4×, but `App/config/index.js` no longer exports it. The import resolves to `undefined`, so those background, border and text colours are unset on the bizContacts screens (F15). The on-device effect is not observed | `route/bizContact/bizContactScreens.styles.js:2, 51, 108, 114, 220` → **KG-UI6** |

## 4. Wrong, outdated or superseded: the brain's rule wins

| Design-Brain says | Brain position | Source |
|---|---|---|
| "Confirm Leads" CTA is near-black `#1a1a1a` | **Wrong:** pixel `#124AC6` primary. It only looks dark under the modal scrim in `IMG_4568`/`4569` | `04-design.md` M-1 |
| Find Leads chip is teal | **Wrong:** `#44AADA` (sky); Map View `#FFB800` | `04-design.md` M-2 |
| 47 stack screens | **Outdated:** 49 (adds `BulkContactPeople`, `BulkContactReview` from the bulk-contact flow) | `App/App.js` |
| Keep two danger reds; don't normalize | New code: one danger `#E94A5D` + text `#B91C1C` | D-DS4 |
| Disabled = gray CTA | New code: the variant at 40% opacity | D-DS5 |
| Keep teal/gold chips | New code: Find Leads / Map View become outline action chips | D-DS6 |
| Match the local screen's raw values; tokens only where the screen already uses them | New code uses approved tokens (legacy values only when the task explicitly extends an old screen without new UI) | D-DS1, S4.1, M8 |
| Legacy spacing/radius/shadow scales (`xs` 6, radius `sm` 10, shadows sm/md/lg) | Approved scales: space 4/8/12/16/20/24/32, radius 8/12/16/25/999, elevation 1–3 | `design-system.md` §3–§4 |
| "Business Client" (account/package label) | Retired term → Business Agent / plan names | glossary, BT-8 |
| No position on offline | Offline dropped | S3.9 |

## 5. What changed in the brain

| File | Change |
|---|---|
| `brain/assets/brand/asset-notes/` | 2 missing Design-Brain notes copied (sync script updated so future syncs include them) |
| `brain/context/design-system.md` | Exact 7-stop header gradient; new §7 mobile implementation specifics (verified) + copy voice + context-specific company CTAs |
| `brain/assets/tokens/tokens.js`, `tt-tokens.css` | Header gradient stops made exact |
| `brain/context/flows.md` | Flow → Design-Brain flow note → screenshots → video map |
| `brain/context/known-fragile.md` | KG-NAV1 (`ClusterList`), KG-UI6 (`COLOR_PRIMARY`) |
| `brain/context/conventions-mobile.md` | Reuse rows (Toast, FilterModule, CustomCompany context); traps (`COLOR_PRIMARY`, Design-Brain accuracy) |
| `brain/context/design-assets.md` | Logo resolved; Design-Brain reference paths with the override note |
| `brain/skills/territool-design/SKILL.md`, `territool-test/SKILL.md` | Load this review + MINI brain + screenshot index; flow notes and captures as test-case sources |
| `tools/sync-design-assets.js` | Copies `03-Assets` notes; "approved token" flag now reads only `design-system.md` §1–§4 (it wrongly counted the do-not-copy list) |

## 6. Remaining gaps Design-Brain does not cover

- **Android:** there are no Android captures.
- **Web and manager portal:** Design-Brain is mobile-only. The web side is covered by the brain's own captures and audits.
- **Deferred:** Register, paywall and purchase flows; splash timing; lasso drawing; coaching; HubSpot `Error` screen.
- **Unverified screens:** `BulkContactPeople` and `BulkContactReview` have no screenshots yet. **Update 2026-09-15:** now captured by the owner (RT-34–44), along with Register/paywall (LR-04–14), lasso drawing, the crash fallback and Waypoint Details. See `brain/context/mobile-flows-captured.md`.
- **Still-open NMV items:** "Rate the app" gating, Dynamic Links after install, Scan Card post-save screen, calendar row destination, Filter "By Status" section, permission-denied UI.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (89)

**Documents (39):** [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/assets/brand/guidelines/Brand-Usage-Rules|Brand usage rules (observed)]] · [[brain/assets/brand/guidelines/Colors|Colors]] · [[brain/assets/brand/coverage-notes/Deferred-Scope|Deferred scope (2026-09-11)]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/assets/brand/design-system-notes/Design-Tokens|Design tokens]] · [[brain/assets/brand/design-system-notes/Components|Design-system components]] · [[brain/assets/brand/ui-notes/Forms|Forms]] · [[brain/assets/brand/coverage-notes/Functionality-Coverage-Matrix|Functionality coverage matrix]] · [[brain/assets/brand/guidelines/Icons|Icons]] · [[brain/memory/entries/bug/20260917-274b4d-kg-nav1-clusterlist-is-navigated-to-cluster-rout|KG-NAV1 — ClusterList is navigated to (cluster route types) but not registered in App/App.js: crash on open]] · [[brain/memory/entries/bug/20260917-8adaf8-kg-ui6-bizcontacts-styles-import-colorprimary-wh|KG-UI6 — bizContacts styles import COLOR_PRIMARY, which config/index.js no longer exports, so 4 style values are undef…]] · [[brain/context/known-fragile|Known problems & risky areas]] · [[brain/assets/brand/guidelines/Logos|Logos & branding]] · [[brain/assets/brand/ui-notes/Maps|Maps]] · [[brain/context/conventions-mobile|Mobile app coding rules]] · [[brain/assets/brand/ui-notes/Modals-and-Popups|Modals and popups]] · [[brain/assets/brand/ui-notes/Navigation|Navigation]] · [[brain/assets/brand/coverage-notes/Needs-Manual-Verification|Needs Manual Verification]] · [[brain/assets/brand/ui-notes/Platform-Differences|Platform differences]] · [[brain/context/flows|Product features list]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/assets/brand/asset-notes/Asset-Inventory|Runtime asset inventory]] · [[brain/assets/brand/ui-notes/Screen-Inventory|Screen inventory]] · [[brain/assets/brand/coverage-notes/Screenshot-Video-Index|Screenshot and video index]] · [[brain/assets/brand/guidelines/Shadows-and-Elevation|Shadows and elevation]] · [[brain/assets/brand/guidelines/Shapes-and-Radius|Shapes and radius]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[brain/skills/territool-test/SKILL|Skill – testing]] · [[brain/assets/brand/guidelines/Spacing|Spacing]] · [[brain/assets/brand/design-brain-root/MASTER-DESIGN-BRAIN|TerriTool Mobile — Master Design Brain]] · [[brain/assets/brand/design-brain-root/MINI-DESIGN-BRAIN|TerriTool Mobile — Mini Design Brain]] · [[brain/assets/brand/design-system-notes/Token-Inconsistencies|Token inconsistencies (do not normalize)]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]] · [[brain/assets/brand/guidelines/Typography|Typography]] · [[brain/assets/brand/ui-notes/States|UI states]] · [[brain/assets/brand/design-system-notes/Usage-Rules|Usage rules for a new screen]]

**Product feature (1):** [[_id/F15|Find & buy contacts]]

**Coding rules (3):** [[_id/M8|No hard-coded colours or sizes]] · [[_id/S3.9|Offline mode dropped]] · [[_id/S4.1|Use approved design tokens]]

**Quality check (1):** [[_id/DG-A3|All states enumerated per screen]]

**Owner decisions (6):** [[_id/D-DS5|Disabled = 40% faded]] · [[_id/D-DS6|Find Leads & Map View as outline chips]] · [[_id/D-DS4|One danger red]] · [[_id/D-DS1|Only add new design tokens]] · [[_id/BT-8|Use the approved words]] · [[_id/D-DS8|Web uses the same tokens, smaller sizes]]

**Problem founds (2):** [[_id/KG-NAV1|Cluster route screen missing (crash)]] · [[_id/KG-UI6|Missing colour on Find Contacts screens]]

**Screenshots (22):** [[_capture/LR-09|Error screen (developer test button)]] · [[_capture/RT-40|Find contacts – 2 people selected]] · [[_capture/RT-35|Find contacts – all stops checked]] · [[_capture/RT-34|Find contacts – checking each stop]] · [[_capture/RT-44|Getting contact details in the background]] · [[_capture/LR-12|Plans – 7-day free trial turned on]] · [[_capture/LR-13|Plans – Apple purchase sign-in]] · [[_capture/LR-11|Plans – Base Plan (free trial off)]] · [[_capture/LR-14|Plans – free trial selected]] · [[_capture/RT-41|Review – 2 contacts for 4 credits]] · [[_capture/RT-43|Review – 3 contacts for 5 credits]] · [[_capture/LR-04|Sign-up step 1 – choose your goals]] · [[_capture/LR-05|Sign-up step 1 – goals picked]] · [[_capture/LR-06|Sign-up step 2 – your role and customers]] · [[_capture/LR-07|Sign-up step 3 – tools you use today]] · [[_capture/LR-08|Sign-up step 4 – create your account]] · [[_capture/LR-10|Sign-up step 5 – setting up your account]] · [[_capture/RT-36|Stop 2 – people found]] · [[_capture/RT-38|Stop 3 – people with prices]] · [[_capture/RT-37|Stop 3 – searching for contacts]] · [[_capture/RT-39|Stop 3 – two people picked]] · [[_capture/RT-42|Stop 4 – searching for contacts]]

**Code files (15):** [[_code/mobile/App/utils/API.js|API.js]] · [[_code/mobile/App/components/common/AppButton.js|AppButton.js]] · [[_code/mobile/App/components/common/AppConfirmModal.js|AppConfirmModal.js]] · [[_code/mobile/App/components/route/bizContact/bizContactScreens.styles.js|bizContactScreens.styles.js]] · [[_code/mobile/App/config/index.js|config/index.js]] · [[_code/mobile/App/components/customcompany/index.js|customcompany/index.js]] · [[_code/mobile/App/components/customfooter/customfooter.styles.js|customfooter.styles.js]] · [[_code/mobile/App/components/customheader/customheader.styles.js|customheader.styles.js]] · [[_code/mobile/App/components/dashboard/editstatus.js|editstatus.js]] · [[_code/mobile/App/components/filterModule/filterModule.styles.js|filterModule.styles.js]] · [[_code/mobile/App/components/company/list.js|list.js]] · [[_code/mobile/App/utils/navigateToRouteDetail.js|navigateToRouteDetail.js]] · [[_code/mobile/App/components/route/index.js|route/index.js]] · [[_code/mobile/App/styles/screenCurvedBody.js|screenCurvedBody.js]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
