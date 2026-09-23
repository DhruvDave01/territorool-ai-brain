---
id: VAULT-20260729-8f220f
type: change
status: HISTORICAL
evidence: DOCUMENTED
source: git web@e9996157 (commit message + file list)
origin: manual-commit
supersedes: []
superseded_by: []
features: []
flows: []
platforms: [web]
files: [repos/web/app/AdminMcp/database/migrations/2026_07_06_120000_create_mcp_oauth_tables.php, repos/web/app/AdminMcp/database/migrations/2026_07_22_090000_add_mcp_oauth_columns_to_sales_desk_users.php, repos/web/app/AdminMcp/database/migrations/2026_07_27_090000_add_mcp_refresh_columns_to_sales_desk_users.php]
commits: [web@e9996157]
relations:
occurrences: 1
first_recorded: 2026-07-29
last_verified: 2026-07-29
verified_against: web@e9996157
labels: [git-seed, web]
area: memory
tags: [brain/memory, brain/kind/commit]
ref: "web e9996157 — Remove migration files"
---

# web e9996157 — Remove migration files

## What

Commit `e9996157` on 2026-07-29 by a team developer: "Remove migration files". 3 source file(s) changed.

## Why it matters

No feature mapping in the brain index for these files (the change may be infrastructure, or the index lacks the file).

## Evidence

`git -C repos/web show --stat e9996157` — the commit message is the only statement of intent (DOCUMENTED, not VERIFIED).

## Implication for future work

Map these files to a feature in the brain index before relying on this change for impact analysis.

## Related

- repos/web/app/AdminMcp/database/migrations/2026_07_06_120000_create_mcp_oauth_tables.php — historical path at web@e9996157; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/AdminMcp/database/migrations/2026_07_06_120000_create_mcp_oauth_tables.php)
- repos/web/app/AdminMcp/database/migrations/2026_07_22_090000_add_mcp_oauth_columns_to_sales_desk_users.php — historical path at web@e9996157; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/AdminMcp/database/migrations/2026_07_22_090000_add_mcp_oauth_columns_to_sales_desk_users.php)
- repos/web/app/AdminMcp/database/migrations/2026_07_27_090000_add_mcp_refresh_columns_to_sales_desk_users.php — historical path at web@e9996157; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/AdminMcp/database/migrations/2026_07_27_090000_add_mcp_refresh_columns_to_sales_desk_users.php)
