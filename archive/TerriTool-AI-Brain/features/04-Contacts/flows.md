---
title: "Contacts — flows"
---

# Contacts — flows

Part of [04-Contacts](MODULE.md). Credits: [09-Contact-Enrichment-Credits](../09-Contact-Enrichment-Credits/flows.md).

```mermaid
flowchart TD
  Open[Company row or profile] --> Find[Find Contacts 0 cr]
  Find --> Names[FullEnrich then Claude names]
  Names --> Buy{Confirm buy?}
  Buy -->|FullEnrich| C2[2 credits each]
  Buy -->|Claude| C1[1 credit each]
  C2 --> Row[Contact saved]
  C1 --> Row
  Open --> Manual[Create Contact 0 cr]
  Manual --> Row
```

## Mobile flow — ScanCardFlow (added 2026-09-17)

React Native app (`knowledge/architecture/mobile.md`). Entry points: Dashboard tile, Add Company header icon (cross-referenced from [../03-Company-AddressBook/flows.md](../03-Company-AddressBook/flows.md)). No web equivalent and no UC id yet — candidate for a new `UC-CT-06` if this becomes a first-class flow.

1. **Scan Business Card** intro: "Snap a card. Save the lead." + Camera / Gallery capture buttons. ![Scan intro](<evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.27.png>)
2. OS **Photo Library** permission ("Allow Full Access" / "Limit Access…" / "Don't Allow") when using Gallery. ![Photo library permission](<evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.32.png>)
3. System photo picker. Test fixture used throughout this flow: a Microsoft/Bill Gates business card image (QA fixture, not real customer data). ![Photo picker](<evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.37.png>)
4. **Crop business card** — corner-drag crop UI, rotate/flip controls, Cancel / Choose. (2 similar frames — initial crop, adjusted crop) ![Crop](<evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.41.png>)
5. **Card Preview** with **"Reading card…"** status, then **"Reading the card… Usually under 5 seconds"** — OCR/AI extraction in progress; **Remove Card** to restart. ![Reading card](<evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.49.56.png>)
6. **Review details**: "Tap any field to fix a typo or fill what's missing." + **Copy all**. Contact section auto-filled from the card (First Name, Last Name, Position, Email, Phone, LinkedIn) — Email came back empty since the fixture card has none, Phone/Position/Name populated correctly. (2 similar frames — top of form, scrolled to full field list) ![Review contact fields](<evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.50.06.png>)
7. Company section, same review pattern: Company Address, City, Industry Type (blank — not on the card), Website (blank), Full Address, **Save Company & Contact** button. ![Review company fields](<evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.50.10.png>)
8. On submit: **"Saving company… Matching the location and saving the company."** ![Saving](<evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.50.21.png>)
9. Toast **"Company already exists in your database"** when the matched company/location is already in the Address Book — real duplicate-detection behavior, not an error. ![Duplicate detected](<evidence/mobile/ScanCardFlow/Simulator Screenshot - iPhone 17 Pro Max - 2026-09-15 at 19.50.24.png>)

