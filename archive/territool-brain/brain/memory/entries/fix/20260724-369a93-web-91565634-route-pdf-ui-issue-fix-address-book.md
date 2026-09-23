---
id: VAULT-20260724-369a93
type: fix
status: HISTORICAL
evidence: DOCUMENTED
source: git web@91565634 (commit message + file list)
origin: manual-commit
supersedes: []
superseded_by: []
features: []
flows: []
platforms: [web]
files: [repos/web/resources/manager-portal/AIFindLeads.jsx, repos/web/resources/views/front/company/listnewl.blade.php, repos/web/resources/views/front/company/recentList.blade.php, repos/web/resources/views/front/simpleroute/viewpdf_saved_route_basic.blade.php]
commits: [web@91565634]
relations:
occurrences: 1
first_recorded: 2026-07-24
last_verified: 2026-07-24
verified_against: web@91565634
labels: [git-seed, web]
area: memory
tags: [brain/memory, brain/kind/commit]
ref: "web 91565634 — route pdf ui issue fix, address book ui issue fix"
---

# web 91565634 — route pdf ui issue fix, address book ui issue fix

## What

Commit `91565634` on 2026-07-24 by a team developer: "route pdf ui issue fix, address book ui issue fix". 4 source file(s) changed (3 non-source file(s) ignored).

## Why it matters

No feature mapping in the brain index for these files (the change may be infrastructure, or the index lacks the file).

## Evidence

`git -C repos/web show --stat 91565634` — the commit message is the only statement of intent (DOCUMENTED, not VERIFIED).

## Implication for future work

Map these files to a feature in the brain index before relying on this change for impact analysis.

## Related

- `repos/web/resources/manager-portal/AIFindLeads.jsx`
- `repos/web/resources/views/front/company/listnewl.blade.php`
- `repos/web/resources/views/front/company/recentList.blade.php`
- `repos/web/resources/views/front/simpleroute/viewpdf_saved_route_basic.blade.php`
