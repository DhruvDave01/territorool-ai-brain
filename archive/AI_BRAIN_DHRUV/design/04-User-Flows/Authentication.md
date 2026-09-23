---
id: Authentication
parent: design
sources:
  - App/components/login/
  - App/components/register/index_register_split.js
related:
  - design/04-User-Flows/Onboarding.md
  - screens/navigation-map.md
---
# Authentication

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/01-auth/`).

Register visual is the **onboarding flow**, not a lone form. [Onboarding.md](Onboarding.md).

## Login

`IMG_4604` · `ios/01-auth/00-login.png` · `App/components/login/`

White screen, TT cube, Email / Password, **Forgot Password?**, filled **Login**, outline **Register Here**. Footer: Terms Of Use (EULA) · version · Privacy. Maestro still is **42.31 (1)** with a blue dot before the version; Archive `IMG_4604` is **42.30 (1)**; flow pack `LoginRegistrationFlow/19.26.16` is **42.32 (1)** — all live, do not pick one.

Empty-password submit: top toast, orange left bar, “Please enter password” (`19.26.38`). After Login, iOS may show **“TerriTool” Would Like to Send You Notifications** (`19.34.48`).

```
Login
  → enter email/password
  → tap Login (AppButton primary, minHeight 54)
      → loading on button
      → success → Dashboard (or RevenueCat paywall if trial inactive — `ios/01-auth/08`/`09`, same chrome)
      → error → Toast
  → Forgot Password? → Safari `{API host}/password/reset`
      (`ios/01-auth/01-login-forgot-password.png` = staging classic Reset Password + store badges)
  → Register Here → PostSignupPaywallFlow step 1 (`ios/01-auth/02-register-1.png`)
  → Terms Of Use (EULA) → Apple EULA URL
  → Privacy → https://www.territool.com/privacy-policy
```

Leftover in-app forgot modal exists in Login but is **not** opened by the link. The numbered pack still is Safari web reset, not an in-app modal.

## Logout

`IMG_4601` · Archive `Setting/19.38.01`

```
Settings → Log out control
  → AppConfirmModal “Log out?”
      → Log out → reset stack to Login
      → Cancel → stay
```

## Session expired

API 401/403 → `SESSION_EXPIRED_EVENT` → AppConfirmModal “Session Expired” → Okay → Login. **No capture.**
