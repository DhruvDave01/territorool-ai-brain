---
id: Lists
parent: design
---
# Lists

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/06-lists/`).

```
Lists (`ios/06-lists/01`)
  → loading “Loading lists…” (VID3)
  → row → ListsDetail (`07`)
  → + → CreateLists (`04`)
  → overflow sheet (`02`): list name, View On Map, Edit List, Generate Route, Delete, Share List

CreateLists / Edit List (`04` / `06`)
  → same chips as Create Route; edit header is the **list name**
  → Map View → **Lasso Selection** (`05`, Archive `20.33.08`)
  → Next Step → SelectStartEndPointsList (`08`)

`03-lists-filter.png` is **legacy FilterList** (teal Filter/Next, red Clear) — do not copy. Live Address Book filter is FilterModule (`ios/10-other/03`, `ios/04-companies/03`).
```

Unread rows use blue highlight. Footer Lists tab selected on list-company view.
