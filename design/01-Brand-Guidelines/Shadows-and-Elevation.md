---
id: Shadows-and-Elevation
parent: design
---
# Shadows and elevation

**Token source:** `theme.shadows` (`theme.js`).

| Token | iOS | Android |
| --- | --- | --- |
| `sm` | color `#000`, offset 0/1, opacity 0.08, radius 2 | elevation 2 |
| `md` | offset 0/2, opacity 0.12, radius 4 | elevation 4 |
| `lg` | offset 0/4, opacity 0.16, radius 8 | elevation 8 |

## Other shadows in UI (not theme.shadows)

| UI | Spec | Source |
| --- | --- | --- |
| `AppConfirmModal` card | iOS offset 0/8, opacity 0.12, radius 24; Android elevation 8 | `AppConfirmModal.styles.js` |
| Filter / share sheets | Card-like white + dim backdrop | captures `IMG_4590`, `IMG_4611` |
| Dashboard tiles | Soft shadow on white cards | `IMG_4563` |

New overlays should match **AppConfirmModal** (centered) or **FilterModule** (sheet), not a third shadow language.
