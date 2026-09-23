---
area: context
tags: [brain/context]
ref: "Business rules: plans, credits and money"
---

# Business rules: plans, credits and money

The brain's longest-standing gap (**W2** — "no business rules sheet") is largely closed by the owner's
101 web screenshots of 2026-09-15. Everything here was **read off a real screen** and cites the
screenshot it came from. Where a figure is one account's state rather than a published rule, it says so.

Screenshots: `brain/assets/screenshots/web-owner/`, index `brain/context/web-screenshot-index.md`.

> [!warning] Status of this note
> `VERIFIED` = read directly from a screenshot. §1–§9 are not inferred from code; **§10 lists the rules
> that have since been confirmed against the implementation (2026-09-16)**. Treat these as the product's
> stated behaviour, to be checked against `repos/web` before relying on them in a change.

---

## 1. Plans (`SLS-60`, the Plans & Packages page)

| | Base Package | Pro Package |
|---|---|---|
| Monthly | **$69 / month** | **$99 / month** |
| Annual | **$720 / year** (Save 13%) | **$999 / year** (Save 16%) |
| Included credits | **100** for leads, e-mails & phone numbers | **180** |
| Records | up to **50,000** | unlimited |
| Routes | unlimited | unlimited |
| Also | Mobile CRM · share routes & lists · 2-way CRM sync | everything in Base · dedicated onboarding · priority support |

> [!warning] CR-22 — the mobile Settings plan panel (`ST-07`) says Pro includes **120** credits, not 180. The two screens disagree; the real value is `packages.credit`, not yet read.

**Free trial (`SLS-02`, the sign-up page):** **7 days** and **60 lead credits**, "No credit card
required", "Setup in 2 Minutes".

**Free Package** exists as a real package row (`SLS-35`, `ADM-04`) — a trial account sits on it until
it upgrades or lapses.

## 2. Credit top-ups (`SLS-60`, "Add Credits (non-recurring)")

| Credits | 50 | 100 | 150 | 500 | 1000 |
|---|---|---|---|---|---|
| Price | $25 | $45 | $57 | $150 | $300 |

Non-recurring. Purchases appear in **Package Add-Ons history** with an invoice (`SLS-35`, `SLS-62`).

## 3. What credits are spent on

| Action | Cost | Evidence |
|---|---|---|
| Save a lead from AI Find Leads | **1 credit per lead** | balance 32 → 26 for 6 leads (`SLS-16` → `SLS-17`); 37 → 32 for 5 leads (`SLS-08` → `SLS-10`) |
| Contact with **phone or e-mail** | **2 credits** | `SLS-48` "1 paid contact with email or phone… Deducted credit: 3" |
| Contact with **name and position only** | **1 credit** | same screen, the other column |
| Assigning leads to a rep (manager) | consumes manager credits | `MGR-03` → `MGR-04`: 100 → 86 |

