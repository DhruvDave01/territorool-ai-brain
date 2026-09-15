---
id: Subscription
parent: design
sources:
  - App/components/register/subscribe.js
  - App/components/register/SubscriptionGate.js
  - dashboard/editstatus.js
related:
  - design/04-User-Flows/Onboarding.md
  - 09-credits-billing.md
  - design/06-Coverage/Deferred-Scope.md
---
# Subscription and payment

Settings **buttons** are captured (`IMG_4564`, Maestro `07-settings.png`). Store/web **purchase and cancel flows** are still undocumented.

| Surface | Visual |
|---------|--------|
| PostSignup steps 1–4 | Captured — [Onboarding.md](Onboarding.md) |
| Step 5 Configuring | Code only |
| Step 6 `SubscriptionScreen` / RevenueCat | **No still** |
| `SubscriptionGate` (cold-start block) | **No still** |
| `SettingsPlanPaywall` / CancelAccountConfirmModal | **No still** |

Do not guess RevenueCat offering copy or prices from the web Upgrade page (`subscription-subscribe.png` is **classic web**, not the iOS paywall).
