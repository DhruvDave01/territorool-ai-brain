---
id: 01-auth-and-account
parent: features
sources:
  - App/components/login/index.js
  - register/subscribe.js
  - dashboard/editstatus.js
related:
  - 06-users-and-roles.md
  - 12-mobile-api.md
  - 18-cross-system-flows.md
  - screens/web-how-it-works.md
---
# Feature: Auth and account

Related: [06-users-and-roles](../06-users-and-roles.md) · [12-mobile-api](../12-mobile-api.md) · [18-cross-system-flows](../18-cross-system-flows.md) · web landings: [screens/web-how-it-works.md](../screens/web-how-it-works.md)

## What it does

Email/password login (web session, mobile JWT), registration, password recovery, profile, SSO from mobile into the web portal, QR join, onboarding tours.

## Mobile

| Piece | Detail |
|-------|--------|
| Screen | `App/components/login/index.js` class `Login` |
| Register | `register/index_register_split.js` |
| Paywall | `SubscriptionGate`, `register/subscribe.js` |
| Settings | `dashboard/editstatus.js` (logout, name, preferences) |
| QR | `dashboard/QrCodeScannerScreen` → `parseQrRoutePayload` (`title`/`id`) |
| JWT | Realm `JWTToken` pk `"1"` via `createJWTToken` |
| 401/403 | `API.js` → `handleSessionExpired` → logout modal in `App.js` |
| Forgot | In-app modal `forgotPassword`; `forgotLink()` opens `{URL_BASE.split("index")[0]}password/reset` |
| Restrict | `GET getrestrictuser` vs native version |

Login FormData: `email`, `password`, `device_token`, `device_type`.

`company_domain` state exists on Login but submit does **not** append it.

`DYNAMIC_LOGIN` = `mobilelogin/` + JWT for portal deep links (also `mobilelogin/credits/`, `mobilelogin/referral/`).

## Web / API

- `Auth::routes()`, `logout`, `register/checkemail`, `trial`, `registertool/{name}/{email}/{phone}`, `b2b`, `onboarding`, `onboarding/preferences`, `mobilelogin/{token}`, `accActivate/{userid}`, `businesssalesperson/activate/{userid}`.
- Web Register is **3 steps** (`auth.register`) and assigns **Sales Agent**. Incomplete onboarding → `/onboarding`; else `/findleads`. B2B skips onboarding → `/findleads`. Do not unify with mobile 6-step register.
- Login: Business Agent → `/manager/dashboard`; SA/BSA → `/dashboard`; Admin (`CheckUserRole`) → `/hq/dashboard`. BSA does not self-register.
- SA with **zero** subscription rows is RevenueCat-gated on `/dashboard` and `/findleads` (`HomeController`, `CompanylController`). BSA is not in that branch.
- API public: `authenticate`, `logout`, `login`, `signup`, `mobileregistration`, `renewtoken`, `recovery`, `reset`, `leads_user`, `validate-phone`, `revenuecate-success`.

## MCP

OAuth through the existing web login page. Access token bound to `user_id`. Scope `territool:app`. Allowed roles: Sales Agent, Business Sales Agent, Business Agent. `require_active_status` true.

## Tours (Realm `TourSchema`)

Flags: `create_route`, `edit_route`, `company_detail`, `fetch_contact`, `notes`.