One rule, three wordings (CR-23): **2 credits** = a contact that comes with a phone or e-mail (a paid provider unlock), **1 credit** = name and position only (the Claude/biz class, S3.3). The contact pricing **matches the mobile app exactly** (mobile `RT-41`/`RT-43`: "Phone or email · 2
credits, Name and position · 1 credit"), so F15 is genuinely at parity on this rule.

**Unexplained:** one 13-lead save moved the balance 60 → 37 (23 credits, `SLS-06` → `SLS-07`), which does
not fit 1 credit per lead. Either some leads were already owned or another action ran in between. **Do
not treat 1 credit/lead as settled until this is reconciled against the code.**

## 4. Running out of credits

A single paywall modal, **"Upgrade or Buy Add-Ons"**, blocks the credit-spending features:

| Where | Message | Evidence |
|---|---|---|
| AI Find Leads | "Insufficient credits, please subscribe to add credits." | `SLS-64` |
| Company detail | "Insufficient credits, Please upgrade your package or add credits to use this feature." | `SLS-65` |
| Find Contacts | "Insufficient credits to search contacts." in the results area | `SLS-66` |

Note the two different sentences for the same condition — a copy inconsistency, recorded as part of
`KG-COPY1`'s family.

## 5. Buying (`SLS-61`, `SLS-62`)

Promo code field with **Apply code**, an itemised total (e.g. Base $69 + 50 credits $25 = **$94**),
saved or new card, **Visa / Mastercard / Discover / Amex**, then **Pay Now**. On success the balance
rises immediately and both the subscription and the add-on get a **Download Invoice**.

**Promotion codes** are managed in Admin HQ (`ADM-14`–`ADM-16`): a code, **price or percent** discount,
validity **Forever or Once**, and a usage limit ("How many times this promo can be used before it is
invalid").

## 6. Managers ("Business Clients")

A manager account is created either directly (`ADM-13`) or by **converting a salesperson**
(`ADM-08`, "Convert to Manager (Business Client)"). Either way the fields are the same:

**Number of licences · payment period · cost per user · credits to be allotted · billing name · billing e-mail.**

- **Cost per user is per contract, not a list price** — the Business Client table shows 10, 23, 45, 50,
  55, 69, 79 and 100 side by side (`ADM-12`).
- Licences are consumed as reps are added; the portal shows Total / Used / Remaining (`MGR-06`).
- The manager's own view states its plan, cost per user and "credits per Sales Person" (`MGR-01`).
- Pending managers get **Copy Activation Link** and **Resend Invitation** (`ADM-12`).

## 7. Admin levers over a subscription (`ADM-09`, `ADM-10`)

**Deactivate Subscription · Extend Days · Activate Yelp Leads**, and a direct **credit balance edit**
("Credit Balance: 380", Add Credit). Subscriptions can run to absurd end dates via Extend Days — one
test account reads 15 September 2026 → **15 September 2041**.

## 8. Enrichment provider

Contact enrichment is **Apollo** — the progress dialog says "AGGREGATING CONTACT DATA FROM MULTIPLE
SOURCES / **Finding data from Apollo**" (`SLS-46`). A second lookup, "Searching Texas Secretary of
State…", appears per company (`SLS-42`), so there is more than one source. Results load in the
background: "You may exit this screen and contacts will load in the background."

This is the same provider whose key is hard-coded at five sites in `Helper.php` (**KG-SEC2**).

## 9. Scale, for sizing decisions (Admin HQ, 2026-09-15)

Paid users **109** · income **109,430.53** · free-trial users **50** · trial expired **1,009** · test
users **44** · paid-customer expired **253** · business clients **10** with **50** users (`ADM-02`);
**1,196** salespersons (`ADM-05`); **1,232** leaderboard entries (`ADM-01`); **88** support tickets
(`ADM-18`); 58 cancelled paid subscriptions and 7 cancelled trials (`ADM-03`, `ADM-04`).

## 10. Rules verified against the code (2026-09-16)

| Rule | What the code does | Evidence |
|---|---|---|
| Saving AI leads | Charges **1 credit per company actually inserted**. A lead whose title + address already exist for that user is skipped and **not charged**. The balance check, however, requires credits for **every selected** lead | `app/Helpers/helpers.php:1143-1355` (`saveAILead`) |
| Free-trial cap | On the Free Package (id 1) one save may hold at most **60 leads**; more returns status "2" "You have selected more than 60 leads…" | `helpers.php:1152-1158` |
| Business Sales Agent | a BSA's lead saves spend its **manager allotment** (`businessclient_salesagent_credits`); when it is exhausted: "Insufficient credits, please contact to manager." | `helpers.php:1182-1195` |
| Monthly credit row | the cron creates one `user_credits` row per billing month: **total = package credits × (1 monthly / 12 annual) + unused credits carried over**, `used = 0` | `CronController.php:105-175` |
| When package credits land | once per renewal day (`package_credits_applied` flag); for annual plans only on the anniversary | `CronController.php:132-160` |
| Unused credits | **roll over** into the next month's total | `CronController.php:126, 146-150` |
| Over-use | when `used > total` at month end, a `user_credit_charge` record path exists (partly commented out) | `CronController.php:102-118` |
| What runs it | the **public GET** cron `cron/updatestripesubscriptionstatuscredit` → `encapsulationCron()` (manager credits, Stripe status, business clients, expired free packages, reminders, renewals) | `routes/web.php:33`; `CronController.php:730-738` |

So the 13-lead save that cost 23 credits (`SLS-06` → `SLS-07`) **cannot** be explained by the lead charge
alone, which is at most one credit per selected lead. Another spend happened in between (U-BR-01, still open).

## 11. What still is not known

- §1–§9 were read from screenshots; §10 lists the rules checked against the code so far. Plan prices and top-up prices are **not** checked against the code or Stripe.
- RevenueCat and Stripe product IDs, and how mobile purchases map to these packages. Cancellations
  show both RevenueCat and Stripe as payment methods (`ADM-03`).
- Referral-programme terms (F28) — the forms were captured, the rules were not.
- Proration on upgrade/downgrade (F04). *Unspent credits at renewal: answered in §10 (they roll over).*

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (69)

**Documents (21):** [[brain/audits/10-brain-final-audit|Audit 10 — Territool AI Brain final audit]] · [[brain/context/brain-scorecard|Brain scorecard: 18 categories, rubric, iterations]] · [[brain/context/contradiction-register|Contradiction register: where two sources disagreed, and which won]] · [[brain/memory/entries/conflict/20260917-4202b6-cr-22-business-rules-1-web-plans-page-sls-60-the|CR-22 — business-rules §1 (web Plans page SLS-60): the Pro Package includes 180 credits ↔ mobile Settings ST-07 "Incl…]] · [[brain/memory/entries/conflict/20260917-c5a5aa-cr-23-business-rules-3-2-credits-phone-or-email-|CR-23 — business-rules §3: 2 credits "phone or email", 1 "name and position" ↔ S3.3: 2 "paid provider contact", 1 "Cl…]] · [[brain/context/data-model|Data model: what Territool stores and where]] · [[brain/memory/entries/qa/20260917-12b67b-ev-c15-lead-save-charge-inserted-companies-dupli|EV-C15 — Lead-save charge = inserted companies (duplicates free, balance must cover all selected; free trial ≤ 60 per…]] · [[brain/context/evidence-ledger|Evidence ledger: what was checked, how, and what it proves]] · [[workspace/qa-reports/2026-09-16-f06-ai-find-leads-save-leads|F06 QA report — AI Find Leads → save leads]] · [[log|Log]] · [[brain/context/parity-map|Mobile vs web differences]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]] · [[brain/context/roles-permissions|Roles and permissions: who can do what, where, and what enforces it]] · [[workspace/test-cases/F06-ai-leads-read|Test cases — F06 AI Find Leads (read contract; search and save waived) (P1)]] · [[brain/context/web-surfaces|The three web surfaces, and how each one is built]] · [[brain/memory/entries/question/20260917-88a2aa-u-br-01-why-one-13-lead-save-cost-23-credits-sls|U-BR-01 — Why one 13-lead save cost 23 credits (SLS-06 → SLS-07)]] · [[brain/memory/entries/question/20260917-752afa-u-br-02-renewal-rules-and-unspent-credits-resolv|U-BR-02 — ~~Renewal rules and unspent credits~~ Resolved 2026-09-16: monthly rows, annual ×12 on the anniversary, unuse…]] · [[brain/memory/entries/question/20260917-0ed83a-u-pay-01-what-happens-past-the-pay-confirm-step-|U-PAY-01 — What happens past the Pay / Confirm step, as verified by the brain itself (RevenueCat, Stripe, buy contacts)]] · [[brain/context/UNKNOWN_REGISTER|Unknown register: what the brain does not know yet]] · [[brain/context/web-flows|Web flows: every web page per role, and how the core features run on web]] · [[brain/context/web-screenshot-index|Web screenshots (owner, by role)]]

**Product features (4):** [[_id/F06|AI Find Leads → save leads]] · [[_id/F15|Find & buy contacts]] · [[_id/F28|Referral invites]] · [[_id/F04|Subscription & credit renewal]]

**Coding rules (2):** [[_id/W2|API status is 1 or 0]] · [[_id/S3.3|Hand-added contacts free]]

**Problem founds (2):** [[_id/KG-SEC2|Provider API key inside the code]] · [[_id/KG-COPY1|Spelling & grammar mistakes in messages]]

**Screenshots (37):** [[_capture/SLS-48|**Bulk contacts completed** — '1 paid contact with email or phone. 1 contact added with name or position.' **Deducted credit: 3**, split into 'Successfully found contact details' and 'Contact Name(s) and Position(s) added']] · [[_capture/SLS-66|**Paywall inside Find Contacts** — 'Insufficient credits to search contacts' in the results area, with the upgrade modal over it]] · [[_capture/SLS-65|**Paywall on a company detail** — 'Insufficient credits, Please upgrade your package or add credits to use this feature' at 0 credits]] · [[_capture/SLS-64|**Paywall on AI Find Leads** — 'Upgrade or Buy Add-Ons: Insufficient credits, please subscribe to add credits' with 32 leads selected and a balance of 26]] · [[_capture/SLS-60|**Plans & Packages** — Base $69/mo (or $720/yr, save 13%): unlimited routes, up to 50,000 records, mobile CRM, share routes & lists, 2-way CRM sync, **100 credits**. Pro $99/mo (or $999/yr, save 16%): everything in Base, unlimited records, dedicated onboarding, priority support, **180 credits**. Add Credits (non-recurring): 50=$25, 100=$45, 150=$57, 500=$150, 1000=$300]] · [[_capture/ADM-13|Add Business Client — Name, Email, Number Of Licence(s), Payment Period, Cost Per User, 'Credits to be alloted' sic, Billing Name, Billing Email]] · [[_capture/MGR-06|Add Salesperson — Licence Usage bar (10 total / 2 used / 8 left), Name, Phone, Email, Country and a Colour Code picker (default #124ac6, 8 presets) that 'shows on territory maps, avatars, and team views']] · [[_capture/ADM-01|Admin HQ Home — leaderboard + timeframe stats (Logged In, Created Routes, Activity, New Users)]] · [[_capture/MGR-04|AI Find Leads — '5 leads assigned successfully' toast; credits fell 100 → 86 and the list went 264 → 250 (assignment consumes credits; the per-lead rate is not confirmed from this frame)]] · [[_capture/SLS-06|AI Find Leads — 'Adding your leads' modal saving 13 selected leads, 10% progress, 'This usually takes about 10 seconds. Please keep this tab open.']] · [[_capture/SLS-16|AI Find Leads — 'Create or Add to List' modal: Create New List or Add to Existing List ('6 Selected From 80 Leads Found')]] · [[_capture/SLS-08|AI Find Leads — 'Leads Added Successfully' modal: Create or Add to Existing Route / Create or Add to Existing List / Return to Dashboard ('5 Selected From 85 Leads Found')]] · [[_capture/MGR-03|AI Find Leads Step 3 — 264 leads from 2 search areas; select by checkbox or Lasso/Pan, then 'Assign leads' to a salesperson; '100 credits remaining']] · [[_capture/ADM-12|Business Client list — 22 accounts; Approved Licence(s), Cost Per User (varies 10–100), Payment Period; actions Edit / Delete / Salesperson, plus Copy Activation Link + Resend Invitation on pending ones]] · [[_capture/ADM-03|Cancelled subscribers — Cancelled subscriptions (Paid) tab, 58 users, date filter, RevenueCat/Stripe, Access now Yes/No]] · [[_capture/ADM-04|Cancelled subscribers — Cancelled trials (RevenueCat) tab, 7 users on Free Package]] · [[_capture/ADM-08|Convert salesperson — Convert to Manager (Business Client): number of licences, payment period, cost per user, credits to be allotted, billing name/email]] · [[_capture/SLS-10|Create Routes step 1 of 2 — Select Companies to Add, All / Selected tabs, list view with checkboxes, Save as Draft / Map View / Find Leads / Next Step]] · [[_capture/SLS-07|Create Routes step 2 of 2 — Select Start Point / End Point dropdowns over a pin map, Save as Draft / Generate Route]] · [[_capture/SLS-02|Create your account — 'Start your 7-day free trial and get 60 lead credits'; Name, Phone (+1), Email, Password, reCAPTCHA, Start Free Trial; footer 'Free 7-day Trial · Setup in 2 Minutes · No credit card required' and a customer testimonial]] · [[_capture/ADM-16|Edit promotion code — same fields, Code and Discount read-only]] · [[_capture/SLS-46|Find Contacts — 'AGGREGATING CONTACT DATA FROM MULTIPLE SOURCES / **Finding data from Apollo**', 4%; 'You may exit this screen and contacts will load in the background']] · [[_capture/SLS-42|Find Contacts modal (bulk) — companies with available contact counts on the left, a Selected Contacts cart on the right showing **Contacts and Credits counters** before purchase; one row shows a live 'Searching Texas Secretary of State…' lookup]] · [[_capture/ADM-10|Manage Credits — Credit Balance 380 with an Add Credit field]] · [[_capture/MGR-01|Manager's Dashboard — 6 KPI cards, Territory Coverage Map (Zones/Visited/Accounts) with Sales Rep Zones, two Leaderboards (This/Last Week), Real-Time Activity Feed]] · [[_capture/SLS-17|New List — Step 1 name, Step 2 select companies (Selected tab), View on Map / +Company / Find Leads / Submit]] · [[_capture/ST-07|Plan and credits details]] · [[_capture/SLS-61|Plans & Packages step 2 — Payment: promo code, itemised total (Base $69 + 50 Credits $25 = $94), saved or new card, Visa/Mastercard/Discover/Amex, Pay Now]] · [[_capture/ADM-14|Promotion Codes list — 9 codes; Discount Type pricepercent, Discount, Validity ForeverOnce, Usage Limit]] · [[_capture/SLS-62|Purchase confirmation — 'Your subscription has been upgraded with 50 additional credits'; balance 180; subscription history now lists Base Package with a Download Invoice, and Package Add-Ons shows 50 credits / $25]] · [[_capture/RT-41|Review – 2 contacts for 4 credits]] · [[_capture/RT-43|Review – 3 contacts for 5 credits]] · [[_capture/ADM-05|Salespersons list — 1,196 entries; Role/Desire/Tools, AI Find Leads Search, Paywall Stopped, Find Leads Usage, Mobile Login; row actions Edit / Convert / Delete / Manage Subscription / Manage Credits / AI Search History]] · [[_capture/ADM-02|Subscription Dashboard — 8 totals (Paid 109, Income 109430.53, Free Trial 50, Trial Expired 1009, Test 44, Paid Expired 253, Business Clients 10, Business Client Users 50) + Paid Users table]] · [[_capture/ADM-09|Subscription history for a salesperson — Deactivate Subscription / Extend Days / Activate Yelp Leads; active package and duration (15 Sep 2026 → 15 Sep 2041)]] · [[_capture/SLS-35|Subscriptions — subscription history plus **Package Add-Ons history** (credits purchased, amount, date)]] · [[_capture/ADM-18|Support Tickets list — 88 tickets; #Ticket No, Title, Description, Customer Name, Status OpenProcessing, Created / Last Updated, View Detail]]

**Code files (3):** [[_code/web/app/Http/Controllers/CronController.php|CronController]] · [[_code/web/app/Globals/Helper.php|Helper]] · [[_code/web/app/Helpers/helpers.php|helpers]]

%% brain-links:end %%
