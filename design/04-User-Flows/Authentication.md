# Authentication (in-scope)

Register is **deferred**.

## Login

`IMG_4604` · `App/components/login/`

```
Login
  → enter email/password
  → tap Login (AppButton primary, minHeight 54)
      → loading on button
      → success → Dashboard (or SubscriptionGate if trial inactive — deferred)
      → error → Toast
  → Forgot Password? → Safari/Chrome `{API host}/password/reset`
  → Register Here → Register (deferred)
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
