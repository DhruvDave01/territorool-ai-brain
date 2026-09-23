---
id: VAULT-20260917-c24f7a
type: environment
status: CURRENT
evidence: DOCUMENTED
source: "USER SAID 2026-09-17 · .gitignore (brain/assets/videos/ ignored)"
origin: user-statement
approver: owner
supersedes: []
superseded_by: []
features: []
flows: []
platforms: []
files: [brain/assets/videos]
relations:
occurrences: 1
first_recorded: 2026-09-17
last_verified: 2026-09-17
verified_against: not verified
labels: [assets, backup]
area: memory
tags: [brain/memory]
ref: "brain/assets/videos is the only copy of the visual ground truth"
---

# brain/assets/videos is the only copy of the visual ground truth

## What

The 1.1 GB of screen recordings are outside git. Frames can be re-extracted from them; nothing regenerates the videos. The owner backs them up.

## Why it matters

A lost video cannot be recovered from git or from frames.

## Evidence

USER SAID 2026-09-17 · .gitignore (brain/assets/videos/ ignored)

## Implication for future work

Flag any operation that touches brain/assets/videos before doing it; never move, rewrite or delete there without the owner.

## Related

—
