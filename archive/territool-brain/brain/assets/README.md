---
area: design-library
tags: [brain/design-library]
ref: "Design library guide"
---

# Territool design library (`brain/assets/`)

This is the brain's own copy of every design asset used by the Territool mobile app (React Native), web app (Blade + AdminLTE), manager portal and email templates.

**Design work uses only this folder**: specs, mockups, artifact pages, audits, and the design values in code. Nothing comes from outside the project: no Google Fonts, no other font or icon CDNs, no invented colours. If something needed isn't here, ask the owner. Never substitute.

**Code is not copied here.** For code, use the live repos:
- `repos/mobile` and `repos/web` symlinks.
- Or the git remotes and branches recorded in `MANIFEST.md`.
- If the symlinks are missing, ask the owner for the local folder path.

## Folder structure

| Folder | What it holds | Origin |
|---|---|---|
| `tokens/` | **Approved tokens.** `tt-tokens.css` (web), `tokens.js` (mobile), `fonts.css` (project @font-face). Hand-maintained; mirrors `brain/context/design-system.md` | brain |
| `fonts/mobile/` | DIN Condensed Bold, DIN Condensed Regular (approved); Inter Regular/Medium (present in the app, **not approved** for new UI) | `App/assets/fonts` |
| `fonts/web/` | DIN 2014 Bold (`DinBold.ttf`), DIN 2014 Light (`DinLight.ttf`) | `public/fonts` |
| `fonts/web-pdf/` | Archivo Narrow Bold, used only by server-side PDF generation | `public/generated` |
| `icon-fonts/mobile-react-native-vector-icons/` | All icon font files + glyph maps of `react-native-vector-icons` (sets imported by the app are listed in `MANIFEST.md`) | `node_modules/react-native-vector-icons` |
| `icon-fonts/web-font-awesome-4.4.0/`, `-4.6.3/`, `web-ionicons-2.0.1/` | The exact icon CSS + font files the web app loads | mirrored from the CDNs the app links |
| `icon-fonts/web-glyphicons-bootstrap3/` | Bootstrap 3 Glyphicons | `public/vendor/adminlte/bootstrap/fonts` |
| `icons/mobile-png/` | Tab, dashboard-tile and map icons (PNG) | `Design-Brain/03-Assets/Icons` |
| `icons/web-portal-lucide/` | SVGs of every lucide icon the manager portal imports | generated from `node_modules/lucide-react` |
| `brand/guidelines/`, `ui-notes/`, `flow-notes/`, `design-system-notes/`, `coverage-notes/`, `design-brain-root/`, `asset-notes/` | Design-Brain documentation (brand usage, colours, typography, spacing, radius, shadows, components, flows). **Prior material: where it disagrees with `brain/context/design-system.md`, the approved system wins** | `Design-Brain/*` |
| `brand/logos/` | Mobile logos (Design-Brain), web logos (`logo*.png`, `terri-logo*.png`, `TTlogo.png`, `tt_smal_logo*.png`, AdminLTE `logo.png`) | both repos |
| `brand/favicons/web/` | `TTicon.ico` (the favicon the layouts link), `TTicon_old.ico` | `public/vendor/adminlte/dist/img` |
| `brand/app-icons/ios/`, `brand/app-icons/android/` | iOS `AppIcon.appiconset` + `TerriTool.png`; Android launcher icons for every density | `ios/…/Images.xcassets`, `android/…/res/mipmap-*` |
| `brand/splash/mobile/` | Lottie splash animations + images, iOS `LaunchScreen.storyboard`, Android `color.xml` / `styles.xml` | both native projects |
| `images/mobile/`, `images/web/`, `images/web-adminlte/`, `images/mobile-user-guide/`, `images/mobile-design-brain/` | Every image the apps ship (contact-provider logos, tiles, badges, payment marks, loaders, illustrations) | `App/images`, `public/images`, AdminLTE `dist/img`, user guide |
| `themes/mobile/App-styles/` | `theme.js` (legacy palette), `fonts.js`, `common.js`, `commonStyles.js`, `platformText.js`, `screenCurvedBody.js`; `support/commonFunctions.ts` (`scaledSize`) | `App/styles` |
| `themes/web-adminlte/`, `web-backpack/`, `web-jqwidgets/`, `web-cdn-plugins/`, `web-laravel-sass/` | Web base theme CSS: AdminLTE + skins, Bootstrap 3, Backpack/pnotify/select2, jqWidgets (base, bootstrap, arctic), date/colour pickers, jQuery UI smoothness, Laravel SASS | web `public/vendor`, `public/jqwidgets`, CDNs, `resources/assets/sass` |
| `styles/mobile-components/` | All 49 component `*.styles.js` files (paths preserved) | `App/components/**` |
| `styles/web-css/` | All app CSS (`custom.css`, `manager-portal*.css`, route/list/company pages, `subscribe.css`, `email.css`, …) | `public/css` |
| `styles/web-blade-inline/` | `<style>` blocks extracted from Blade views (one CSS file per view, path preserved) | `resources/views/**` |
| `styles/web-email-templates/` | Email Blade templates (layout, header, footer, all mails) | `resources/views/mails` |
| `styles/web-static-partials/` | Static HTML partials | `public/partials` |
| `colors/` | `PALETTE.md` / `palette.json`: every colour literal in both apps with counts, flagged against approved tokens (**inventory, not a picker**) | generated |
| `screenshots/mobile/`, `screenshots/web/` | Mobile screenshots + video frames (Design-Brain); 51 staging web captures + capture manifest | Design-Brain, `shoebox/03-web/screenshots` |
| `screenshots/mobile-owner*/`, `screenshots/web-owner-frames/`, `videos/*-owner/`, `docs/*-owner-notes/`, `docs/design-references/` | Captures and notes the owner drops into the shoebox (created when files exist) | `shoebox/02-mobile/{screenshots,frames,videos,notes}`, `shoebox/03-web/{frames,videos,notes}`, `shoebox/04-design/references` |
| `videos/mobile/` | Mobile screen recordings | `Design-Brain/03-Assets/Videos` |
| `docs/` | Mobile UI prompt docs, user guide, subscriptions (RevenueCat) guide, brain design audits | mobile `Prompts/`, `docs/`; `workspace/design-proposals` |
| `artifacts/` | Source of the published brain pages (Brain Map, Brain Graph) | `workspace/` |
| `licenses/` | Licences of bundled icon packages | `node_modules` |
| `MANIFEST.md`, `manifest.json` | Every file with origin, size, sha1; source repo branch/commit; what was not copied and why | generated |

