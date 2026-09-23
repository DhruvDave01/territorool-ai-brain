---
title: "Operational notes (cross-feature)"
---

# Operational notes (cross-feature)

What was left of the former `07-Operational-Reference/` after its per-feature sections moved beside their modules on 2026-09-16. Verified against code / the live database on 2026-09-15.

## Where the feature-specific sections went

| Section | Now at |
|---|---|
| Limits — AI Find Leads (Google Places + Gemini pipeline) | [05-Find-Leads/limits.md](../features/05-Find-Leads/limits.md) |
| Limits — Contacts | [09-Contact-Enrichment-Credits/limits.md](../features/09-Contact-Enrichment-Credits/limits.md) |
| Limits — Route builder | [07-Routes/limits.md](../features/07-Routes/limits.md) |
| Limits — MCP / catalog | [20-MCP/limits.md](../features/20-MCP/limits.md) |
| Errors — Credits and spending | [09-Contact-Enrichment-Credits/known-issues.md](../features/09-Contact-Enrichment-Credits/known-issues.md) |
| Errors — Find Leads / AI search | [05-Find-Leads/known-issues.md](../features/05-Find-Leads/known-issues.md) |
| Errors — Companies and contacts | [03-Company-AddressBook/known-issues.md](../features/03-Company-AddressBook/known-issues.md) |
| Errors — Route generation | [07-Routes/known-issues.md](../features/07-Routes/known-issues.md) |

## Source note for the error-message tables

**Source note:** these entries are pulled from actual error strings and validation rules in `app/Http/Controllers/CompanylController.php`, `AILeadFinderController.php`, and `RoutesController.php` — verified in the code on 2026-09-15, not from a support-ticket export. This is the code's side of "what goes wrong." It is **not** a replacement for a real FAQ built from actual support tickets (`SupportController` / `/support`), which would add the human side (what users actually got confused by, how it was resolved, whether it recurred). If a support-ticket export becomes available, add a "Reported by users" section below each entry rather than replacing this file.

Use this instead of `api-surfaces.md` §4 when you need the **literal string** the backend returns, not just the category of error.

## System / config errors

| Literal message | When it fires | What to tell the user |
|---|---|---|
| `API keys not configured` (HTTP 500) | A provider integration (Places/Gemini/FullEnrich) is missing its key in this environment | This is an operator/config problem, not a user mistake — don't ask the user to "fix" anything; escalate to the team. |
| `Unauthorized.` | Session/token invalid for the attempted action | Prompt re-login (web) or re-auth the MCP/OAuth session — don't retry the same call silently. |
| `invalid request` | Malformed payload reached a controller (wrong shape, missing required field) | Usually an integration bug, not something a chat user caused directly — check the calling tool's arguments. |

## Not yet measured (flag for a real load/perf pass)

These aren't in the code as fixed constants and would need a staging measurement, not a grep — don't state numbers for them without testing:

- Typical wall-clock time for a full AI Find Leads run under the 600s ceiling (varies by territory size and business-type breadth).
- CSV import: no hard row-count cap found in the request validation for `uploadcompany`/`uploadcontact` — large files rely on PHP's `upload_max_filesize`/`post_max_size` (server config, not app code) plus browser upload time.
- Concurrent-user behavior on the Manager dashboard `/api/*` endpoints (no rate limiting middleware found on the `manager` route group).

## Support tickets: real data pulled, but it's not usable as a customer-voice corpus

MySQL came up mid-session, so this was actually queried this time — `support_ticket` on the local `territool` database, 155 rows, **titles and status only** (no `description`, no `user_id` pulled, to stay clear of any PII before this was even reviewed).

**Finding:** this table is overwhelmingly QA/dev test noise, not real customer tickets. Status breakdown: 64 Open, 14 Processing, 77 with an empty status. Scanning titles by length, the large majority are empty or garbage strings — `test`, `cvbbb`, `sdfas`, `HELPPP!!!`, `Dec Test`, `Dev test`, `yesye`. Out of all 155 rows, only **three** titles read as genuine product feedback:

- "Route generation issue found"
- "Facing issue when click on subscription button"
- "Final new changes check"

That's too thin to build a real "recurring confusions" section from — three short phrases with no description or resolution attached don't tell you *why* route generation failed or *what* broke on the subscription button. **This environment's `support_ticket` table is a staging/dev database, not a production support export.** If you want the real version of this section, pull `title` + `description` (skip `user_id`, redact anything that looks like an email/phone in `description`) from **production**, not this local/staging copy — that's the one likely to hold actual customer language worth mining.

## Also flagged while querying this database

The same database (`territool`) contains tables with no relationship to TerriTool at all — `coffee_orders` (3,436 rows), `bookings` (6,002 rows), and related tables — see [data-model-reference.md](../knowledge/code/data-model-reference.md#important-this-database-is-not-exclusively-territools-data). Worth raising with whoever owns the database; it's out of scope for this pack either way.
