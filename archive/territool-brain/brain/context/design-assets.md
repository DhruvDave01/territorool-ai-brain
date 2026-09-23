---
area: context
tags: [brain/context]
ref: "Design files & asset rules"
---

# Territool — Design Assets (the brain's own library)

- **Owner instruction (USER SAID, 2026-09-15):** "take all the assets, artifact, font, styles, themes, color … and store as the folder structure so if any day in future I will run you should have all the things in your own folder, no reference, and for the code you can always ask for the folder path … or directly use the git repo".
- **Library:** `brain/assets/`. Structure and refresh: `brain/assets/README.md`. Every file with origin, sha1 and source commits: `brain/assets/MANIFEST.md`.
- **First build:** 2026-09-15, 1,320 files, 368 MB, from mobile `TT_80@e9fd05e` and web `beta_react@21d6348c`.

## 1. Rules

| # | Rule |
|---|---|
| A1 | **Only the library.** Every font, icon, logo, app icon, image and colour in specs, mockups, artifact pages, audits and new UI code comes from `brain/assets/` and the approved tokens. **Nothing from outside:** no Google Fonts or other font services, no icon/font CDNs, no stock or placeholder images, no colours chosen ad hoc. |
| A2 | **New values = approved tokens** (`brain/context/design-system.md`, ready-made in `brain/assets/tokens/`). Legacy values in `themes/`, `styles/` and `colors/PALETTE.md` are only for auditing or matching an existing screen the task targets (S0.2), never a source of new values. |
| A3 | **DIN only** (D-DS3). Web: `"DIN 2014 Bold"` / `"DIN 2014 Light"`. Mobile: `fonts.dinCondensedBold` / `fonts.dinCondensedRegular`. The Inter files in the app bundle are **unused** (0 references in `App/`) and not approved. Web views that still load Google Fonts (Inter, Lato, Raleway, Archivo, DM Sans, Space Grotesk) are legacy: never add them to new work. |
| A4 | **Icons from the surface's existing set** (§4). No new icon library (W19). |
| A5 | **Missing asset → ask the owner.** Don't substitute or generate a lookalike. |
| A6 | **Mockups and artifact pages** link `brain/assets/tokens/tt-tokens.css` + `brain/assets/tokens/fonts.css` (and icon CSS from `brain/assets/icon-fonts/…`) and ship those files as supporting files. Keep DIN font files in private artifacts only (licensed fonts). |
| A7 | **Stale library?** Run `node tools/sync-design-assets.js`. Compare `MANIFEST.md` source commits with the repos' current commits before a design task. |
| A8 | **Code is never read from the library.** Use the live repos (`repos/mobile`, `repos/web`). If a symlink is missing, ask the owner for the local folder path or use the git remotes: mobile `github.com/DhruvDave01/TerriTool_Mobile` (`TT_80`), web `bitbucket.org/anujsinghsahni/webterritool` (`beta_react`). |

## 2. Where things are

