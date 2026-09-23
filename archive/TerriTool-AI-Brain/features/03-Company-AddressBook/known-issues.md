---
title: "Company AddressBook — known issues and error messages"
---

# Company AddressBook — known issues and error messages

Part of [03-Company-AddressBook](MODULE.md). Verbatim from the former `07-Operational-Reference/known-issues-and-error-messages.md` (literal strings from the controllers, verified 2026-09-15; split 2026-09-16). Use these when you need the exact string the backend returns. Cross-feature and system-level entries: [engineering/operational-notes.md](../../learnings/operational-notes.md).

## Companies and contacts

| Literal message | When it fires | What to tell the user |
|---|---|---|
| `Company not found.` | Company id referenced doesn't exist or isn't the caller's | Don't assume a transient error — re-check the id/name via `search_companies` first. |
| `Company address or website is required.` | Find Contacts attempted with no website on the company | Add a website to the company, then retry Find Contacts. Search/browse stays free either way. |
| `Invalid report reason.` | Report Company/Contact submitted with a reason outside the allowed set | Use the listed reasons only (wrong address/location, wrong phone, wrong website, business closed, duplicate, something else). |
| `One or more contacts were not found.` | Buy/redeem referenced contact ids that no longer resolve (e.g. already bought, already deleted) | Re-fetch the current contact list before retrying the buy. |
| `Company record has been deleted` | Successful delete confirmation (not an error, but easy to mis-read as one) | This is a success message — don't tell the user something went wrong. |
