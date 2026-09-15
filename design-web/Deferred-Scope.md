---
id: Deferred-Scope
parent: design-web
sources:
  - resources/views/auth/register.blade.php
  - inc/sidebar.blade.php
related:
  - design/06-Coverage/Deferred-Scope.md
  - design-web/Screenshot-Index.md
---
# Deferred visual scope (web)

**Exists in code, no (or insufficient) captures — do not invent UI.**

| Area | Code | Status 2026-09-15 |
|------|------|-------------------|
| Login split-panel | `auth.login` | **Captured** `web/desktop/login.png` |
| Register step 1 of 3 | `auth.register` | **Captured** (later steps in the 3-step web flow **not** stills) |
| Trial | `auth.freetrial` | **Captured** `trial.png` |
| B2B | `auth.b2b` | Still matches register step 1 in this pack |
| Forgot password | Laravel reset | **Captured** `password-reset.png` (classic header, not split-panel) |
| Sales Agent dashboard | `front.dashboard` | **Captured** `dashboard.png` (PNG sidebar) |
| SA Settings | `front.salesperson.edit` | **Captured** `settings.png` |
| Subscription **history** | `front.subscription.*` | **Captured** `subscription.png` |
| Upgrade plan (web) | same | **Captured** `subscription-subscribe.png` — not iOS RevenueCat |
| Register steps 2–3 | `auth.register` | No still |
| `/onboarding` Blade | `auth.post_registration_onboarding` | Filename `onboarding.png` in the pack is **SA dashboard**, not this page |
| HQ | `resources/views/vendor/backpack/` | No HQ capture |
| BSA vs BA sidebar on same URL | `inc/sidebar.blade.php` | This pack is **SA PNG rail**; older Archive is **BA** |
| CSV upload wizards | `uploadcompany/step*`, `uploadcontact/step*` | Extra stills exist (`upload-companies.png`, `upload-contacts.png`) — index if you open them; do not invent missing wizard steps |
| Manager salespeople / activity / support | islands | Not in this Playwright list (older Archive has cockpit + AI Find Leads only) |
| Manager reports | “Coming soon” Blade | Placeholder |
| RevenueCat **iOS** paywall | mobile `SubscriptionScreen` | Still deferred on mobile |

When new stills arrive, extend [Screenshot-Index.md](Screenshot-Index.md) — do not invent UI.
