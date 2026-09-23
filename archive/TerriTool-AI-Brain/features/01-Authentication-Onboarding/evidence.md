---
title: "Authentication Onboarding — evidence"
---

# Authentication Onboarding — evidence

Part of [01-Authentication-Onboarding](MODULE.md). Staging captures (15 Sep 2026, `https://staging.territool.com`), rows split from the former `06-Evidence/screenshot-catalog.md`. Use-case IDs refer to [use-cases.md](use-cases.md). Unassigned captures and the walkthrough video: [evidence/README.md](../../evidence/README.md).

| # | Time | File | Screen | Use cases |
|---|---|---|---|---|
| 1 | 9:44:49 | [Screenshot 2026-09-15 at 9.44.49 AM.png](<evidence/Screenshot 2026-09-15 at 9.44.49 AM.png>) | Login | UC-AUTH-01, UC-AUTH-03, UC-AUTH-04, UC-AUTH-06 |
| 2 | 9:45:04 | [Screenshot 2026-09-15 at 9.45.04 AM.png](<evidence/Screenshot 2026-09-15 at 9.45.04 AM.png>) | Create account / 7-day trial | UC-AUTH-02 |
| 3 | 9:45:57 | [Screenshot 2026-09-15 at 9.45.57 AM.png](<evidence/Screenshot 2026-09-15 at 9.45.57 AM.png>) | Onboarding step 1 — goals | UC-ONB-01 |
| 4 | 9:46:12 | [Screenshot 2026-09-15 at 9.46.12 AM.png](<evidence/Screenshot 2026-09-15 at 9.46.12 AM.png>) | Onboarding step 2 — role + customer type | UC-ONB-02, UC-ONB-03 |

## Additional captures (triaged 2026-09-17 from unassigned catalog)

| Time | File | Screen | Device |
|---|---|---|---|
| 1:41:25 PM | [Screenshot 2026-09-15 at 1.41.25 PM.png](<evidence/Screenshot 2026-09-15 at 1.41.25 PM.png>) | Reset Password | Web |

## Mobile — LoginRegistrationFlow (triaged 2026-09-17)

21 iPhone-simulator captures, flow order in [flows.md](flows.md). Source: `/Users/picwa/Downloads/Archive (3)/LoginRegistrationFlow/`, copied to `evidence/mobile/LoginRegistrationFlow/`.

| File | Screen | Use cases | Device |
|---|---|---|---|
| [19.26.16.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.16.png>) | Login (empty) | UC-AUTH-01 | Mobile |
| [19.26.38.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.38.png>) | Login — "Please enter password" | UC-AUTH-01 | Mobile |
| [19.26.47.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.26.47.png>) | Login — "Please provide valid login details." | UC-AUTH-01 | Mobile |
| [19.27.00.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.00.png>) | Onboarding step 1/6 — goals | UC-ONB-01 | Mobile |
| [19.27.04.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.04.png>) | Onboarding step 1/6 — goals selected | UC-ONB-01 | Mobile |
| [19.27.10.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.10.png>) | Onboarding step 2/6 — role + sell-to | UC-ONB-02, UC-ONB-03 | Mobile |
| [19.27.16.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.27.16.png>) | Onboarding step 3/6 — current tool stack / ROI calculator | — (mobile-only) | Mobile |
| [19.28.18.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.28.18.png>) | Onboarding step 4/6 — Sign Up form | UC-AUTH-02 | Mobile |
| [19.28.39.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.28.39.png>) | Crash-reporter screen ("Something went wrong") | — | Mobile |
| [19.29.28.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.29.28.png>) | Onboarding step 5/6 — "Configuring TerriTool for you" | — (mobile-only) | Mobile |
| [19.29.34.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.29.34.png>) | Onboarding step 6/6 — paywall, trial off | — (mobile-only) | Mobile |
| [19.29.37.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.29.37.png>) | Paywall — trial on (60 credits) | — (mobile-only) | Mobile |
| [19.29.45.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.29.45.png>) | Paywall — native Apple sign-in sheet | — (mobile-only) | Mobile |
| [19.29.49 #2.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.29.49 #2.png>) | Paywall — testimonial carousel | — (mobile-only) | Mobile |
| [19.29.49.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.29.49.png>) | Paywall — Processing… | — (mobile-only) | Mobile |
| [19.34.48.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.34.48.png>) | OS push-notification permission prompt | — | Mobile |
| [19.34.54.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.34.54.png>) | OS App Tracking Transparency prompt | — | Mobile |
| [19.35.14.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.35.14.png>) | Onboarding step 2/6 — Residential blocked alert | UC-ONB-03 | Mobile |
| [19.35.44.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.35.44.png>) | Sign Up — "Please enter Enter Valid Password" (copy bug: doubled word) | UC-AUTH-02 | Mobile |
| [19.35.50.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.35.50.png>) | Sign Up — "The email has already been taken." | UC-AUTH-02 | Mobile |
| [19.35.59.png](<evidence/mobile/LoginRegistrationFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.35.59.png>) | Sign Up — "Please enter Enter Valid Email Address" (same copy bug) | UC-AUTH-02 | Mobile |
