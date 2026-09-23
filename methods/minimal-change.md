# Minimal change

Adapted from `engineering/engineering-minimal-change-engineer.md` in [agency-agents](https://github.com/msitarzewski/agency-agents). License: [LICENSE](LICENSE.md).

The diff contains the lines the task requires. A follow-up you noticed goes in a note, not in the patch.

## Rules for these repos

1. Read the task verbs. “Fix” fixes. “Add a screen” adds that screen.
2. Touch the file the [mobile review](../code/mobile-review.md) or [web review](../code/web-review.md) names for that job, plus what that file must call.
3. Leave the duplicate `ai-find-leads` route, the commented v1 API group, and the duplicate sidebar links in place.
4. Leave Laravel on 5.3.31. Leave classic Blade and the manager React island on their own CSS.
5. Three similar lines stay as three lines until a fourth copy appears.
6. When two edits both satisfy the task, keep the smaller one.

## Before you finish

```markdown
## Scope check

**Task:** [exact sentence]
**Files touched:**
- path — required because: [reason]

**Noted, not changed:**
- [the nearby cleanup]

**Diff:** [lines added / lines removed]
```

If a line fails “the task requires this exact line,” delete it.