| Need | Library path |
|---|---|
| Approved tokens (web / mobile / font faces) | `tokens/tt-tokens.css`, `tokens/tokens.js`, `tokens/fonts.css` |
| Fonts | `fonts/web/DinBold.ttf`, `fonts/web/DinLight.ttf`; `fonts/mobile/DIN-Condensed-Bold.ttf`, `fonts/mobile/DIN-Condensed-Regular.ttf` |
| Logos | web `brand/logos/web/`; mobile `brand/logos/mobile/` (§5) |
| Favicon | `brand/favicons/web/TTicon.ico` |
| App icons | `brand/app-icons/ios/AppIcon.appiconset/` (1024 px master), `brand/app-icons/android/mipmap-*/` |
| Splash | `brand/splash/mobile/` (Lottie JSON + images, `LaunchScreen.storyboard`, Android `color.xml`: `colorPrimary #124ac6`) |
| Images | `images/mobile/`, `images/web/`, `images/web-adminlte/`, `images/mobile-user-guide/` |
| Icon fonts | `icon-fonts/mobile-react-native-vector-icons/` (fonts + glyph maps), `icon-fonts/web-font-awesome-4.4.0/`, `icon-fonts/web-ionicons-2.0.1/`, `icon-fonts/web-glyphicons-bootstrap3/` |
| Icon images | `icons/mobile-png/` (tabs, tiles, map markers, lasso), `icons/web-portal-lucide/*.svg` |
| Mobile theme and styles | `themes/mobile/App-styles/` (`theme.js`, `fonts.js`, `common.js`, `commonStyles.js`, `platformText.js`, `screenCurvedBody.js`), `themes/mobile/support/commonFunctions.ts` (`scaledSize`), `styles/mobile-components/**.styles.js` |
| Web theme and styles | `themes/web-adminlte/` (AdminLTE + Bootstrap 3), `themes/web-jqwidgets/`, `themes/web-backpack/`, `themes/web-cdn-plugins/`, `styles/web-css/`, `styles/web-blade-inline/`, `styles/web-email-templates/` |
| Colour inventory | `colors/PALETTE.md`, `colors/palette.json` |
| Mobile Design-Brain (as-shipped reference) | Start with `brand/design-brain-root/MINI-DESIGN-BRAIN.md`. Then `brand/ui-notes/` (screen inventory, states, forms, modals, maps, platform differences), `brand/flow-notes/` (18 step-level flows), `brand/coverage-notes/Screenshot-Video-Index.md` (IMG/video → screen/code/flow), `brand/guidelines/` and `brand/design-system-notes/` (legacy values), `brand/asset-notes/`. **Read with `brain/audits/08-design-brain-review.md`**: verified parts, known errors, and where approved tokens override it |
| Evidence | **`screenshots/mobile-owner/`** (249 owner captures, build 42.32, 2026-09-15; flows in `brain/context/mobile-flows-captured.md`, IDs in `mobile-screenshot-index.md`), `screenshots/mobile/` (Archive-2 + video frames, 2026-09-11), `screenshots/web/` (51 staging captures), `videos/mobile/`, `docs/design-audits/` |

## 3. Fonts (verified)

| Platform | Family name to use | File | Where the app declares it |
|---|---|---|---|
| Web | `"DIN 2014 Bold"` (body text runs this face at weight 400) | `fonts/web/DinBold.ttf` | AdminLTE.min.css `@font-face` (library copy `themes/web-adminlte/dist-css/AdminLTE.min.css`) |
| Web | `"DIN 2014 Light"` | `fonts/web/DinLight.ttf` | same |
| Mobile iOS / Android | `DINCondensed-Bold` / `DIN-Condensed-Bold` | `fonts/mobile/DIN-Condensed-Bold.ttf` | `themes/mobile/App-styles/fonts.js` |
| Mobile iOS / Android | `DIN-Regular` / `DIN-Condensed-Regular` | `fonts/mobile/DIN-Condensed-Regular.ttf` | same |
| Server PDFs only | Archivo Narrow Bold | `fonts/web-pdf/ArchivoNarrow-Bold.otf` | V2 `CompanyController` PDF generation, not UI |

## 4. Icons (verified)

| Surface | Set | Evidence |
|---|---|---|
| Mobile | `react-native-vector-icons`: **Ionicons** (61 importing files, the default), MaterialCommunityIcons (8), MaterialIcons (2); single uses of AntDesign, Entypo, EvilIcons, Feather, FontAwesome, FontAwesome5, Fontisto, SimpleLineIcons. Plus PNG icons in `icons/mobile-png/` and `images/mobile/` | `MANIFEST.md` "Mobile vector icon sets" |
| Web user app (Blade) | Font Awesome **4.4.0** and Ionicons **2.0.1** (the layouts load them from CDNs; mirrored here), Glyphicons | `themes/web-adminlte`, `icon-fonts/web-*` |
| Manager portal (React) | **lucide-react 0.511.0**: 48 icons in use, SVGs in `icons/web-portal-lucide/` | `MANIFEST.md` lucide list |

## 5. Logos and identity (verified usage in the apps)

| Surface | File (library) | Used by |
|---|---|---|
| Web | `brand/logos/web/tt_smal_logo.png` | 17 Blade references (main web logo) |
| Web | `brand/logos/web/logo_blue.png` | 6 references |
| Web | `brand/logos/web/logo.png` | 5 references |
| Web | `brand/logos/web/terri-logo.png` | 3 references |
| Web | `brand/favicons/web/TTicon.ico` | favicon in 12 layouts |
| Mobile | `brand/logos/mobile/TerriTool_logo_NEW.jpg` | 5 `require()`s (`App/images`) |
| Mobile | `brand/logos/mobile/TT_NO_BG.png` | 2 `require()`s |
| Both | `*_old*` files | superseded: don't use |

