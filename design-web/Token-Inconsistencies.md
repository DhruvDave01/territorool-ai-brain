---
id: Token-Inconsistencies
parent: design-web
sources:
  - auth/login.blade.php
  - config/backpack/base.php
---
# Token inconsistencies (web) — do not normalize

Match the nearest page on the **same stack**. Do not average.

| Item | Live A | Live B | Source |
|------|-------|--------|--------|
| Teal | `#16aa9d` leftover in `custom.css` | Manager `--teal: #00a99d` | Do not merge |
| List-page teal | `--tt-teal: #00a99d` on Address Book / Routes / Lists | Classic leftover `#16aa9d` on cluster/nav chips | Page-scoped vars vs global CSS |
| Primary vs login blues | App `#124ac6` | Login split `#2a5bef` / `#1740c7` / `#0b2483` | `auth/login.blade.php` |
| Skin name vs paint | `skin-purple` (`#605ca8` AdminLTE) | White header + `#124ac6` toggle | `config/backpack/base.php` vs `custom.css` / layout inline |
| `.btn-warning` | Bootstrap 3 orange (library) | Restyled `#124ac6` | `custom.css` |
| Switch | `#2196f3` | Primary `#124ac6` | `custom.css` `.slider` |
| Bootstrap | Layout BS **3.3.5** | `package.json` `bootstrap@^5.3.6` unused by manager JSX | Do not swap parent layout to BS5 |
| jQuery | Layout **2.2.0** | `package.json` jquery 3.7.1 | Classic stays 2.2 |
| Manager `--green` | `#00a99d` | Same as `--teal` | Alias, not a distinct green |
| Sidebar width | `--sidebar-w: 260px` in `manager-portal.css` | Responsive fallback `220px` | Copy the file you edit |
| Find Leads engines | Classic city/ZIP + jqxGrid | Manager Places circles + JSON | Two products |
| Circle palette | `--blue #124ac6` | `COLORS` `#2563eb`, `#10b981`, … | `AIFindLeads.jsx` |
| Fonts | Classic Source Sans + DIN 2014 | Manager DM Sans / Space Grotesk | Register Blade uses Inter — keep Inter on that auth shell only |
| Emoji | Web login **Welcome** wave emoji | Mobile product UI has **no emoji** | Do not add emoji to native screens |
| Register length | Web **3** steps | Mobile PostSignup **6** steps | Do not unify |
| Auth shell vs reset | Split-panel login/register/trial | Password reset is classic header + gray content | Copy the matching URL |
| Double sidebar `<a>` | Icon link + `.text-dark` | Would be “cleaner” as one link | Leave it |
| BA on `/company` | Page is Address Book | Sidebar is BA (Home/Salespeople/…), not SA PNGs | Role chrome ≠ page |
| Reports | `/manager/reports` in nav APIs | Blade “Coming soon”, no `#manager-reports-root` | |
| Duplicate route | `GET manager/ai-find-leads` twice in `web.php` | | |
| Typo | Route wizard status “Please Chooae:” | | `route/step1` capture |
| Manager still extends AdminLTE | `_portal_layout` → `front.layout` | Visual is Cockpit CSS | Do not remove the extend to “simplify” |
| Gradient | Manager brand card 7-stop `#124ac6…` | Classic Find Leads Search `#124ac6 → #2ec5e8` | Different gradients, both live |
| `--tt-*` on classic lists | Modern cards on Blade pages | Rest of classic still AdminLTE boxes | Not a license to React-ify |

Mobile pack has its own mixed teals (`#00A99D`, `#12AA9D`, `#16aa9d` is web-only leftover). Do not “align web leftover to mobile `ttGreen`.”
