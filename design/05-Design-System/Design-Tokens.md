---
id: Design-Tokens
parent: design
sources:
  - App/styles/theme.js
related:
  - design/01-Brand-Guidelines/Colors.md
  - design/03-Assets/Fonts/README.md
---
# Design tokens

**Source of truth:** `App/styles/theme.js` plus `screenCurvedBody.js`, `fonts.js`, `TEXT_SIZES`, `AppButton` variant hexes.

Machine dump of the same tokens (viewer pack): `/Users/dhruvdave/Downloads/Archive/Brand-Guidelines/tokens.json`. If that JSON and `theme.js` disagree, **theme.js wins**.

Full color tables: [../01-Brand-Guidelines/Colors.md](../01-Brand-Guidelines/Colors.md).

## Colors (summary)

- Primary `#124ac6`
- Surface body `#F6F7FB`
- Cards/white `#FFFFFF`
- Text `#111827` / `#6B7280`
- Border `#E5E7EB`
- Danger modal `#E94A5D` vs button `#CF5B51`
- Success `#4CAF50`
- Teal mix `#00A99D` / `#12AA9D` / `#12A090` / `#3E918B`
- Gold chip `#FFB800`
- Near-black CTA `#1a1a1a`

## Typography

Custom **DIN Condensed** Regular + Bold. TTF copies: [`../03-Assets/Fonts/`](../03-Assets/Fonts/README.md). Scale 393×852. See Typography.md.

## Spacing / radius / shadow

`theme.spacing` 4–24 scaled. `theme.radius` 4–24 scaled. Screen body radius **25 unscaled**. Shadows sm/md/lg.

## Icon / control sizes

- Footer icon 28
- Header icon 26, hit 44
- AppButton minHeight 50
- Input minHeight 48
- Filter iOS 48 / Android 42

## Breakpoints

No named breakpoints. `scaledSize` + `iPhoneX` helper list of device heights in `commonFunctions.ts`.
