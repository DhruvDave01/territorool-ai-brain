---
id: VAULT-20260805-8ce99f
type: change
status: HISTORICAL
evidence: DOCUMENTED
source: git web@b43bb084 (commit message + file list)
origin: manual-commit
supersedes: []
superseded_by: []
features: []
flows: []
platforms: [web]
files: [repos/web/app/Exceptions/Handler.php, repos/web/app/Providers/AppServiceProvider.php, repos/web/config/services.php, repos/web/resources/views/front/android_layout.blade.php, repos/web/resources/views/front/company/layout_main.blade.php, repos/web/resources/views/front/layout.blade.php]
commits: [web@b43bb084]
relations:
occurrences: 1
first_recorded: 2026-08-05
last_verified: 2026-08-05
verified_against: web@b43bb084
labels: [git-seed, web]
area: memory
tags: [brain/memory, brain/kind/commit]
ref: "web b43bb084 — posthog added and clarity removed"
---

# web b43bb084 — posthog added and clarity removed

## What

Commit `b43bb084` on 2026-08-05 by a team developer: "posthog added and clarity removed". 6 source file(s) changed (1 non-source file(s) ignored).

## Why it matters

No feature mapping in the brain index for these files (the change may be infrastructure, or the index lacks the file).

## Evidence

`git -C repos/web show --stat b43bb084` — the commit message is the only statement of intent (DOCUMENTED, not VERIFIED).

## Implication for future work

Map these files to a feature in the brain index before relying on this change for impact analysis.

## Related

- `repos/web/app/Exceptions/Handler.php`
- `repos/web/app/Providers/AppServiceProvider.php`
- `repos/web/config/services.php`
- `repos/web/resources/views/front/android_layout.blade.php`
- `repos/web/resources/views/front/company/layout_main.blade.php`
- `repos/web/resources/views/front/layout.blade.php`
