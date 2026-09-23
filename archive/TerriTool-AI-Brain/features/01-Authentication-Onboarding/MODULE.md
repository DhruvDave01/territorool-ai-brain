---
title: "01 — Authentication, Registration, Onboarding"
---

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

**Modules** — [02-Dashboard](../02-Dashboard/MODULE.md), [16-Manager-Portal](../16-Manager-Portal/MODULE.md), [21-Business-Team](../21-Business-Team/MODULE.md), [12-Subscription-Payments](../12-Subscription-Payments/MODULE.md), [14-Settings-Profile](../14-Settings-Profile/MODULE.md), [17-Admin-HQ](../17-Admin-HQ/MODULE.md)

**This feature** — [Use cases](use-cases.md), [Flows](flows.md), [Evidence](evidence.md)

**Code** — [ROUTEMAP.md](../../knowledge/code/ROUTEMAP.md) (look for `Auth\LoginController`, `RegisterController`, `B2bSignupController`, `PostRegistrationOnboardingController`, `TourController`, `InviteController`), [CODEMAP.md](../../knowledge/code/CODEMAP.md), [engineering/README.md](../../knowledge/code/README.md)

**Terms / roles** — [roles.md](../../product/roles.md), [OVERVIEW.md](../../product/OVERVIEW.md)
