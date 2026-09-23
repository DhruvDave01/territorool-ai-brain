---
title: "Dashboard — use cases"
---

# Dashboard — use cases

Part of [02-Dashboard](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence times refer to [evidence.md](evidence.md) where that file exists.

## 3. Home dashboard

### UC-HOME-01 Use dashboard tiles

Tiles: Find Leads (Add Company / Find Leads); Routes (View / Create); Recently Added (Companies / Contacts); Address Book (Companies / Contacts); Lists (View / Create); Upload Excel/CSV; Tutorial; Activity (Upcoming / Recent).

Evidence: 11:10:02

### UC-HOME-02 Review activity from Home

Upcoming / Recent notes. Empty state: “No upcoming notes.” View All → activity list.

### UC-HOME-03 Open tutorial / PDF guide

Tutorial tile → `/tutorial` or `/pdftutorial`.

### UC-HOME-04 Upgrade or inspect credits from header

Upgrade → subscription plans. Credits pill → invoice / add-on credits. Observed trial: Free Package 14–21 Sep 2026, 60 starting credits.

### UC-HOME-05 Unlock review credits (proposed)

Dedicated authenticated web page at `/reviews/credits` shows the eligible review offers: G2 (**30 credits**) and Product Hunt (**20 credits**). It opens the documented review pages in a new tab and does not interrupt the web dashboard tile flow. Submission tracking, verification, the day-two email, mobile banner, and credit grants remain unimplemented. Spec: [flows/review-credits-landing-spec.md](flows/review-credits-landing-spec.md).