## Refreshing

```bash
node tools/sync-design-assets.js               # rebuild everything except README.md and tokens/
node tools/sync-design-assets.js --no-videos   # skip the large screen recordings
node tools/sync-design-assets.js --no-network  # skip re-mirroring CDN icon/theme files
```

Run it whenever the apps' design files change. `MANIFEST.md` records the repo commits the copy came from.

## Never copied (on purpose)

- **User and generated data:** session uploads, route PDFs, generated map images, uploaded screenshots, downloadable documents.
- **Zips.**
- **Secrets:** any text file matching a secret pattern is withheld and listed in `MANIFEST.md`, and Android `strings.xml` is excluded because it holds Facebook credentials.
- **Application code** other than style/theme files.

## Note on fonts

DIN files are licensed fonts used by the Territool apps. Keep them inside this brain and the owner's private artifacts; don't redistribute them.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (14)

**Documents (7):** [[brain/assets/colors/PALETTE|Colour inventory (generated: do not edit)]] · [[brain/context/design-assets|Design files & asset rules]] · [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[brain/context/design-system|Design system (colours, fonts, spacing)]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/skills/territool-design/SKILL|Skill – design]] · [[_code/brain/tools/sync-design-assets.js|Tool – copy design files]]

**Code files (7):** [[_code/mobile/App/styles/common.js|common.js]] · [[_code/mobile/App/utils/commonFunctions.ts|commonFunctions.ts]] · [[_code/mobile/App/styles/commonStyles.js|commonStyles.js]] · [[_code/mobile/App/styles/fonts.js|fonts.js]] · [[_code/mobile/App/styles/platformText.js|platformText.js]] · [[_code/mobile/App/styles/screenCurvedBody.js|screenCurvedBody.js]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
