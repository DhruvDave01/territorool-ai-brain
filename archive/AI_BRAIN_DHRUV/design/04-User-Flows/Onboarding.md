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

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/01-auth/`).

Live JS: `PostSignupPaywallFlow` inside Register. **Not** CustomHeader + curved body + footer. Light full-screen questionnaire. Copy **this** flow for new steps here — do not restyle it to Settings/Dashboard.

Simulator packs (binaries not in git):

- Maestro 2026-09-15: `/Users/dhruvdave/Dhurv/Project_TerriTool/untitled folder/screenshots/ios/` (`00`, `20`–`24` = steps 1–4 only)
- Flow pack 2026-09-16: `/Users/dhruvdave/Downloads/Archive/LoginRegistrationFlow/` (iPhone 17 Pro Max Simulator, build **42.32 (1)**). Cite by time, e.g. `19.29.28.png`

Code steps (`TOTAL_STEPS = 6`): Goals → Role → Cost → Register → Configuring → `SubscriptionScreen`.

| Step | UI (captured) | Still |
|------|----------------|-------|
| 1 of 6 Goals | “What's the win you're chasing?” Five checkbox rows. Continue disabled until ≥1 checked (washed blue → `#124ac6`). **Back to Login** text link | Maestro `00`/`20`; Archive `19.27.00` |
| 2 of 6 Role | “Which one's you?” Field vs team radios. “And who do you sell to?” Businesses (B2B) / Homeowners (Residential). Residential tap → **system** alert “Sorry but this platform is not for residential reps yet” / OK | Maestro `21`; Archive `19.27.10`, `19.35.14` |
| 3 of 6 Cost | Tool checkboxes (ZoomInfo, Google Maps, Road Warrior, Apollo, Badger Maps, Spreadsheets, Data Axle Genie) with hours/week. Sticky summary: “YOU'RE CURRENTLY SPENDING $1,250/mo” + “22 hrs/wk” when two tools selected. Continue needs ≥1 tool | Maestro `22`; Archive `19.27.16` |
| 4 of 6 Register | TT cube, First/Last, `+1` phone, email, password, **Sign Up**, **Already have an account?** Outline **Preview subscription steps**. Pink **Test crash screen** is a **dev** control — do not copy | Maestro `23`/`24`; Archive `19.28.18` |
| 5 of 6 Configuring | “Configuring TerriTool for you” + “Tuning the app around your goals. Takes just a moment.” Ring around shield-check. Checklist: done (green) “Setting your territory goals” · in-progress “Customizing your workflow” · pending “Getting your leads ready to route”. `SHOW_AI_FIND_LEADS_PREVIEW = false` | Archive `19.29.28` |
| 6 of 6 Subscribe | `SubscriptionScreen` — [Subscription.md](Subscription.md) | Archive `19.29.34`–`19.29.49` |

Progress: six-segment bar at top (filled = primary blue). Body ~`#F6F7FB`, white rounded cards, no footer.

After Sign Up, first-run AI hunt can skip the post-save modal (`firstSignUpOnboarding`) and complete in `PublishRoute`. That hunt UI is the normal AI Find Leads screen, not this questionnaire.

**Do not** use `screenshots/mobile/*.png` — those are HTML replicas from `TerriTool/docs/User-Interface/screens.html` (stale version “2.0”, no step bar).
