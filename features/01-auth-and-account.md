# Feature: Auth and account

Related: [06-users-and-roles](../06-users-and-roles.md) · [12-mobile-api](../12-mobile-api.md) · [18-cross-system-flows](../18-cross-system-flows.md)

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

- `Auth::routes()`, `logout`, `register/checkemail`, `trial`, `registertool/{name}/{email}/{phone}`, `b2b`, `onboarding`, `mobilelogin/{token}`, `accActivate/{userid}`.
- API public: `authenticate`, `logout`, `login`, `signup`, `mobileregistration`, `renewtoken`, `recovery`, `reset`, `leads_user`, `validate-phone`, `revenuecate-success`.

## MCP

OAuth through the existing web login page. Access token bound to `user_id`. Scope `territool:app`. Allowed roles: Sales Agent, Business Sales Agent, Business Agent. `require_active_status` true.

## Tours (Realm `TourSchema`)

Flags: `create_route`, `edit_route`, `company_detail`, `fetch_contact`, `notes`.
