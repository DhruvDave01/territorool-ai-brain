---
id: Typography
parent: design
sources:
  - App/assets/fonts/DIN-Condensed-Bold.ttf
  - App/assets/fonts/DIN-Condensed-Regular.ttf
  - App/assets/fonts/Inter-Medium.ttf
  - App/assets/fonts/Inter-Regular.ttf
  - App/styles/fonts.js
  - App/utils/commonFunctions.ts
  - App/styles/platformText.js
related:
  - design/03-Assets/Fonts/README.md
---
# Typography

TerriTool uses a **custom font: DIN Condensed**. It is not a system font. New screens and design mockups must use these files, not Arial/San Francisco/Inter.

## Font files (copies in Design Brain)

| File | Role | Design Brain copy | Canonical |
| --- | --- | --- | --- |
| `DIN-Condensed-Bold.ttf` | Live brand — titles, CTAs | [`../03-Assets/Fonts/DIN-Condensed-Bold.ttf`](../03-Assets/Fonts/DIN-Condensed-Bold.ttf) | `App/assets/fonts/DIN-Condensed-Bold.ttf` |
| `DIN-Condensed-Regular.ttf` | Live brand — body | [`../03-Assets/Fonts/DIN-Condensed-Regular.ttf`](../03-Assets/Fonts/DIN-Condensed-Regular.ttf) | `App/assets/fonts/DIN-Condensed-Regular.ttf` |
| `Inter-Medium.ttf` | Leftover, unused | [`../03-Assets/Fonts/Inter-Medium.ttf`](../03-Assets/Fonts/Inter-Medium.ttf) | `App/assets/fonts/Inter-Medium.ttf` |
| `Inter-Regular.ttf` | Leftover, unused | [`../03-Assets/Fonts/Inter-Regular.ttf`](../03-Assets/Fonts/Inter-Regular.ttf) | `App/assets/fonts/Inter-Regular.ttf` |

Folder README: [`../03-Assets/Fonts/README.md`](../03-Assets/Fonts/README.md).

## Font families (live in JS)

**Source:** `App/styles/fonts.js` via `theme.font` / `theme.fonts`.

| Theme alias | iOS PostScript | Android family | File |
| --- | --- | --- | --- |
| `dinBold` / `dinCondensedBold` | `DINCondensed-Bold` | `DIN-Condensed-Bold` | `DIN-Condensed-Bold.ttf` |
| `dinLight` / `dinCondensedRegular` | `DIN-Regular` | `DIN-Condensed-Regular` | `DIN-Condensed-Regular.ttf` |

`theme.font.dinLight` is **Regular**, not a true light cut.

Do not use Inter for new screens unless the product later wires it.

Linking in the app (do not change): `react-native.config.js` `assets: ["./App/assets/fonts"]` + `npx react-native-asset`.

## Scale

Sizes in `theme.typography` are **logical iOS baseline sizes**. Layout scale uses `scaledSize` with **393×852** (`App/utils/commonFunctions.ts`). Android also applies `makeTypography` / `androidTextFix` (`App/styles/platformText.js`).

`TEXT_SIZES` (`theme.js`) is a second scale ladder (EXTRA_SMALL 10 → COLOSSAL 26, all `scaledSize`).

## Token styles (`theme.typography`)

All use DIN. Line heights as in `theme.js`.

| Token | Size | Family | Line height | Typical use |
| --- | --- | --- | --- | --- |
| `display` | 24 | Bold | 30 | Large titles |
| `title` | 22 | Bold | 28 | Modal titles (`AppConfirmModal` 22) |
| `heading` | 20 | Bold | 25 | Screen section headings |
| `subheading` | 17 | Bold | 21 | Subheads |
| `buttonLabel` | 17 | Bold | 19 (+ `marginTop: 4`) | CTAs, tabs, modal buttons |
| `body` | 16 | Regular | 20 | Body |
| `bodyBold` | 16 | Bold | 20 | Emphasis |
| `caption` | 14 | Regular | 18 | Secondary |
| `captionBold` | 14 | Bold | 18 | Chips / compact |
| `buttonLabelCompact` | 14 | Bold | 16 (+ `marginTop: 4`) | “N contacts” chips |
| `micro` | 12 | Regular | 15 | Meta, tags |
| `microBold` | 12 | Bold | 15 | Micro emphasis |

Header titles in captures are white, condensed, ~20–22pt on the gradient bar.

## Observed in Archive 2 (not extra tokens)

- Login “Forgot Password?”: DIN Regular **16**, weight **600**, color `#124ac6`
- Login button: `AppButton` `fontSize={20}` (overrides 17)
- Empty states: gray `#6B7280` / `#9CA3AF`, centered
- Filter “Scroll for more”: primary blue + chevron
- Disabled “Next step”: gray pill, white/light label (`IMG_4565`)
- Enabled “Next step”: filled primary (`IMG_4603`)

## Inconsistency

Many screens still set `fontWeight: "600"|"700"` **with or without** DIN. Condensed families often ignore numeric weight on iOS. **Do not normalize** — match the nearest existing screen.
