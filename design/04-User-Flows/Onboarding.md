---
id: Onboarding
parent: design
sources:
  - App/components/register/postSignupPaywallFlow.js
  - App/components/register/index_register_split.js
  - App/utils/firstSignUpOnboarding.js
related:
  - design/04-User-Flows/Authentication.md
  - design/04-User-Flows/Subscription.md
  - screens/how-it-works.md
  - design/06-Coverage/Deferred-Scope.md
---
# Onboarding (Register flow)

Live JS: `PostSignupPaywallFlow` inside Register. **Not** CustomHeader + curved body + footer. Light full-screen questionnaire. Copy **this** flow for new steps here — do not restyle it to Settings/Dashboard.

Simulator pack (2026-09-15): `/Users/dhruvdave/Dhurv/Project_TerriTool/untitled folder/screenshots/ios/`  
`00-onboarding.png` · `20-subscribe.png` (same step, one goal checked) · `21-subscribe-role.png` · `22-subscribe-cost.png` · `23-register.png` (`24-subscribe-preview.png` is a duplicate of 23).

Code steps (`TOTAL_STEPS = 6`): Goals → Role → Cost → Register → Configuring → `SubscriptionScreen`.

| Step | UI (captured) | Still |
|------|----------------|-------|
| 1 of 6 Goals | “What's the win you're chasing?” Five checkbox rows. Continue disabled until ≥1 checked (washed blue → `#124ac6`). **Back to Login** text link | `00`, `20` |
| 2 of 6 Role | “Which one's you?” Field vs team radios. “And who do you sell to?” Businesses (B2B) / Homeowners | `21` |
| 3 of 6 Cost | “What are you using today?” Tool checkboxes (ZoomInfo, Google Maps, Road Warrior, Apollo, Badger Maps, Spreadsheets, Data Axle Genie). Continue needs ≥1 tool | `22` |
| 4 of 6 Register | TT cube, First/Last, `+1` phone, email, password, **Sign Up**. Outline **Preview subscription steps**. Pink **Test crash screen** is a **dev** control — do not copy into product UI | `23` / `24` |
| 5 of 6 Configuring | Heading in code: “Configuring TerriTool for you” + ring. `SHOW_AI_FIND_LEADS_PREVIEW = false` (preview screen off) | **No still** |
| 6 of 6 Subscribe | `SubscriptionScreen` (RevenueCat) | **No still** |

Progress: six-segment bar at top (filled = primary blue). Body ~`#F6F7FB`, white rounded cards, no footer.

After Sign Up, first-run AI hunt can skip the post-save modal (`firstSignUpOnboarding`) and complete in `PublishRoute`. That hunt UI is the normal AI Find Leads screen, not this questionnaire.

**Do not** use `screenshots/mobile/*.png` — those are HTML replicas from `TerriTool/docs/User-Interface/screens.html` (stale version “2.0”, no step bar).
