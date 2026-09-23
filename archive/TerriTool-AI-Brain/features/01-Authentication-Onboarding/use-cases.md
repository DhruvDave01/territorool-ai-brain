---
title: "Authentication Onboarding — use cases"
---

# Authentication Onboarding — use cases

Part of [01-Authentication-Onboarding](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence times refer to [evidence.md](evidence.md) where that file exists.

## 1. Authentication

### UC-AUTH-01 Sign in

| | |
|---|---|
| Actor | Guest |
| Trigger | Opens login |
| Preconditions | Account exists and is active |
| Main | Enter email + password → Login → onboarding (if incomplete) or Home / Manager dashboard |
| Alternate | Remember Me keeps session; Forgot Password; Create Account |
| Exception | Invalid credentials; inactive / unactivated account |
| Evidence | 9:44:49 |

### UC-AUTH-02 Create account (7-day trial)

| | |
|---|---|
| Actor | Guest |
| Trigger | Create Account / `/trial` |
| Main | Name, phone (country code), email, password, reCAPTCHA → Start Free Trial → 60 lead credits, no card required |
| Alternate | Already have an account → Login; B2B landing `/b2b`; special offer `/special` |
| Exception | Duplicate email; failed captcha; invalid phone |
| Evidence | 9:45:04 |

### UC-AUTH-03 Forgot password

Trigger: Forgot Your Password? on login. Email reset → set new password → login.

### UC-AUTH-04 Remember me / logout / mobile deep link

Remember Me on login; Logout in header; QR / App Store / Play for iOS & Android; `mobilelogin/{token}` for in-app session.

### UC-AUTH-05 Account activation

Email activation `accActivate/{userid}` or business salesperson `businesssalesperson/activate/{userid}` before first login.

## 2. Onboarding

Shown after first login until preferences are saved (`/onboarding`). Continue / Finish stay disabled until required picks are made.

### UC-ONB-01 Choose goals (step 1 of 2)

Pick any: Cover more ground each day; Stop wasting gas; Cut stack of sales tools; Find leads I'd never find alone; Close more deals this quarter → Continue.

Evidence: 9:45:57

### UC-ONB-02 Choose role (step 2)

- **I'm in the field** → Field Rep app (sidebar above)
- **I lead a team** → Manager portal

Evidence: 9:46:12

### UC-ONB-03 Choose who you sell to

- **Businesses (B2B)** → company / restaurant-style Find Leads
- **Homeowners (Residential)** → residential targeting

Back returns to step 1. Finish setup writes preferences and lands on Home.
