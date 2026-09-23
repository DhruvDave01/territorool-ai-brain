---
title: "Screen spec — First-route mobile app popup"
---

# Screen spec — First-route mobile app popup

## Goal

Offer a newly activated route user a one-time, unobtrusive way to get the TerriTool mobile app while they are viewing their first published Basic Route.

## User / role

The signed-in owner of a first published Basic Route. Manager views of a salesperson route are excluded.

## UC ID / FLOW ID / URL / stack

- Existing context: UC-RTE-01…15 / FLOW-ROUTE
- URL: `/route/view/{id}`
- Stack: Blade + jQuery + Bootstrap 3 modal

## Copy-from

![Requested mobile-app popup](/Users/picwa/Downloads/Codex%20Image%2018%20Sept%202026%2C%2010_27_10.png)

The source page is [view_basic_route.blade.php](../../../../resources/views/front/route/view_basic_route.blade.php). It has the authenticated sidebar, top navigation, route title/actions, summary cards, and jqxGrid; the popup preserves that chrome beneath a dimmed backdrop.

## Layout / actions

- Desktop composition uses the requested tighter treatment: 650px-wide modal; 109px blue header; 25px body headline and header title; 17px header supporting text; 150px storefront badges; 128px QR code in a 174px divided right column. Header title/subtitle remain unwrapped so they do not collide with the close control.
- Blue header: inline phone, pin, and route icon; “Get the TerriTool Mobile App,” supporting line, visible close control.
- White body: route-on-the-go headline, explanatory copy, a **Copy the download link** action, existing App Store and Google Play badges, and existing QR asset. The copied canonical URL is the same `onboarding_segment_email.mobile_app_url` used by the onboarding email template.
- The popup opens only on desktop (viewport width ≥768px) while the existing first-route onboarding session is active. Its close control only hides the modal; the established first-route onboarding conversion flow decides when that session is complete. On mobile, the route page remains usable and no popup/backdrop is opened.
- Direct store links open in a new tab. Copy uses the browser clipboard and shows “Copied!” without a server write.

## States / API / credits / QA

- Eligibility: route owner; Basic; published; and `Helper::shouldShowFirstRouteOnboarding()` is true. Other routes and manager views render no modal.
- No new endpoint or preference write. The existing route-onboarding conversion flow remains the state owner.
- Credit impact: none. No shared company, route, or credit write; dismissal is web-only preference state.
- QA: eligible route renders the modal; close returns 200 and saves the flag; reload hides it; verify the existing store links and QR image resolve.
