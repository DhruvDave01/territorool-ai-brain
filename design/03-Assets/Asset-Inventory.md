---
id: Asset-Inventory
parent: design
sources:
  - App/assets/fonts/
  - App/assets/lottie/
  - App/images/
  - App/config/index.js
related:
  - design/03-Assets/Fonts/README.md
  - design/01-Brand-Guidelines/Icons.md
  - design/01-Brand-Guidelines/Logos.md
---
# Runtime asset inventory

Do not delete “unused” files. Mark only.

## Fonts — custom DIN Condensed (live) + leftover Inter

Canonical: `App/assets/fonts/`. Design Brain copies: [`Fonts/`](Fonts/README.md).

Linked in the app by `react-native.config.js` (`assets: ["./App/assets/fonts"]`).

| File | Used in JS theme | Design Brain copy |
| --- | --- | --- |
| DIN-Condensed-Bold.ttf | Yes — titles/CTAs | `Fonts/DIN-Condensed-Bold.ttf` |
| DIN-Condensed-Regular.ttf | Yes — body (`dinLight` alias is Regular) | `Fonts/DIN-Condensed-Regular.ttf` |
| Inter-Medium.ttf | No — leftover | `Fonts/Inter-Medium.ttf` |
| Inter-Regular.ttf | No — leftover | `Fonts/Inter-Regular.ttf` |

Also duplicated under `android/app/src/main/assets/fonts/` by the asset linker. Same four files.

## Lottie — `App/assets/lottie/`

Splash overlay. No Archive 2 still of splash.

## Images — `App/images/` (root)

See [Icons.md](../01-Brand-Guidelines/Icons.md) and [Logos.md](../01-Brand-Guidelines/Logos.md).

Config `require()` exports in `App/config/index.js`: ICON_HOME, ICON_HOME_ACTIVE, ICON_FINDLEADS, ICON_COMPANY, ICON_ROUTES, ICON_LISTS (`Supply3.png`), ICON_SETTING, ICON_AIFINDLEADS, ICON_SCANCARD, ICON_USER_ADD, ICON_USER, ICON_MAP, ICON_NOTIFY, ICON_DELETE, ICON_DELETE_TWO, ICON_MAP_LIST, ICON_MAP_NAVIGATION_BLACK, CURRENT_LOCATION, MARKER_LEADS, LASSO*.

### Potentially unused

`icon_lists.png`, `ai_findleads_1.png`, `launchScreen.jpeg`, some `contactFetch` duplicates / zips / PDFs.

### fetchSources / contactFetch

Provider logos for AI search and Find Contacts (Apollo, Manta, LoopNet, Tripadvisor, SBA, Yelp, ZoomInfo, OPWDD, USASpending, etc.). Wired via `findContactsFetchSourceLogos.js` and Find Leads loading UI (VID1).

## Native

- iOS AppIcon asset catalog
- Android mipmap / `colorPrimary` `#124ac6`
- Info.plist permission usage strings

**Needs Manual Verification:** exact AppIcon PNG filenames on disk vs Contents.json.
