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

Register visual is the **onboarding flow**, not a lone form. [Onboarding.md](Onboarding.md).

## Login

`IMG_4604` · Maestro `01-login.png` · `App/components/login/`

White screen, TT cube, Email / Password, **Forgot Password?**, filled **Login**, outline **Register Here**. Footer: Terms Of Use (EULA) · version · Privacy. Maestro still is **42.31 (1)** with a blue dot before the version; Archive `IMG_4604` is **42.30 (1)** — both live, do not pick one.

```
Login
  → enter email/password
  → tap Login (AppButton primary, minHeight 54)
      → loading on button
      → success → Dashboard (or SubscriptionGate if trial inactive — **no still**)
      → error → Toast
  → Forgot Password? → Safari/Chrome `{API host}/password/reset`
      (web still: `screenshots/web/desktop/password-reset.png`)
  → Register Here → PostSignupPaywallFlow step 1 (`00-onboarding.png`)
  → Terms Of Use (EULA) → Apple EULA URL
  → Privacy → https://www.territool.com/privacy-policy
```

Leftover in-app forgot modal exists in Login but is **not** opened by the link.

## Logout

`IMG_4601` from Settings

```
Settings → Log out control
  → AppConfirmModal “Log out?”
      → Log out → reset stack to Login
      → Cancel → stay
```

## Session expired

API 401/403 → `SESSION_EXPIRED_EVENT` → AppConfirmModal “Session Expired” → Okay → Login. **No capture.**
