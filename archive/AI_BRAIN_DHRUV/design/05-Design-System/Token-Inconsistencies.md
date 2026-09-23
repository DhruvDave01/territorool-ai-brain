---
id: Token-Inconsistencies
parent: design
sources:
  - styles/index.js
  - config/index.js
---
# Token inconsistencies (do not normalize)

| Item | A | B |
| --- | --- | --- |
| Danger | `theme.colors.danger` `#E94A5D` (modals, Settings Cancel) | `AppButton` danger `#CF5B51` |
| Login CTA | primary + radius 12 | Other CTAs sometimes `nearBlack` + radius 10 |
| Confirm Leads | older capture near-black | 42.32 still primary blue |
| App version | package.json 7.1.49 | TestFlight 42.30 / 42.31 / **42.32** |
| Lists tab PNG | `Supply3.png` | unused `icon_lists.png` |
| Teal names | `primaryDark` is teal `#00A99D` | Several teals used interchangeably |
| Map View chip | gold `#FFB800` | not in primary palette usage |
| `styles/index.js` | claims config re-exports `COLOR_*` | **current `config/index.js` does not**; `bizContactScreens.styles.js` still imports `COLOR_PRIMARY` |
| Font weight | DIN family | leftover `fontWeight` 600/700 |
| Login logo box | `loginLogo` 300×110 contain | Asset is the isometric TT cube (`IMG_4604` matches) |
| Activity date | formatter in code | `Invalid Date PT` on some stills (still on 42.32 Dashboard) |
| Inter TTF | on disk | not in theme |
| Filter stack screens | registered | unused; inline FilterModule is live |
| HIDE_SUBSCRIPTION_ACTIONS_ON_ANDROID | comment says hide | value `false` |

New work should **match the nearest live screen**, not average these away.
