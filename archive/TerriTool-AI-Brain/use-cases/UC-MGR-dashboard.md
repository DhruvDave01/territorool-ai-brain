---
title: "UC-MGR — Manager dashboard (engineering trace)"
---

# UC-MGR — Manager dashboard (engineering trace)

**Product IDs:** UC-MGR-*. Prose: `features/16-Manager-Portal/use-cases.md`.  
**UI flow:** FLOW-MANAGER.

## User Goal

The Business Agent wants to see team activity and assign new leads without working a personal Address Book.

## Preconditions

- Role Business Agent (or equivalent manager)
- `manager.only` middleware
- Team salespeople exist for assignment flows

## Happy Path

1. Land on `/manager/dashboard` after onboarding “I lead a team”.
2. React mounts `#manager-dashboard-root`, reads JSON payload, calls `/manager/api/*`.
3. Navigate Salespeople / AI Find Leads / Activity / Support / Settings.

## Alternative Paths

- AI Find Leads assign-to-team (credits on manager wallet via `ManagerFindLeadsService`)
- Convert salesperson (`ConvertSalesperson.jsx`)
- Legacy `/businesssalesperson/*` still live (module 21) — dual UX

## Failure Modes

- Editing `public/js/manager-portal.js` instead of JSX (reverted on next build)
- Using Blade/jQuery patterns on these screens
- `reports` screen mount UNKNOWN

## Expected Result

- KPIs/activity from Manager services
- Assign leads: companies appear on the BSA Address Book; credits decrement as documented

## UI

`resources/views/front/manager/*.blade.php` + `resources/manager-portal/*.jsx`

## API

`/manager/api/*` on `ManagerDashboardController` (web.php manager group). **Not** Dingo v2.

## Code

- `app/Http/Controllers/Manager/ManagerDashboardController.php`
- `app/Services/Manager/ManagerDashboardService.php`
- `app/Services/Manager/ManagerFindLeadsService.php`
- `resources/manager-portal/main.jsx`

## Tests

- `tests/ManagerDashboardTerritoryVisitTest.php`
- `tests/ManagerDashboardFieldSalesScoringTest.php`
- `tests/ManagerFindLeadsServiceTest.php`

Run `vendor/bin/phpunit` after service changes.

## Verification

1. `npm run build` if JSX changed
2. Login as manager → dashboard mounts (no blank root)
3. PHPUnit green
4. Playwright: click each sidebar item, no console errors
