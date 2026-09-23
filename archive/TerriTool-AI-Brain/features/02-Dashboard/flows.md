---
title: "Dashboard — flows"
---

# Dashboard — flows

Part of [02-Dashboard](MODULE.md). Evidence: [evidence.md](evidence.md) 11:10:02.

```mermaid
flowchart TD
  Login[FLOW-AUTH] --> Home[/dashboard]
  Home --> Pay{SA has plan?}
  Pay -->|No| Bill[FLOW-BILLING]
  Pay -->|Yes| Tiles[Tiles]
  Tiles --> FL[Find Leads]
  Tiles --> AB[Address Book]
  Tiles --> RTE[Routes]
  Tiles --> LST[Lists]
  Tiles --> UPL[Upload]
  Tiles --> Act[Upcoming / Recent activity]
```

## Mobile flow — Dashboard (added 2026-09-17)

React Native app (`knowledge/architecture/mobile.md`). Same tile set as the earlier-catalogued mobile screenshots (IMG_4563 etc. in this file's evidence.md), now with full flow order.

1. OS **location permission** prompt ("needs your location to show nearby territories and navigate to properties") — appears on first Home load. ![Location permission](<evidence/mobile/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.36.28.png>)
2. **Home dashboard**: header (avatar, name, credits badge, QR-scan icon, settings gear), "Want 20 more credits?" referral banner, 6 tiles (AI Find Leads, Scan Card, Add Company, Routes [badge count], Lists [badge count], Address Book), Activity card with Upcoming/Recent tabs — UC-HOME-01, UC-HOME-04. ![Dashboard tiles](<evidence/mobile/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.36.33.png>)
3. Activity card, **Recent** tab: "1 Contact Added" entries with relative time + company name. Header shows **"Invalid Date PT"** next to "Activity" — real copy/date-formatting bug, not a placeholder. UC-HOME-02. ![Activity recent](<evidence/mobile/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.00.png>)
4. Header **QR-scan icon** → "Scan QR code — Point at a route code" camera view. Mobile-only entry point, no matching UC yet. ![QR scan](<evidence/mobile/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.13.png>)
5. OS **camera permission** prompt ("needs camera access to capture property photos") — same native prompt used by Scan Card / Add Company photo capture, surfaced here mid-flow. ![Camera permission](<evidence/mobile/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.36.48.png>)
6. "Want 20 more credits?" banner → **referral invite modal**: Email/Phone tabs, "Get 20 credits for each successful invite", Send invite. Backed by `URL_SEND_REFERRAL_INVITE` / `REFERRAL_APP_LINK` in the mobile repo's `App/config/index.js`. Mobile-only, no matching UC yet — no equivalent found in web's Dashboard or Settings modules. (2 similar frames — Email tab, Phone tab) ![Referral invite](<evidence/mobile/Dashboard/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.38.39.png>)

## FLOW-REVIEW-CREDITS — eligible landing UI

Authenticated web users can open `/reviews/credits` → `HomeController@reviewCredits` → `front.review_credits`. The current delivery is eligible-state UI only: it shows the G2 (30) and Product Hunt (20) review links, with no review submission tracking, verification, email trigger, mobile change, or credit grant. Spec + mocks: [flows/review-credits-landing-spec.md](flows/review-credits-landing-spec.md). Does not add a web dashboard interrupt.

## Mobile flow — ActivityCalendar (added 2026-09-17)

Reached from Dashboard's Activity card ("View All"). Placed under Dashboard (matches UC-HOME-02, "review activity from Home") even though the last screen crosses into company detail.

1. **Activity** (full list, not the Home card's short preview): every event type in one feed — "1 Contact Added", "Received Route T!0 from devtest" (share/receive-route activity type, mobile-only), visits, reminders — each with relative time + company name. UC-HOME-02. ![Activity full list](<evidence/mobile/ActivityCalendar/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.40.14.png>)
2. **Calendar Activity**: month grid (dot = has activity that day) + day-grouped agenda below (visits with **Visit** button, reminders with **Reminder** button, calls with **Call** button). Mobile-only screen, no matching UC yet. (2 similar frames — Sep 15 selected, Sep 1 selected) ![Calendar Activity](<evidence/mobile/ActivityCalendar/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.40.27.png>)
3. Tapping an activity row opens the **company profile** it belongs to — header (name, location, edit pencil), **More Info / Add To / Call / Navigate** action row, **Contacts (N)** list with Add Contact / Find Contacts, **Activity (N)** with Today/Upcoming/Past tabs, bottom tab bar (Home, Search, Address Book, Routes, Lists, Settings). This is mobile's company-detail screen — cross-reference [../03-Company-AddressBook/flows.md](../03-Company-AddressBook/flows.md), not duplicated there since it was reached from this flow. UC-CO-04-equivalent (no direct mobile UC yet). ![Company profile from activity](<evidence/mobile/ActivityCalendar/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.40.44.png>)
