---
title: "Failed approaches"
---

# Failed approaches

Things agents keep trying that are wrong for TerriTool.

| Approach | Why it fails |
|----------|----------------|
| Implement a feature only in Blade | Mobile + MCP won’t see it |
| Implement a feature only in a MCP tool class | Web/mobile drift; credits can diverge |
| `add_company` for AI search hits | Bypasses save-lead credit and source=`aileads` |
| `search_companies` to “find new leads” | That’s the Address Book |
| Logging Gold/High Priority as a note | Must be `set_company_status` |
| Making a paid action free to “fix” an error | Violates credit bible |
| Hand-editing `public/js/manager-portal.js` | Next `npm run build` overwrites |
| Adding React to Find Leads | No mount/build path |
| Using Laravel 8+ / PHP 8 syntax | Lockfile 5.3.31 / PHP ^7.2 |
| Trusting `database/webterritool.sql` | 2021, 37 tables |
| Querying all MySQL tables for “the schema” | Pulls coffee/bookings PII-ish ops data |
| Full `vendor/bin/phpunit` red means the product is broken | Usually `ExampleTest` hitting `/` → `/login` **500 when MySQL is refused**. Manager helpers can still pass (`--filter Manager`) |
| Treating `npm run test:e2e` as proof | No config/specs |
| Calling v2 with curl from a sales-rep MCP conversation | Contract: use tools |
| Assuming Passport is the MCP auth | Separate `mcp_oauth_*` |
| Renaming `CompanylController` in a bugfix | Massive unrelated diff |
| Treating Find MCP as full product | No routes/lists/visits |
| Treating Admin MCP as Address Book | Read-only HQ |
