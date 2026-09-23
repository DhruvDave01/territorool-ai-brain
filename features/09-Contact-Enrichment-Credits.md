# 09 — Contact Enrichment and Credits

## Purpose

Look up people at a company and **buy/fetch** them with credits. Buy contacts is **not free**. The same credit wallet is used to save AI leads.

**Live fetch services (only these two):**

| Service | Credits per contact |
|---------|---------------------|
| **FullEnrich** | **2** |
| **Claude** | **1** |

No other contact-fetch provider is running (not Apollo, Cognism, OpenCorporates, or Bizpedia).

## Who

Sales Agent (own credits). Business Sales Agent (credits allocated by the manager).

## Credit economics (identical on every client)

| Action | Credits |
|--------|---------|
| Save AI lead | 1 per company |
| Fetch/buy contact via **FullEnrich** | **2** per person |
| Fetch/buy contact via **Claude** | **1** per person |
| Search leads, list companies, bulk **counts** | 0 |

There is **no free redeem** on a contact buy. Claude at 1 credit is still a paid buy.

Review rewards sit outside this table. G2 grants 30 and Product Hunt grants 20 after verification. Opening the review does not deduct credits and does not add them. Mobile sheet and web page: [02 — Dashboard](02-Dashboard.md).

If `used + cost > total` → Sales Agent: upgrade / add-on. Business Sales Agent: contact manager. Remaining credits = total − used.

## Where Find Contacts starts

- Company detail (website required; user is asked to add one if missing)
- Address Book bulk selection
- A route stop
- A Find Leads result
- MCP / voice (`find_contacts` then `buy_contacts`; see api-surfaces.md)

## Providers (live)

| Provider | Role | Credits |
|----------|------|---------|
| **FullEnrich** | Primary lookup by domain/address; can complete later via webhook | **2** per contact bought |
| **Claude** | Secondary when FullEnrich returns nobody | **1** per contact bought |

## Single company

1. Find Contacts
2. Need website → save it → retry
3. Preview people (name, title, email, phone, location) from FullEnrich, or Claude if FullEnrich is empty
4. Load More pages as needed
5. Select → confirm credits (**2** FullEnrich / **1** Claude) → buy
6. Contacts saved (default Unclassified), credits deducted

Redeem can run in the background; the user waits on progress until the provider webhook finishes.

## Bulk Contacts

1. Select companies
2. See available contact **counts** (counts are not a buy)
3. Optional Claude counts
4. Pick companies/people
5. Buy as a batch with progress (**2** FullEnrich / **1** Claude)
6. Primary vs secondary contact marking is supported

## Wallet

- `total_credit` / `used_credit` on a billing window (`date`)
- Paid plans refresh on the subscription anniversary day-of-month
- Extra packs: credits add-on
- Admin or manager can grant credits

## Rules

- Never treat buy/fetch contacts as free.
- FullEnrich buy = **2** credits; Claude buy = **1** credit; apply on **every** redeem path.
- FullEnrich is async; wait for progress + webhook.
- BSA empty wallet → manager message, not Stripe.

## Code

`CompanylController` buy/bulk/Claude, `RoutesController` fetch-on-map, `ClaudeContactFinderService`, `BuyContactsBulkJob`, `RedeemFullEnrichBulkJob`, FullEnrich webhooks, `UserCredit`, `UserContactsCredit`.

## Related

**Modules** — 03-Company-AddressBook, 04-Contacts, 05-Find-Leads, 07-Routes, 12-Subscription-Payments, 16-Manager-Portal, 17-Admin-HQ, 19-Cron-Jobs-Webhooks, 18-Clients

**This feature** — Use cases, Flows, Limits, Known issues

**MCP** — 20-MCP, tool contract in api-surfaces.md

**Code** — ROUTEMAP.md (look for `CompanylController`, `RoutesController`, `WebhookController`), CODEMAP.md, engineering/README.md

**Terms / roles** — glossary.md, roles.md, OVERVIEW.md

## Screens

Per surface. "File" is under `TerriTool/App/components/` for mobile; the full map is [mobile screens](../code/mobile-screens.md). Strings are copied from code on 2026-09-22; a loading cell that reads `screen.x.loading` is the `testID` on that screen's `ActivityIndicator`. Copy these strings; do not write new ones.

| Surface | Screen | File / still | Primary action | Loading | Empty | Error |
|---|---|---|---|---|---|---|
| Mobile | Buy on `ContactsView` | `contacts/view.js` | Buy details (2 credits, 1 on the Claude/biz path) | `screen.contactsView.loadingB`; provider marks from `assets/images/mobile/fetchSources` | "No contacts found for this company." | "Failed to load contacts."; "We are trying to find a mobile number for you. Please try again." |
| Mobile | Credits pill and Settings card | `customheader/index.js`, `dashboard/editstatus.js` · [Setting](<../screenshots/mobile-owner/Setting/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.37.23.png>) | Buy extra credits (opens web) | header fetch on mount | — | — |
| Classic web | `/subscription` credits add-ons | feature-evidence 09 flows | Buy add-on | `#cover-spin` | — | Stripe error text |
| Manager | Credit allocation on `/manager/salespeople/{id}` | [Edit salesperson](../screenshots/web-owner/Manager/Edit-Salesperson-TerriTool-09-15-2026_01_27_PM.png) | Allocate credits | "Loading…" | — | Toast on `#manager-toast-root` |

Costs are the constants in `App/utils/contactBuyCredits.js`. Confirm with `AppConfirmModal` before any spend.

## Screenshots in this brain

Open the image before drawing UI. The filename is a capture time, not a layout spec. Pixels win.

- [IMG_4581.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4581.PNG>)
- [IMG_4582.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4582.PNG>)
- [IMG_4583.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4583.PNG>)
- [IMG_4584.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4584.PNG>)
- [IMG_4585.PNG](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/IMG_4585.PNG>)
- [Screenshot 2026-09-14 at 9.27.38 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.27.38 AM.png>)
- [Screenshot 2026-09-14 at 9.28.42 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.28.42 AM.png>)
- [Screenshot 2026-09-14 at 9.28.56 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.28.56 AM.png>)
- [Screenshot 2026-09-14 at 9.29.04 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.29.04 AM.png>)
- [Screenshot 2026-09-14 at 9.29.19 AM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-14 at 9.29.19 AM.png>)
- [Screenshot 2026-09-15 at 1.04.44 PM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-15 at 1.04.44 PM.png>)
- [Screenshot 2026-09-15 at 1.53.47 PM.png](<../screenshots/feature-evidence/09-Contact-Enrichment-Credits/evidence/Screenshot 2026-09-15 at 1.53.47 PM.png>)
- 12 more stills are in `../screenshots/feature-evidence/09-Contact-Enrichment-Credits/`.

## Generate from this brain

- UI rule: [UI/UX Guardian](../brains/ui-ux-guardian.md)
- Screenshot method: [screenshot review](../screenshots/REVIEW.md)
- Mobile implementation: [mobile code review](../code/mobile-review.md)
- Web implementation: [web code review](../code/web-review.md)
- Role: [User](../roles/user.md) · [Manager](../roles/manager.md) · [Admin](../roles/admin.md)
