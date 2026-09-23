---
area: design-library
tags: [brain/design-library]
ref: "Colors"
---

# Colors

**Token source:** `App/styles/theme.js`  
**Native splash / Android primary:** `#124ac6`  
Do not invent extra named palettes. Hex values below are copied from code or measured from Archive 2 captures.

RGB shown as `R, G, B` from the hex (opacity 100% unless noted).

---

## Primary / brand

| Name in theme | HEX | RGB | Opacity | Usage | Source |
| --- | --- | --- | --- | --- | --- |
| `primary` | `#124ac6` | 18, 74, 198 | 100% | Headers, selected footer tint, Login CTA, filled CTAs, links | `theme.colors.primary`; Android `colorPrimary`; Archive 2 headers |
| `secondary` / `info` | `#4A90E4` | 74, 144, 228 | 100% | Token exists; limited live use vs primary | `theme.colors.secondary`, `info` |
| `blue` | `#4a90e2` | 74, 144, 226 | 100% | Legacy blue | `theme.colors.blue` |
| `ttBlue` | `#44AADA` | 68, 170, 218 | 100% | Legacy | `theme.colors.ttBlue` |
| `linkedInBlue` | `#0A66C2` | 10, 102, 194 | 100% | LinkedIn action chip | `theme.colors.linkedInBlue`; View Contact |

## Teal / “active” family (mixed, not a single token)

| Name in theme | HEX | RGB | Usage | Source |
| --- | --- | --- | --- | --- |
| `primaryDark` | `#00A99D` | 0, 169, 157 | Named “dark” but is teal | `theme.colors.primaryDark` |
| `ttGreen` | `#12AA9D` | 18, 170, 157 | Tabs / accents | `theme.colors.ttGreen` |
| `ttTab` | `#3E918B` | 62, 145, 139 | Tab-related | `theme.colors.ttTab` |
| `boldActive` | `#12A090` | 18, 160, 144 | Active emphasis; leftover forgot-password CTA | `theme.colors.boldActive` |
| `lightGreen` | `#40B793` | 64, 183, 147 | Success-adjacent | `theme.colors.lightGreen` |
| `moreLightGreen` | `#1DCF00` | 29, 207, 0 | Bright green | `theme.colors.moreLightGreen` |
| `success` | `#4CAF50` | 76, 175, 80 | Success | `theme.colors.success`; Calendar “Today” reads green in captures |

**Capture note:** Create Route / Create List chip **Find Leads** is teal; **Map View** is gold (`#FFB800` family). See [Token-Inconsistencies](../05-Design-System/Token-Inconsistencies.md).

## Danger / warning

| Name | HEX | RGB | Usage | Source |
| --- | --- | --- | --- | --- |
| `danger` | `#E94A5D` | 233, 74, 93 | Confirm-modal primary (logout, deletes) | `theme.colors.danger`; `IMG_4601` Log out |
| `ttRed` | `#CF5B51` | 207, 91, 81 | `AppButton` **danger** variant (not `danger` token) | `AppButton.js` |
| `darkRed` | `#C16C69` | 193, 108, 105 | Legacy | `theme.colors.darkRed` |
| Settings Cancel | visually `#E94A5D` / red fill | — | “Cancel” subscription on Settings | `IMG_4564`, VID3 Settings |
| `warningOrange` | `#FF8B28` | 255, 139, 40 | Warning | `theme.colors.warningOrange` |
| `orange` | `#CC6600` | 204, 102, 0 | Legacy | `theme.colors.orange` |
| `ttYellow` | `#FFB800` | 255, 184, 0 | Map View chip, warnings | `theme.colors.ttYellow`; VID3 Create List |

## Surfaces / backgrounds

| Name | HEX | RGB | Usage | Source |
| --- | --- | --- | --- | --- |
| `white` | `#FFFFFF` | 255, 255, 255 | Cards, login bg, sheets | theme + captures |
| `ccSurface` | `#F6F7FB` | 246, 247, 251 | Curved screen body, footer shell | `theme.colors.ccSurface`; `screenCurvedBody.js` |
| `surfaceSheet` | `#EEF1F6` | 238, 241, 246 | Sheets | theme |
| `surfaceInput` | `#FAFBFC` | 250, 251, 252 | Inputs | theme; Login fields |
| `surfaceMuted` | `#F3F4F6` | 243, 244, 246 | Muted fill | theme |
| `moreLightGray` | `#F2F2F2` | 242, 242, 242 | Legacy | theme |
| `ttWhite` | `#F6F6F6` | 246, 246, 246 | Legacy off-white | theme |
| `publishBg` | `#F1F5F9` | 241, 245, 249 | Publish/share sheet | theme |
| QR scanner bg | near-black | — | **Exception:** full-screen dark camera UI | `IMG_4609` |

## Text

