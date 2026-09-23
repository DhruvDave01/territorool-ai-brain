---
title: "Settings Profile — flows"
---

# Settings Profile — flows

Part of [14-Settings-Profile](MODULE.md). CRM/MCP connector UI is also [13-CRM-Integrations](../13-CRM-Integrations/flows.md).

```mermaid
flowchart TD
  Set[/salesperson profile] --> Prof[Name phone password]
  Set --> Status[Custom status labels + colors]
  Set --> Inv[View invoice]
  Set --> CRM[Connect HubSpot / SFDC / Karma]
  Set --> McpClient[In-app MCP client — not UserMcp server]
```

## Mobile flow — Setting (added 2026-09-17)

React Native app (`knowledge/architecture/mobile.md`). Settings here also covers subscription management, which on web lives mostly in 12-Subscription-Payments — cross-referenced, not duplicated.

1. **Settings**: avatar, name, email (copy icon), Credits Remaining, Subscription Renewal (plan, billing cycle, next date, Active pill), Cancel / Upgrade, Buy extra credits, "Your plan & credits" (collapsible), Tags (7 status tags, Edit Status), Preview App Update (dev), Version number. UC-SET-01. ![Settings main](<evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>)
2. **New Update Available** modal: release notes bullets, Update Later / Update Now — in-app update prompt, not an App Store redirect. ![Update available](<evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.29.png>)
3. **Edit Tags**: 7 status swatches (Active/High Priority/Idle/Potential/Reject/Unclassified/Gold) with color dots, tap to recolor, **Update Tags**. Same set as web's Filter By Status list. UC-SET-01-adjacent. ![Edit Tags](<evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.36.png>)
4. **Cancel your subscription?** survey: "Your plan stays active until the end of the current billing period." Reason radio list (Pause and come back later / Only work with residential customers / Couldn't figure out unlock contacts / Something else), optional free-text, Submit Request — matches web's cancel-survey pattern from `product/glossary.md`. Cross-reference 12-Subscription-Payments. ![Cancel survey](<evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.50.png>)
5. **Manage your plan on the web** notice: "This subscription is billed through TerriTool's website (not through the App Store or Google Play). To change or manage your plan, use TerriTool on the web." Not now / Open website. **Important:** despite `react-native-purchases` (RevenueCat) being in the mobile stack, not every subscriber is billed via RevenueCat/IAP — some are web-billed (Stripe/PayPal per web docs) and the app detects this and redirects to web instead of trying to manage it natively. ![Manage on web](<evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.56.png>)
6. **Log out?** confirm: "You will be signed out of TerriTool on this device. You can sign in again at any time." Cancel / Log out. UC-AUTH-04-equivalent. ![Log out confirm](<evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.38.01.png>)
7. **"Your plan & credits"** expanded: "Included in TerriTool Pro" checklist — Unlimited Records/Routes/Lists, AI Route Planning, AI Leads Finder, AI Contact Finder (verified work emails & cell numbers), Unlimited Share Routes & Lists, 2-Way CRM Integration, 120 Credits for Leads/Emails/Phone Numbers, 1 Credit for Contact Details, 2 Credits for Phone Numbers — real current credit-cost copy, cross-check against `product/business-rules.md` if these numbers ever look stale. UC-SET-06-adjacent. ![Plan & credits detail](<evidence/mobile/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.38.27.png>)

