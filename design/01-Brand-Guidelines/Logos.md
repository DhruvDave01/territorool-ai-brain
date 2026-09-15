---
id: Logos
parent: design
sources:
  - App/images/TerriTool_logo_NEW.jpg
  - App/images/TT_NO_BG.png
  - App/assets/lottie/Image_splash.png
  - App/assets/lottie/splash_icon.json
  - App/styles/common.js
  - ios/TerriTool/Images.xcassets/TerriTool.png
related:
  - design/04-User-Flows/App-Launch.md
  - design/03-Assets/Logos/README.md
  - design/03-Assets/Asset-Inventory.md
---
# Logos & branding

The mark is an **isometric TT** (two condensed T’s folded into a 3D block in `#124ac6`). There is no separate “cube file” vs “wordmark file” for Login.

HTML brand book (viewer only): `/Users/dhruvdave/Downloads/Archive/Brand-Guidelines/index.html`. Code still wins.

## In-app mark

| Asset | Path | Used in |
| --- | --- | --- |
| `TerriTool_logo_NEW.jpg` | `App/images/TerriTool_logo_NEW.jpg` | Login (`login.logo`), Dashboard header `TERRITOOL_HEADER_ICON`, WhatsNewModal, SettingsPlanPaywall (**pixels deferred**), Register (**pixels deferred**) |
| `TT_NO_BG.png` | `App/images/TT_NO_BG.png` | Same TT on **black**. CancelAccountConfirmModal, Register welcome (**pixels deferred**) |

Login styles (`common.js` `loginLogo`): box **300×110**, `resizeMode="contain"`, a11y **“TerriTool”**. The JPG itself is the cube on white, so `IMG_4604` matches the file. Do not treat 300×110 as a wide wordmark.

**Do:** keep the mark unrotated and unstretched; brand blue or white on the header gradient; pair with DIN Condensed Bold if you set the word “TerriTool” in type.  
**Don’t:** recolor faces to teal/gray; add drop-shadow/outline; place `TT_NO_BG` (black canvas) on a dark UI without cropping the black; rebuild the letters in another typeface.

## Marketing lockup (not Login)

| Asset | Path | Use |
| --- | --- | --- |
| `TerriTool.png` | `ios/TerriTool/Images.xcassets/TerriTool.png` | Vertical lockup: cube + “TerriTool” + dashed route trail. Marketing / asset catalog, not the Login `require`. |

## App icon

Same isometric TT, white ground. Catalog copies: `/Users/dhruvdave/Downloads/Archive/Assets/app-icon/` (`ios-1024.png`, Android launcher / round / foreground).

Live: `ios/TerriTool/Images.xcassets/AppIcon.appiconset/`, `android/app/src/main/res/mipmap-*`.

## Splash (JS overlay — stills now in Archive)

Native launch is still **solid `#124ac6`** (iOS storyboard / Android window). JS overlay (`AnimatedSplashScreen`):

| File | Role |
| --- | --- |
| `App/assets/lottie/Image_splash.png` | Full-bleed background. Copy: **Win the Game of Sales** / *& expand your territory* / 10x more Leads · Patented CRM · AI Routing + tilted Find Leads map phone |
| `splash_icon.json` | iOS Lottie on top of that still (min visible **~3s**) |
| `splash_icon_android.json` | Android Lottie |
| `splash.json` | In the lottie folder; **not** the JS overlay source |
| `App/images/launchScreen.jpeg` | Similar marketing still (Register bubble, Excel/CSV, “Replace 20 Sales Tools”). **Not referenced** from JS requires |

Stills + Lottie copies: `/Users/dhruvdave/Downloads/Archive/Assets/splash/`. Device motion vs native window is still **Needs Manual Verification**. Do not copy this full-bleed blue poster onto authenticated screens — those stay gradient header + `#F6F7FB` sheet.

## Placement (observed)

- **Login (`IMG_4604`):** cube on white, centered above Email / Password
- **Dashboard header (`IMG_4563`, `IMG_4605`):** small cube, then first name, credits pill, QR, settings
- **WhatsNew / cancel-account:** JPG / `TT_NO_BG` in code; no Archive 2 still
