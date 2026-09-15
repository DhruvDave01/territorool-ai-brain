---
id: Enrichment-and-Credits
parent: design
---
# Enrichment and credits

VID1 + `IMG_4581`–`4585`.

```
Company Find Contacts
  → subscription check (upgrade path deferred)
  → FindContactsFetchModal primary (Apollo.io)
      → Checking Apollo / Still working / Taking longer
      → rows → CongContact
      → 0 rows → secondary sources (Manta, LoopNet, Tripadvisor, SBA, Yelp, ZoomInfo, …)
      → Show Contacts → bizContacts
      → empty → Done (IMG_4582)
  → save → toast, green check, Refresh Contacts
Credits pill decrements (VID1 2947→2943)
```

Report company: `IMG_4579`–`4580` (refunds on success in API comments).
