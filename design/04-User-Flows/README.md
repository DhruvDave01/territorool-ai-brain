---
id: README
parent: design
related:
  - design/06-Coverage/Deferred-Scope.md
  - design/04-User-Flows/App-Launch.md
  - design/04-User-Flows/Authentication.md
  - design/04-User-Flows/Onboarding.md
  - design/04-User-Flows/Subscription.md
  - design/04-User-Flows/Main-Navigation.md
  - design/04-User-Flows/Dashboard.md
  - design/04-User-Flows/Find-Leads.md
---
# 04 — User flows

Only flows that exist in code. Register, paywall, and in-app purchase **pixels** are skipped ([Deferred-Scope](../06-Coverage/Deferred-Scope.md)) — the JS is live (`PostSignupPaywallFlow`, `SubscriptionGate`, `firstSignUpOnboarding`). Screen graph: [screens/navigation-map.md](../../screens/navigation-map.md).

| File | Flow |
| --- | --- |
| [App-Launch.md](App-Launch.md) | Splash → JWT → Login/Dashboard |
| [Authentication.md](Authentication.md) | Login, forgot password, logout |
| [Onboarding.md](Onboarding.md) | First-signup AI hunt (code live; no stills) |
| [Subscription.md](Subscription.md) | Gate + RevenueCat (code live; no stills) |
| [Main-Navigation.md](Main-Navigation.md) | Footer + dashboard tiles |
| [Dashboard.md](Dashboard.md) | Hub, activity, referral, QR, calendar |
| [Find-Leads.md](Find-Leads.md) | AI Find Leads → route/list |
| [Routes.md](Routes.md) | Create, publish, detail, share |
| [Lists.md](Lists.md) | Create, share, detail |
| [Companies-and-Contacts.md](Companies-and-Contacts.md) | Address Book, add/edit, scan card |
| [Maps-and-Active-Route.md](Maps-and-Active-Route.md) | Active map, navigate |
| [Enrichment-and-Credits.md](Enrichment-and-Credits.md) | Find Contacts, credits |
| [Scan-Business-Card.md](Scan-Business-Card.md) | OCR review |
| [Calendar-and-Activity.md](Calendar-and-Activity.md) | Calendar + dashboard activity |
| [Settings.md](Settings.md) | Profile, tags, rate, logout |
| [Permissions.md](Permissions.md) | Location, camera, photos, push |
| [Error-and-Recovery.md](Error-and-Recovery.md) | Session, crash, HubSpot |

Format: `Start → action → screen → result`, with loading/error branches where captured.
