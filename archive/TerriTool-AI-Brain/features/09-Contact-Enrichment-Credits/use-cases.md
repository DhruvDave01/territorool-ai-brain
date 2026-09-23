---
title: "Contact Enrichment Credits — use cases"
---

# Contact Enrichment Credits — use cases

Part of [09-Contact-Enrichment-Credits](MODULE.md). Verbatim from the former `03-Use-Cases/use-cases.md` (split 2026-09-16). Actors and global chrome: [use-cases-overview.md](../../product/use-cases-overview.md). Evidence: [evidence.md](evidence.md).

See also: [04-Contacts](../04-Contacts/use-cases.md), [03-Company-AddressBook](../03-Company-AddressBook/use-cases.md)

## 8. Contacts

Find Contacts looks up people via **FullEnrich** or **Claude**. Buying those contacts is **not free**.

### UC-CT-01 Find contacts for a company

Profile or row → Find Contacts. Live providers: **FullEnrich** (primary), then **Claude** if FullEnrich is empty. Names shown; bulk tool `find_contacts_bulk` is counts only (max 10/page).

### UC-CT-02 Buy / fetch contacts

After preview, confirm. Cost: **2 credits** if the row is from FullEnrich, **1 credit** if from Claude (`buy_contacts`). Never free. Insufficient credits → add-on.
