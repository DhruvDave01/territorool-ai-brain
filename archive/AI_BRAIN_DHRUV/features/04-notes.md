---
id: 04-notes
parent: features
related:
  - features/03-companies.md
  - features/05-activities.md
  - 07-vocabulary.md
---
# Feature: Notes

Related: [03-companies](03-companies.md) · [05-activities](05-activities.md) · [07-vocabulary](../07-vocabulary.md)

## What it does

Free-text notes on a company. Newest first. **Not** a person, not a status, not a visit CRM event.

## APIs

| Constant | Path |
|----------|------|
| `URL_GET_COMPANY_NOTE` | `getnotes` |
| `URL_SAVE_NOTE` | `addnote` |
| `URL_UPDATE_NOTES` | `updatenote` |
| `URL_DELETE_NOTES` | `deletenote` |

Legacy: `updatecompanynotes`, `updatecontactnotes`.

Table: `company_notes`. UI lives in `CustomCompany` and contact screens.

## MCP

- `add_note` → api `addnote`
- `get_notes` → `getnotes`

Do not use `add_note` for a named person (`add_contact`), a pipeline label (`set_company_status`), or “I visited X” (`add_activity` Visit).
