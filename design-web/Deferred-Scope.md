# Deferred visual scope (web)

Same rule as mobile [design/06-Coverage/Deferred-Scope.md](../design/06-Coverage/Deferred-Scope.md): **exists in code, no (or insufficient) captures — do not invent UI.**

Archive pass 2026-09-14 used a logged-in **Business Agent** at `http://127.0.0.1:8000/`. `/dashboard` redirected to manager.

| Area | Code | Why skipped |
|------|------|-------------|
| Register | `resources/views/auth/register.blade.php` (Inter) | No capture; same deferred family as mobile Register |
| Trial / B2B | `auth.freetrial`, `auth.b2b` | Paywall-adjacent; Inter on B2B |
| Onboarding | `auth.post_registration_onboarding`, `first_route_onboarding_sheet` | No first-run capture |
| Subscription / paywall / RevenueCat purchase | `front.subscription.*`, `#revenuecatManagePlanModal` | Payment |
| Login split-panel pixels | `auth.login` | Code tokens recorded; **no still** (session already authenticated) |
| HQ | `resources/views/vendor/backpack/` | No HQ capture |
| Sales Agent dashboard | `front.dashboard` recent-activity / welcome | BA session cannot stay on `/dashboard` |
| BSA PNG sidebar | `inc/sidebar.blade.php` BSA branch | Archive user was BA (Font Awesome rail) |
| Forgot password | Laravel auth reset | Out of Archive |
| CSV upload wizards | `uploadcompany/step*`, `uploadcontact/step*` | No stills |
| Company detail / maps / list detail | many Blade files | Code-only until more stills |
| Manager salespeople / activity / settings / support | islands exist | Not in the short Archive list |
| Manager reports | “Coming soon” Blade | Placeholder |

When new stills arrive, extend [Screenshot-Index.md](Screenshot-Index.md) — do not invent UI.
