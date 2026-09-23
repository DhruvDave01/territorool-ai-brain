# 01 — Authentication, Registration, Onboarding

## Purpose

Create an account, sign in, reset a password, activate an invite, collect selling preferences, and start a product tour. After login, the user is sent to the home that matches their role.

## Who

All roles.

## Functionality

### Sign in / out

- Email and password login.
- Logout ends the session (and invalidates a token if they signed in from the phone).
- Token can be renewed without a full login.
- Phone number can be validated during signup.
- Forgot password: email with a reset link → new password.

### Sales Agent self-register

- Name, email, phone, password, country/address as required by validation.
- Duplicate emails are rejected before submit.
- Creates a user with the Sales Agent role.
- Welcome and segmented onboarding emails may be queued.
- Web registration also queues `SendReviewCreditsEmail`, about 24 hours later. The button “Redeem 50 Credits” opens `/reviews/credits`. The mail does not add credits.
- Then **onboarding preferences**, then Dashboard (or paywall if they have no plan).
- Prefill signup exists for partner/tool links (name, email, phone already filled).
- Dedicated **trial** signup path.

### Business Agent signup

- Separate B2B signup.
- After login they go to the **manager cockpit**, not the rep dashboard.

### Invited Business Sales Agent

- Manager creates a team member and sends email.
- Invitee sets a password and becomes a Business Sales Agent under that manager (`parent_id`).
- Their credits come from the manager’s allocation, not their own Stripe plan (unless converted later).
- Generic activate-account path exists for other invite types.

### Onboarding preferences

- Stored on the user (industry, territory style, and similar).
- Used later for AI search defaults and marketing segments.
- Settings can toggle related preference flags.

### Product tour

- Start and complete of the guided tour is stored so it is not shown forever.

### QR / invite extras

- Scan QR to attach or identify a user (field app).
- User-to-user invite with optional reward (`InviteRewardService`).

### App store / in-app pay landings

- Public pages for Android and in-app payments; RevenueCat success return after checkout.

## Where they go after login

- Admin → HQ
- Business Agent → Manager cockpit (exception: HubSpot OAuth return on connect)
- Sales Agent / Business Sales Agent → Dashboard
- Guest → Login

## Rules for new work

- Settings and profile always use the signed-in user id, never an id from the URL.
- Do not skip the “no plan → pay” gate for Sales Agents unless product changes trial policy.
- Invite activation must keep manager parent and Business Sales Agent role intact.

## Code

`Auth\LoginController`, `RegisterController`, `B2bSignupController`, `PostRegistrationOnboardingController`, `UserauthController`, `TourController`, `InviteController`, `CheckUserRole`, `OnboardingSegmentClassifier`, `SendWelcomeEmails`, `SendOnboardingSegmentEmail`.

## Related

**Modules** — 02-Dashboard, 16-Manager-Portal, 21-Business-Team, 12-Subscription-Payments, 14-Settings-Profile, 17-Admin-HQ

**This feature** — Use cases, Flows, Evidence

**Code** — ROUTEMAP.md (look for `Auth\LoginController`, `RegisterController`, `B2bSignupController`, `PostRegistrationOnboardingController`, `TourController`, `InviteController`), CODEMAP.md, engineering/README.md

**Terms / roles** — roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | `Login` | `login/index.js` · [LoginRegistrationFlow](<../screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.16.png>) | Sign in | — | — | "Oops! Something went wrong. Please try again later." |
| Mobile | `Register` | `register/index_register_split.js` · [LoginRegistrationFlow](<../screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.38.png>) | Next step of the questionnaire | `screen.register.loading` | — | "We couldn't…" validation lines; "Sorry but this platform is not for residential reps yet" |
| Mobile | `SubscriptionScreen` / `SubscriptionGate` | `register/subscribe.js`, `register/SubscriptionGate.js` · [LoginRegistrationFlow](<../screenshots/mobile-owner/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.47.png>) | Choose a plan | Retry loading plans | — | "Unable to connect to the store. Please check your internet connection."; "Subscription not active yet"; "Try again or restart the app." |
| Classic web | Login, register, reset | [dashboard after login](../screenshots/web/sales-agent/web_01_dashboard_w1440.png) | Sign in | `#cover-spin` | — | Laravel validation errors in the form |

Forgot Password opens the web reset page in Safari. There is no in-app reset screen.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [Screenshot 2026-09-15 at 1.41.25 PM.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/Screenshot 2026-09-15 at 1.41.25 PM.png>)
- [Screenshot 2026-09-15 at 9.44.49 AM.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/Screenshot 2026-09-15 at 9.44.49 AM.png>)
- [Screenshot 2026-09-15 at 9.45.04 AM.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/Screenshot 2026-09-15 at 9.45.04 AM.png>)
- [Screenshot 2026-09-15 at 9.45.57 AM.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/Screenshot 2026-09-15 at 9.45.57 AM.png>)
- [Screenshot 2026-09-15 at 9.46.12 AM.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/Screenshot 2026-09-15 at 9.46.12 AM.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.16.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.16.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.38.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.38.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.47.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.47.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.00.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.00.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.04.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.04.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.10.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.10.png>)
- [Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.16.png](<../screenshots/feature-evidence/01-Authentication-Onboarding/evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.16.png>)
- 16 more stills are in `../screenshots/feature-evidence/01-Authentication-Onboarding/`.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
