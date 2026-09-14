# Shapes and radius

**Token source:** `theme.radius` (`scaledSize`).

| Token | Base |
| --- | --- |
| `xxs` | 4 |
| `xs` | 8 |
| `sm` | 10 |
| `md` | 12 |
| `lg` | 16 |
| `xl` | 20 |
| `xxl` | 24 |

## Unscaled / special

| Value | Use | Source |
| --- | --- | --- |
| **25** (not scaled) | Curved screen body top corners | `SCREEN_BODY_TOP_RADIUS` in `screenCurvedBody.js` |
| **12** | `AppButton`; most inputs | AppButton + login |
| **10** | Some older CTAs | leftover styles |
| **16** | `AppConfirmModal` card; many sheets | AppConfirmModal |
| **24** | Confirm icon wrap circle | AppConfirmModal |
| Pills | Credits chip, activity tabs, company action buttons | captures — large corner radius (~12–16) |

## Screen chrome (do not invent a new shell)

1. Full-bleed **primary** `#124ac6` behind the header (`primaryBleed`)
2. Body sheet `ccSurface` `#F6F7FB` with **25pt** top-left/right radius
3. White cards on that sheet, hairline `#E5E7EB`, radius ~12
4. Optional `CustomFooter` on module screens (not Dashboard)

## Buttons (observed)

- Filled primary: blue, radius 12, white DIN Bold label
- Outline secondary: white fill, **2px** `#124ac6` border, blue label (Login “Register Here”, Share “Cancel”)
- Danger: red fill (Settings Cancel, logout confirm)
- Near-black fill: Confirm Leads (`IMG_4567`)
- Disabled: gray pill (`IMG_4565` Next step)
- Segmented: All / Selected (blue vs gray); Find Leads teal; Map View gold (`VID3` Create List)

## Cards / lists

White rounded rows, light shadow, chevron on the right. Unread list/route rows use a **blue border** highlight (`IMG_4591`).