| Name | HEX | RGB | Usage | Source |
| --- | --- | --- | --- | --- |
| `textPrimary` | `#111827` | 17, 24, 39 | Titles, body strong | theme; most screens |
| `textStrong` | `#333333` | 51, 51, 51 | Older body | theme |
| `textSecondary` | `#6B7280` | 107, 114, 128 | Subtitles, empty copy | theme |
| `textMuted` | `#374151` | 55, 65, 81 | Muted / AppButton neutral | theme |
| `ttFont` | `#707070` | 112, 112, 112 | Legacy | theme |
| `textGray575` | `#575757` | 87, 87, 87 | Legacy | theme |
| `textIconMuted` | `#666666` | 102, 102, 102 | Icons | theme |
| `ccMuted` | `#6B7280` | 107, 114, 128 | Company workspace muted | theme |
| `ccSubtle` | `#9CA3AF` | 156, 163, 175 | Placeholders, disabled icons | theme; Login placeholders |
| `disabled` | `#9CA3AF` | 156, 163, 175 | Disabled | theme |
| `nearBlack` | `#1a1a1a` | 26, 26, 26 | Some CTAs (`AppButton` dark) | theme; Confirm Leads in `IMG_4567` |
| On-primary (headers) | `#FFFFFF` | 255, 255, 255 | Header titles, back chevron | captures |

AppConfirmModal body copy uses **`#64748B`** (also `publishMuted`) — not `textSecondary`.

## Borders / dividers

| Name | HEX / value | Usage |
| --- | --- | --- |
| `border` | `#E5E7EB` | Cards, modal cards |
| `borderStrong` | `#E2E4E9` | Login field border |
| `borderLight` | `#dddddd` | Legacy |
| `borderSubtle` / `borderTopHairline` | `#E8EAED` / `#E8E8ED` | Hairlines |
| `borderFaint` | `rgba(0,0,0,0.04)` | Faint |
| `dividerHairline` | `rgba(0,0,0,0.07)` | Dividers |
| `dividerLight` | `#EEF0F3` | Light divider |
| `footerBorderTop` | `rgba(0,0,0,0.06)` | Footer |
| `footerSeparator` | `rgba(0,0,0,0.08)` | Footer icon separators |

## Overlays / glass

| Name | Value | Usage |
| --- | --- | --- |
| `overlayDark` | `rgba(0,0,0,0.35)` | Dim |
| Confirm backdrop | **0.45** | `AppConfirmModal` |
| Filter backdrop | **0.4** | `FilterModule` |
| HeaderAddMenu backdrop | `rgba(0,0,0,0.18)` | Address Book + menu |
| Spotlight overlay | `rgba(15, 23, 42, 0.78)` | `SpotlightTourModal` |
| `onPrimaryGlass` | `rgba(255,255,255,0.12)` | Header chips (credits, QR) |
| `glassWhite` | `rgba(255,255,255,0.92)` | Glass |
| `primaryMutedBg` | `rgba(18, 74, 198, 0.06)` | Tinted selected |
| `ttGreenMutedBg` | `rgba(10, 169, 157, 0.15)` | Teal tint |
| `selectedGreenTint` | `#e8f5e9` | Selected rows |
| Dashboard loading overlay | dimmed tiles + white spinner card | VID3 `v3_000_0s` “LOADING.” / “Loading credits…” |

## Gradients

`theme.colors.linearGradient` and `subscribeLinearGradient` (same 7 stops):

1. `#124ac6`
2. `#164fca`
3. `#1b54cf`
4. `#2059d3`
5. `#255ed7`
6. `#2963db`
7. `#124ac6`

Used by `CustomHeader` (`LinearGradient`) and deferred paywall screens.

## Map / cluster

| Name | Value | Usage |
| --- | --- | --- |
| `clusterRed` | `#ff0000` | Clusters |
| `mapFillRedSemi` | `rgba(255,0,0,0.5)` | Lasso / fill |
| Start pin (capture) | green | `IMG_4573` |
| End pin (capture) | red | `IMG_4573` |
| Waypoint pins (capture) | blue numbered / pink AI pins | `IMG_4573`, `IMG_4566` |

## Dark / light

There is **no app-wide dark theme**. Chrome is light + blue header. Exceptions:

- QR scanner (`IMG_4609`) is dark camera chrome
- `ActiveRouteMap` polylines react to `Appearance` in code — **Needs Manual Verification** on device

## Capture vs token (do not silently pick one)

| Topic | Token / code | Capture |
| --- | --- | --- |
| Login logo treatment | `TerriTool_logo_NEW.jpg` sized ~300×110 | `IMG_4604` shows a **3D TT cube**, not a wide wordmark |
| Confirm Leads CTA | mix of primary vs `nearBlack` | `IMG_4567` Confirm Leads is **near-black**, not primary blue |
| Settings Cancel | danger red | Matches `#E94A5D` family |

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (11)

**Documents (8):** [[brain/assets/brand/guidelines/README|01 — Brand Guidelines]] · [[brain/audits/04-design|Audit 4 – design review]] · [[brain/assets/MANIFEST|Design library manifest (generated: do not edit)]] · [[brain/assets/brand/design-system-notes/Design-Tokens|Design tokens]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/audits/08-design-brain-review|Review of the old Design-Brain]] · [[brain/assets/brand/design-brain-root/MINI-DESIGN-BRAIN|TerriTool Mobile — Mini Design Brain]] · [[brain/assets/brand/design-system-notes/Token-Inconsistencies|Token inconsistencies (do not normalize)]]

**Code files (3):** [[_code/mobile/App/components/common/AppButton.js|AppButton.js]] · [[_code/mobile/App/styles/screenCurvedBody.js|screenCurvedBody.js]] · [[_code/mobile/App/styles/theme.js|theme.js]]

%% brain-links:end %%
