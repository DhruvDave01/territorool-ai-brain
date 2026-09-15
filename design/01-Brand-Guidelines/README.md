---
id: README
parent: design
sources:
  - App/styles/theme.js
related:
  - design/01-Brand-Guidelines/Colors.md
  - design/01-Brand-Guidelines/Typography.md
  - design/01-Brand-Guidelines/Logos.md
  - design/01-Brand-Guidelines/Icons.md
  - design/01-Brand-Guidelines/Spacing.md
  - design/01-Brand-Guidelines/Shapes-and-Radius.md
  - design/01-Brand-Guidelines/Shadows-and-Elevation.md
  - design/01-Brand-Guidelines/Brand-Usage-Rules.md
---
# 01 — Brand Guidelines

These files describe **how TerriTool already looks**, not how it should be redesigned.

**Sources of truth (in order):**

1. Live iOS TestFlight captures in `../03-Assets/Screenshots/` and `../03-Assets/Videos/`
2. Tokens in `App/styles/theme.js`
3. Screen-level `*.styles.js` and remaining inline hex (inconsistencies are documented, not “fixed”)

## Files

| File | Contents |
| --- | --- |
| [Colors.md](Colors.md) | Brand, surface, text, semantic, gradient, overlay colors |
| [Typography.md](Typography.md) | Custom DIN Condensed (+ file copies in `03-Assets/Fonts/`), sizes, weights, unused Inter |
| [Logos.md](Logos.md) | Isometric TT cube, lockup, app icon, splash stills |
| [Icons.md](Icons.md) | Tab, tile, map, vector-icon usage |
| [Spacing.md](Spacing.md) | Theme spacing + scale baseline 393×852 |
| [Shapes-and-Radius.md](Shapes-and-Radius.md) | Radii, curved screen body, button/card shapes |
| [Shadows-and-Elevation.md](Shadows-and-Elevation.md) | iOS shadow + Android elevation |
| [Brand-Usage-Rules.md](Brand-Usage-Rules.md) | Observed chrome pattern for new screens |

## Visual capture context

- Device: iPhone, Dynamic Island, screenshots **1170×2532**, videos **1290×2796**
- Build labels in captures: **42.30 (1)** then **42.31 (1)**
- `package.json` marketing versions: iOS **7.1.49**, Android **4.2.7**

Register, paywall, and in-app purchase UI are **deferred** (see `../06-Coverage/Deferred-Scope.md`).
