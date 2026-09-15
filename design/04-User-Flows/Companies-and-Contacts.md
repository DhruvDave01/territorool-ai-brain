---
id: Companies-and-Contacts
parent: design
---
# Companies and contacts

## Address Book

`IMG_4595` Companies, `IMG_4596` Contacts, VID3 filter + contacts spinner.

```
ListCompany
  → Companies tab → row → ViewCompany (Add To, not Mark)
  → + menu: Add Company | Find Leads
  → filter → FilterModule (city/zip/industry/revenue/employees/A-Z/availability/status)
  → Contacts tab → ContactsView / ContactsCreate
```

## Add Company (VID2)

```
Dashboard Add Company
  → Search autocomplete “Searching…”
  → pick suggestion → fields fill
  → Add Company (dimmed)
  → success toast → company view (pager 1/N)
  → More Info (hours; Closed in red)
  → Call → iOS action sheet
  → pencil → EditCompany → back
```

Manual tab: `IMG_4588`.

## Company workspace (route vs book)

| Context | parent_screen | Unique CTAs |
| --- | --- | --- |
| Address Book | ViewCompany | **Add To** |
| Route/list stop | CompanyView | **Mark/Unmark**, **Mark Visited** |

Shared: More Info, Call, Navigate, Add Contact, Find Contacts, Add Activity.

## Add / view contact

`IMG_4599`–`4600`, `IMG_4598`, VID3 Dora Liu (Email disabled when missing).

Delete uses danger styling. Add To on contact shares similar chooser pattern (code).
