---
id: App-Launch
parent: design
sources:
  - App/components/splash/AnimatedSplashScreen.js
  - App/assets/lottie/Image_splash.png
related:
  - design/01-Brand-Guidelines/Logos.md
  - design/06-Coverage/Needs-Manual-Verification.md
---
# App launch

```mermaid
flowchart TD
  A[OS launch] --> B[Native window #124ac6]
  B --> C[JS AnimatedSplashScreen]
  C --> D{JWT?}
  D -->|No| E[Login]
  D -->|Yes| F{SubscriptionGate?}
  F -->|Yes| G[SubscriptionGate DEFERRED]
  F -->|No| H[Dashboard]
```

JS overlay (`AnimatedSplashScreen.js`): `Image_splash.png` background + Lottie (`splash_icon.json` iOS / `splash_icon_android.json` Android). Fade in ~520ms, min visible **3000ms**, fade out ~450ms. Native launch is still solid `#124ac6` only.

Maestro `19-splash.png` is the **native solid blue window** (no poster, no Lottie). Asset still of the JS background: `/Users/dhruvdave/Downloads/Archive/Assets/splash/Image_splash.png`.

`launchScreen.jpeg` is a sibling marketing still and is **not** wired in JS.

**Needs Manual Verification:** Lottie motion on a real device (simulator shot did not catch the overlay).
