---
id: Companies-and-Contacts
parent: design
---
# Companies and contacts

Stills: [Mobile screenshot flow](../06-Coverage/Mobile-Screenshot-Flow.md) (`ios/04-companies/` + `ios/05-contacts/`).

## Address Book

`IMG_4595` Companies, `IMG_4596` Contacts, VID3 filter + contacts spinner, Archive `AddressBookFlow/` (42.32), `ios/04-companies/`.

```
ListCompany (`01` Companies · `02` Contacts)
  → Companies tab → row → ViewCompany (Add To, not Mark). Empty activity: “No activities yet. Tap "Add Activity" below…”
  → trash after multi-select → **Delete companies**
  → + menu (`04`): Add Company | Find Leads
  → filter → FilterModule (`03`, also `ios/10-other/03`) — City/Zip/Industry/Revenue/Employees + “Scroll for more”
  → Contacts tab → ContactsView / ContactsCreate
```

## Company workspace (route vs book)

| Context | parent_screen | Unique CTAs | Still |
| --- | --- | --- | --- |
| Address Book | ViewCompany | **Add To** sheet (`09`): Create or Add to Existing Route / List | `08`–`11` More Info / Add To / Navigate / Find Contacts |
| Route/list stop | CompanyView | **Mark/Unmark**, **Mark Visited** | Navigate = **Get directions** Apple Maps / Google Maps / Not now (`10`) |

Activity card (`12`–`14`): Today / Upcoming / Past counts; empty Today “No activities today.” CTAs **Add Activity** / **Mark Visited**. Visited Times sheet (`16`): visit count + trash rows.

`20-biz-companies.png`: title **Company Contact**, company chip, empty “No companies found.”

## Add / view contact

`ios/05-contacts/`: View (`01`), Create (`02`), **Update Contact** (`03` — Select Contact Status + First/Last/Position/Phone/Mobile/LinkedIn/Company), CongContact (`04`), bizContacts (`05`), Report (`06`).

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

Manual tab: `IMG_4588`. Search autocomplete + **Add more details** (industry, revenue, LinkedIn) Archive `AddCompany/19.51.26`. Success toast then company view with **Loading contacts…** / **Loading activities…** (`19.52.11`).

Manual tab: `IMG_4588`. Search autocomplete + **Add more details** (industry, revenue, LinkedIn) Archive `AddCompany/19.51.26`. Success toast then company view with **Loading contacts…** / **Loading activities…** (`19.52.11`). Shared CTAs: More Info, Call, Navigate, Add Contact, Find Contacts, Add Activity.

Delete uses danger styling. Add To on contact shares similar chooser pattern (code).
