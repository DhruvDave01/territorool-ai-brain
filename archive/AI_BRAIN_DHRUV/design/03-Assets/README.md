---
id: README
parent: design
sources:
  - App/images/
  - App/assets/
related:
  - design/03-Assets/Asset-Inventory.md
  - design/06-Coverage/Screenshot-Video-Index.md
---
# 03 — Assets

Runtime app assets live in the mobile repo (`App/images/`, `App/assets/`). **Binaries were not copied into this vault** (stills + ~264 MB videos). Open the original pack:

`/Users/dhruvdave/Downloads/Design-Brain/03-Assets/` (same stills also split as `Downloads/Archive 2`–`4`)

Brand book (HTML + splash/logo/icon) **previously** lived at `/Users/dhruvdave/Downloads/Archive/`. As of 2026-09-16 that folder is the **Simulator flow pack** (249 PNGs). Numbered iOS stills: `/Users/dhruvdave/Dhurv/Project_TerriTool/untitled folder/screenshots/ios/` — map [Mobile-Screenshot-Flow.md](../06-Coverage/Mobile-Screenshot-Flow.md). Runtime splash: `TerriTool/App/assets/lottie/Image_splash.png`. Logo copies in this vault: `Logos/`.

This folder in the vault is **inventory markdown only**.

| Path | Contents |
| --- | --- |
| [Asset-Inventory.md](Asset-Inventory.md) | App images, fonts, lottie, native icons |
| [README.md](README.md) | This file |
| `Fonts/` | **Custom font copies:** `DIN-Condensed-Bold.ttf`, `DIN-Condensed-Regular.ttf` (live). Also leftover Inter TTFs (unused) |
| [Logos/](Logos/README.md) | Copies of `TerriTool_logo_NEW.jpg`, `TT_NO_BG.png` |
| [Icons/](Icons/README.md) | Copies of footer/tile/map PNGs |
| [Images/](Images/README.md) | Pointer only — do not duplicate `fetchSources/` |
| `Screenshots/Archive-2/` | All Archive 2 stills (`IMG_4563`–`IMG_4611`, no `IMG_4597`) |
| `Screenshots/Video-Frames/` | Extracted frames for states not in stills |
| `Videos/` | Three walkthrough MP4s (~264 MB total) |

Index: [../06-Coverage/Screenshot-Video-Index.md](../06-Coverage/Screenshot-Video-Index.md)

Videos are large. If git is too heavy, keep them locally and rely on the index + frames.
