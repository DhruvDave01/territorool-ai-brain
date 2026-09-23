---
area: memory
tags: [brain/memory]
ref: "Knowledge memory — entry schema (the contract)"
---

# Knowledge memory — entry schema (the contract)

`tools/memory.js lint` enforces this file. An entry that fails it is not knowledge yet.

## File

`brain/memory/entries/<type>/<YYYYMMDD>-<hash6>-<slug>.md`

- **id** `VAULT-<YYYYMMDD>-<hash6>`. The hash is the first 6 hex characters of `sha1(<stable key>)` (owner
  decision F8), so two clones never collide and re-running a capture never duplicates an entry.
  - Register rows: key `<register>:<legacy id>`, date 2026-09-17 (migration day).
  - Commits: key `commit:<repo>:<full sha>`, date = commit date.
  - New entries: key `<type>:<normalised title>`, date = creation day.
- Folders are created only when the first entry of that type exists.

## Frontmatter

```yaml
---
id:               VAULT-20260917-ef8968
legacy_id:        KG-UI8                # only for migrated register rows (the ID everything already cites)
register:         known-fragile         # only for migrated rows: which table renders this row
type:             decision|change|bug|fix|pattern|antipattern|failed-approach|design|parity|api|schema|vocabulary|
                  testing|qa|environment|performance|integration|product|question|conflict|correction|incident|
                  deprecation|regression-link
status:           CURRENT|VERIFIED|OBSERVED|INFERRED|UNKNOWN|CONFLICTED|NEEDS-REVALIDATION|NEEDS-VERIFICATION|
                  HISTORICAL|DEPRECATED|SUPERSEDED|STALE|OPEN|RESOLVED|BROKEN-REFERENCE
status_note:      free text (why OPEN, what is waited on)
evidence:         VERIFIED|VISUAL|DOCUMENTED|INFERRED|UNKNOWN
source:           file:line | screenshot id | git <repo>@<sha> | "USER SAID <date>" | loop state path
origin:           ai-loop|manual-commit|user-statement|audit|qa|incident|review|migration
approver:         owner                 # for user-statement: who decided (a role, never an email)
supersedes:       [ids]
superseded_by:    [ids]
features:         [F11, F12]
flows:            [MF-05]
platforms:        [mobile|web|backend|db|api|integration]
files:            [repos/mobile/App/…, repos/web/app/…]
commits:          [mobile@f20c5aa]      # change / fix entries
relations:        # DEPENDS_ON USED_BY CALLS READS_FROM WRITES_TO TRIGGERS AFFECTS SHARED_WITH TESTED_BY VALIDATED_BY SUPERSEDES RELATED_TO
  - AFFECTS: F11
occurrences:      1                     # recurrence increments this; it never creates a second entry
first_recorded:   2026-09-17            # "≤2026-09-17 (…)" when only an upper bound is known — never invented
last_verified:    2026-09-17
verified_against: mobile@f20c5aa        # or "mobile f20c5aa · web 21d6348c", or "not verified"
labels:           [security]            # our tags; `tags:` belongs to obsidian-sync and is overwritten
---
```

`area`, `tags` and `ref` are added by `tools/obsidian-sync.js`. Leave them alone.

## Body — all sections required

```markdown
# <title>

## What
## Why it matters
## Evidence
## Implication for future work     ← never empty: an entry that only says what happened is an archive
## Register row (verbatim …)        ← migrated rows only: `ROW: | … |` inside a ~~~text fence
## Status history                   ← appended by sync / supersede / occurrences, never rewritten
## Related
```

## Evidence mapping (owner decision, 2026-09-17)

| Old label (evidence ledger) | `evidence` | Notes |
|---|---|---|
| Verified-RT | VERIFIED | |
| Verified-Code | VERIFIED | |
| Verified-Owner | DOCUMENTED | `origin: user-statement`: an owner statement is not independent verification |
| Inferred | INFERRED | |
| anything else | UNKNOWN + `status: NEEDS-REVALIDATION` | never forced into a bucket |

Migration heuristic for other registers:
- **VERIFIED** when the evidence cell cites `file:line`, an `EV-` id or a runtime run.
- **VISUAL** when it cites a screenshot id.
- **DOCUMENTED** otherwise.
- Commit history is always **DOCUMENTED**: a commit message states intent, it doesn't verify it.

## Write-time guards (all blocking)

1. **Secrets and personal data.** No JWTs, keys, private keys, password values or email addresses. Record *what*
   secret is needed and *where* it's configured, never the value.
2. **Duplicates.** `new` looks up the same type and normalised title first. A match increments `occurrences`. To
   change a fact's meaning, use `supersede`.
3. **Provenance.** A `VERIFIED` entry must name something checkable. Cited brain/repo paths and evidence artefacts
   (screenshots, run reports) must exist.
4. **Implication.** At least 10 characters.
5. **No fabrication.** Unknown dates are written as `≤date` with a reason; unverified entries say `not verified`.

## Growth

When a type passes ~200 live entries:
- write a rollup entry for a cluster;
- set the cluster's entries to `status: HISTORICAL` with `RELATED_TO` the rollup;
- move them to `brain/memory/_archive/`.

They stay in git and searchable, and drop out of the default index. Nothing is deleted.

%% brain-links:start %%
<!-- generated by tools/obsidian-sync.js from brain/audits/data/brain-index.json; edits here are overwritten -->

## Linked (7)

**Documents (3):** [[brain/memory/README|Knowledge memory — start here]] · [[.claude/commands/memory-learn|memory-learn]] · [[_code/brain/tools/obsidian-sync.js|Renders the brain index as an Obsidian vault.]]

**Product features (2):** [[_id/F12|Companies (Address Book)]] · [[_id/F11|Lists]]

**App journey (1):** [[_id/MF-05|AI Find Leads]]

**Problem found (1):** [[_id/KG-UI8|Delete-contact sheet survives navigation]]

%% brain-links:end %%
