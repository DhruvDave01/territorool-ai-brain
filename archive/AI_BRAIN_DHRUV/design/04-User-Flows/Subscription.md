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

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/01-auth/` + `ios/09-settings/`).

Two live mobile paths. Do not mix them with classic web Upgrade (`subscription-subscribe.png`).

## Post-signup (`SubscriptionScreen`, RevenueCat)

Archive `LoginRegistrationFlow/19.29.34`–`19.29.49` (42.32) · `ios/01-auth/09-subscription-screen.png` (42.31). Light full-screen, **no** CustomHeader/footer. `08-subscription-gate.png` is the **same** paywall (trusted-by count 2,399 vs 2,400) — do not invent a second gate layout.

- H1 **The AI Agent For Field Sales Reps**. Sub **Unlock your field sales superpowers**. Four blue check bullets (leads, verified contacts, smarter routes, minutes vs an hour).
- **CHOOSE YOUR PLAN** · **Enable Free Trial** toggle.
  - Off: **Base Plan** only — “100 Credits for leads & contacts • Unlimited routes” · **Now $69.00 per month**.
  - On: Base Plan (unselected) + **7-Day FREE Trial** selected — “60 Credits for leads & contacts • Unlimited routes • Cancel Anytime” · **then $69.00 per month**.
- **TRUSTED BY 2,400 REPS** carousel (James P / Samantha W / Kathy Whitely / Brian C.).
- Primary **Continue** · **Cancel anytime**. Footer **Terms · Restore · Privacy**.
- Continue → iOS **Sign in to Apple Account** sheet; CTA becomes **Processing…**
- **Log out (Dev)** on this screen is a **dev** control — do not copy.

## Settings (web-billed vs store)

Archive `Setting/19.37.23`–`19.38.27`. Buttons **Cancel / Upgrade / Buy extra credits** are live.

- This capture’s account is **web-billed**: Upgrade → system alert **Manage your plan on the web** — “This subscription is billed through TerriTool's website (not through the App Store or Google Play).” **Not now** / **Open website**. That is **not** the RevenueCat paywall.
- **Cancel your subscription?** sheet (`ios/09-settings/05`): plan stays active until period end; radio reasons (pause later / residential / couldn't unlock contacts / something else) + optional “Tell us more”. Delete-account still (`07`) uses the same reason list with CTA **Cancel Account** (not “Submit Request”).
- **Buy extra credits** (`04`): Safari **Buy Credit Add-Ons** on staging — 50/$25, 100/$45, 150/$57, 500/$150, 1000/$300. Not in-app IAP.
- Accordion **Your plan & credits** marketing list (includes “1 Credit for Contact Details” / “2 Credits for Phone Numbers”). Product spend still follows [09-credits-billing.md](../../09-credits-billing.md) (paid contact **2**, Claude-biz **1**) — do not treat accordion copy as the API.

| Surface | Visual |
|---------|--------|
| PostSignup steps 1–6 | Captured — [Onboarding.md](Onboarding.md) + this file |
| `SubscriptionGate` (cold-start block) | **No distinct still** — `08` is the subscribe paywall |
| Store IAP from Settings (App Store billed) | **No still** (Upgrade is web handoff; credits are Safari add-ons) |