**Brand mark (verified 2026-09-15):** both apps use the same **TT cube** mark.
- Mobile: `TerriTool_logo_NEW.jpg` (square cube image, shown in a 300×110 contain box on Login; `IMG_4604`).
- Web: `tt_smal_logo.png`.
- Wordmark lockup: web `logo_blue.png` (cube + "TERRITOOL").

Use the cube where the apps use it (headers, login, small spaces) and `logo_blue.png` where a full lockup is needed. A brand-new placement (e.g. an email header or a marketing surface) still needs the owner's OK. Source: `brain/audits/08-design-brain-review.md` §3.

## 6. Colours: legacy names vs approved tokens

The mobile legacy theme is `themes/mobile/App-styles/theme.js` (frozen, D-DS1). Where its values match an approved token, the new code uses the token:

| `theme.js` key | Value | Approved token |
|---|---|---|
| `primary` | `#124ac6` | `color.brand.primary` |
| `secondary`, `info` | `#4A90E4` | `color.brand.on-primary-selected` |
| `primaryDark` | `#00A99D` | `color.accent.teal` |
| `danger` | `#E94A5D` | `color.danger` |
| `textPrimary` / `textSecondary` / `textMuted` | `#111827` / `#6B7280` / `#374151` | `color.text.primary` / `.secondary` / `.strong-muted` |
| `border` / `borderStrong` | `#E5E7EB` / `#E2E4E9` | `color.border.default` / `.input` |
| `surfaceMuted` / `surfaceInput` / `ccSurface` | `#F3F4F6` / `#FAFBFC` / `#F6F7FB` | `color.surface.muted` / `.input` / `.page` |
| `disabled` | `#9CA3AF` | `color.text.disabled` |
| `ttRed` `#CF5B51`, `ttBlue` `#44AADA`, `ttYellow` `#FFB800`, `success` `#4CAF50`, and the rest | various | **no token**: legacy only (see `04-design.md` §2, §5) |

Web legacy colours: `styles/web-css/custom.css`, `manager-portal.css` (portal CSS variables), AdminLTE. Counts for both apps are in `colors/PALETTE.md` (mobile 236 and web 739 distinct literals at first build).

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (32)

**Documents (21):** [[brain/context/mobile-flows-captured|App journeys from screenshots]] · [[brain/audits/01-mobile|Audit 1 – mobile app review]] · [[brain/audits/02-web|Audit 2 – web app review]] · [[brain/audits/03-parity|Audit 3 – mobile vs web]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/audits/05-testing|Audit 5 – testing plan]] · [[brain/audits/07-validation|Audit 7 – proving the brain works]] · [[brain/assets/colors/PALETTE|Colour inventory (generated: do not edit)]] · [[workspace/handoff/2026-09-17-company-details/result|Company details mobile UI]] · [[brain/assets/README|Design library guide]] · [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[brain/context/mobile-screenshot-index|List of all screenshots]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/audits/08-design-brain-review|Review of the old Design-Brain]] · [[brain/assets/brand/coverage-notes/Screenshot-Video-Index|Screenshot and video index]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[CLAUDE|Start here – brain overview]] · [[brain/assets/brand/design-brain-root/MINI-DESIGN-BRAIN|TerriTool Mobile — Mini Design Brain]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]] · [[workspace/handoff/2026-09-17-company-details-web/result|Web Company Details UI — handoff]]

**Coding rules (2):** [[_id/S0.2|Change new code only]] · [[_id/W19|No inline scripts; portal via React]]

**Owner decisions (2):** [[_id/D-DS3|DIN font everywhere]] · [[_id/D-DS1|Only add new design tokens]]

**Code files (7):** [[_code/mobile/App/styles/common.js|common.js]] · [[_code/mobile/App/utils/commonFunctions.ts|commonFunctions.ts]] · [[_code/mobile/App/styles/commonStyles.js|commonStyles.js]] · [[_code/mobile/App/styles/fonts.js|fonts.js]] · [[_code/mobile/App/styles/platformText.js|platformText.js]] · [[_code/mobile/App/styles/screenCurvedBody.js|screenCurvedBody.js]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
