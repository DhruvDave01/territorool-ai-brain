---
title: "Contact Enrichment Credits — limits"
---

# Contact Enrichment Credits — limits

Part of [09-Contact-Enrichment-Credits](MODULE.md). Verbatim from the former `07-Operational-Reference/limits-and-performance.md` (verified against code 2026-09-15; split 2026-09-16). Real numbers from code, not estimates. Other features' limits: [engineering/operational-notes.md](../../learnings/operational-notes.md).

## Contacts

Source: `app/UserMcp/Services/Tools/ContactsTools.php`, `app/Http/Controllers/CompanylController.php`.

| Rule | Value | Where enforced |
|---|---|---|
| `find_contacts_bulk` page size | Max **10** companies per call (hard-capped server-side even if a larger `max_companies` is requested) | `ContactsTools.php` |
| `buy_contacts` confirmation threshold | Selecting **more than 25** contacts in one call requires `confirm_all=true` even after the normal per-buy confirm | `ContactsTools::BUY_WITHOUT_CONFIRM_MAX = 25` |
| Find Contacts precondition | `company_website` is **required** — Find Contacts on a company with no website fails validation before any provider is called | `CompanylController.php` (`'company_website' => 'required'`), surfaced as "Company address or website is required." |
| Zip code input | Must be **8 characters or less** | Validation message: "Zipcode must be 8 characters or less." |

**Agent-facing implication:** if the user asks to buy contacts for a large batch (e.g. "buy everyone on this route"), expect a second confirm step past 25 — don't treat the first `confirm_all=true` as sufficient for a >25 batch; the tool will re-ask.
