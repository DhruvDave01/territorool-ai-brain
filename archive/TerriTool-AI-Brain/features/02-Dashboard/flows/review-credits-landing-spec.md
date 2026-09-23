---
title: "Screen spec — day-two review credits"
status: "UI landing implemented; reward workflow pending"
---

# Screen spec — day-two review credits

Proposed 2026-09-21. The eligible-state Blade UI is available at authenticated `/reviews/credits`; it is deliberately display-only. Visual mocks are in [evidence/review-credits/](../evidence/review-credits/). Interactive mock: [evidence/review-credits-mock.html](../evidence/review-credits-mock.html).

## Goal

Let a sales rep unlock up to 50 free credits by leaving an honest review on G2 and Product Hunt, without interrupting the normal web dashboard.

## Product decision captured

| Item | Decision |
|---|---|
| Total | **Up to 50 credits** (30 G2 + 20 Product Hunt) |
| G2 | **30 credits** → `https://www.g2.com/contributor/territool-ai-field-sales-agent-review-collection-aace6d2c-4008-4c82-8232-6a0e40d5c9c6` |
| Product Hunt | **20 credits** → `https://www.producthunt.com/products/territool-field-sales-ai?utm_source=twitter&utm_medium=social` |
| Web entry | Day-two email only. Do **not** add a persistent dashboard banner or modal. |
| Mobile entry | Replace `Want 20 more credits?` referral banner with `Want 50 more credits?` → same reward, not invites. |
| Honesty | Ask for an honest review. Never ask for a positive rating. |
| Grant | After verification. A click is not a grant. |

Eligibility, expiry, duplicate-prevention, and the exact verification method are **UNKNOWN — needs product/backend**.

## User / role / flow

| Field | Decision |
|---|---|
| User / role | Sales Agent / Business Sales Agent |
| UC ID | **UC-HOME-05** |
| FLOW ID | FLOW-REVIEW-CREDITS (email → landing; not a dashboard-tile flow) |
| URL | `/reviews/credits` now; signed email token TBD |
| Stack | **Blade + jQuery** (not `/manager`) |
| Chrome | Existing authenticated header + sidebar |
| Credit impact | Reward: +30 and/or +20 after verify. Spend: **none** |
| One-product | Grant through the shared credit helper / ledger so web, iOS, Android, and MCP show the same balance |

## Copy-from (live screens)

Current web home — keep this chrome, do not restyle it:

![Web dashboard](../evidence/Screenshot%202026-09-15%20at%2011.10.02 AM.png)

Current mobile banner this campaign replaces (`Want 20 more credits?` → referral invite):

![Mobile referral banner](../evidence/mobile/Dashboard/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-09-15%20at%2019.36.33.png)

Live layout to match: white header (Upgrade, credits pill, store badges, Report Bug, Logout), 78px icon sidebar, `#eef1f5` page, white 8–12px cards, primary `#124ac6`, 14px Source Sans Pro. Blade/Bootstrap grays (`#f8f9fa`, `#eee`, `#333`, `#666`). No fifth blue.

## Proposed UI (mocks)

### 1. Day-two email (web entry)

![Day-two email](../evidence/review-credits/email.png)

**Send option A (credit-first, recommended for trial users)**  
Subject: `Want 50 more credits?`  
From: Spencer (same as welcome mail)  
CTA: `Unlock 50 free credits`

**Send option B (feedback-first)**  
Subject: `Share your TerriTool experience`  
CTA: `Share your feedback`

Body in both: 30 credits for G2, 20 for Product Hunt, credits after verification, honest review only.

### 2. Web landing — eligible

![Web landing](../evidence/review-credits/web-landing.png)

Small dedicated page inside existing chrome. One white panel. Two rows, not a new marketing microsite. No progress counter or progress bar.

```text
Home / Unlock Credits
Unlock 50 free credits

Share your TerriTool experience
Leave an honest review. We add credits after we verify it.

[G2]  G2                 30 credits   [Leave a G2 review]
[PH]  Product Hunt       20 credits   [Leave a Product Hunt review]

Reviews are verified before credits are added.
Need help? Contact support
```

External CTAs open G2 / Product Hunt in a new tab.

Mobile web (sidebar collapsed, stacked CTAs):

![Web landing mobile](../evidence/review-credits/web-landing-mobile.png)

### 3. One review pending

![G2 pending](../evidence/review-credits/web-pending.png)

G2 row: `Submitted` + `30 credits pending verification`. Product Hunt stays available.

### 4. Both verified

![Both complete](../evidence/review-credits/web-complete.png)

Header credits already include the +50. Green `You unlocked 50 credits.` + `Back to dashboard`. Claimable once.

### 5. Mobile banner (copy change only)

![Mobile banner](../evidence/review-credits/mobile-banner.png)

`Want 50 more credits?` in the same home-banner slot. Does not open the old Email/Phone invite form.

### 6. Mobile sheet

![Mobile sheet](../evidence/review-credits/mobile-sheet.png)

Same two actions as the web page. Native sheet, not a new app flow.

## States

| State | UI |
|---|---|
| Eligible | Both CTAs live |
| Opened external site | Landing unchanged. Do not mark complete from a click. |
| Submitted / pending | Disabled `Submitted` + pending pill |
| One verified | Other row still open |
| Both verified | Success; Back to dashboard |
| Already claimed | Plain “already claimed” + amount if known |
| Bad / expired email link | Link unavailable + support. Do not leak another user’s status |
| External site down | Landing intact; Try again / Copy link |

## Actions

| Control | Result |
|---|---|
| Leave a G2 review | Open G2 URL, new tab |
| Leave a Product Hunt review | Open Product Hunt URL, new tab |
| Contact support | Existing `/support/create` |
| Back to dashboard | `/dashboard` |
| Mobile banner | Same landing or native sheet with the two reviews |

## API / web methods

UI route built: `HomeController@reviewCredits` → `front.review_credits`. It does not read or write review/reward state. Still needed:

1. Day-two mail job (similar to existing `mails/register.blade.php` chrome: `#124ac6` header, 600px table).
2. Signed, user-bound landing route.
3. Per-user, per-platform reward row + **idempotent** credit grant.
4. A definition of “review submitted” G2/Product Hunt can support. A browser redirect is not proof.

## Credit / one-product

Reward grant only. Search remains 0; save AI lead 1; FullEnrich 2; Claude buy 1. Do not make this Blade-only.

## QA (after implement)

- Day-two mail opens this user’s landing page. Dashboard tiles and Find Leads are untouched.
- G2 and Product Hunt buttons use the URLs above.
- Mobile banner says `Want 50 more credits?` and no longer collects Email/Phone invites.
- Click ≠ credit. Grant is idempotent and visible in the shared balance.
- G2-only grants 30; both grant 50; claimed-again does not double-pay.
- Expired / claimed / external-failure copy is readable on desktop and mobile.

## Open before build

1. How ops confirms a G2 / Product Hunt review (manual? scrape? user taps “I submitted”?).
2. Whether the current mobile **referral** 20-credit invite is retired or feature-flagged. Leaving both live would show conflicting 20 vs 50 offers.
3. G2 collection URL may 404 until the G2 profile is live (expected “tomorrow” in the source request).
4. Compliance sign-off on incentivized reviews.
