---
id: Spacing
parent: design
sources:
  - App/styles/theme.js
  - customheader/index.js
---
# Spacing

Parent: [01 — Brand Guidelines](README.md).

**Token source:** `theme.spacing` in `App/styles/theme.js` (all `scaledSize`).

| Token | Base (dp before scale) | Role |
| --- | --- | --- |
| `xxs` | 4 | Tight |
| `xs` | 6 | Compact |
| `sm` | 8 | Default inner |
| `md` | 12 | Card padding common |
| `lg` | 16 | Section |
| `xl` | 20 | Modal horizontal (`AppConfirmModal` uses 20) |
| `xxl` | 24 | Large section |

**Scale:** `scaledSize(n) = ceil(n * min(width/393, height/852))`.

## Layout constants (not in spacing tokens)

| Value | Use | Source |
| --- | --- | --- |
| Toolbar 56 / 72 with subtitle | `CustomHeader` | `customheader/index.js` |
| Footer minHeight 60 | `CustomFooter` | footer styles |
| `minTouchTarget` | `scaledSize(44)` | `theme.layout` |
| `hitSlop` 12 all sides | `theme.hitSlop` | theme |
| AppButton paddingVertical 14, horizontal 20 (compact 12) | buttons | `AppButton.js` |
| AppConfirmModal paddingVertical 22 | modal | styles |
| Filter control height 48 iOS / 42 Android | FilterModule | filter styles |
| Login field minHeight 48 | Login | login styles |
| AppButton default minHeight 50; Login 54 | CTAs | AppButton / Login |

Many screens still use raw `padding: 10` / `marginTop: 8`. Match the **local screen** when extending it; prefer tokens only when that screen already does.
