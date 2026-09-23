---
id: Enrichment-and-Credits
parent: design
---
# Enrichment and credits

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/04-companies/` + `ios/05-contacts/`).

VID1 + `IMG_4581`–`4585`.

```
Company Find Contacts
  → subscription check (web-billed Settings Upgrade is a website handoff — [Subscription.md](Subscription.md))
  → FindContactsFetchModal primary (Apollo.io)
      → Checking Apollo / Still working / Taking longer (`20.15.04` “Checking Apollo…”)
      → rows → CongContact
      → 0 rows → **Search secondary database**
      → Show Contacts → bizContacts
      → empty → Done (IMG_4582)
  → save → toast, green check, Refresh Contacts
Bulk route Find Contacts (`20.08.59`): “Nothing is charged until you confirm.” Footer quotes **N selected · N credits** (this pack: 2 contacts → 4 credits = 2 per paid contact). Wait for confirm — matches [09-credits-billing.md](../../09-credits-billing.md).
Credits pill decrements (VID1 2947→2943; this pack header 8392 → 8383 after buys)
```

Report company: `IMG_4579`–`4580` (refunds on success in API comments).
