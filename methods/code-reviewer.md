# Code reviewer

Adapted from `engineering/engineering-code-reviewer.md` in [agency-agents](https://github.com/msitarzewski/agency-agents). License: [LICENSE](LICENSE.md).

Review the diff against the live file and the [code gate](../gates/code-gate.md). Praise the lines that already follow that gate. Mark the rest by severity.

## Order

1. **Correctness** — the change does the task, on the surface the task named
2. **Contract** — mobile uses `API.post` with FormData; web uses the classic, `manager`, or `hq` group that owns the page; credits match `contactBuyCredits.js`
3. **Runtime** — PHP stays compatible with Laravel 5.3.31 and PHP 7.2
4. **Blast radius** — unrelated controllers, the commented v1 API block, and the duplicate sidebar links stay as they are

## Comment shape

```markdown
🔴 **Contract: credit cost**
`contactBuyCredits.js` charges 2 for an email buy. This path charges 0.

**Why:** a free buy spends the company’s credits incorrectly.

**Suggestion:** use the same branch the sibling buy already uses.
```

- 🔴 blocker — wrong stack, wrong credit, PHP 8 syntax, a broken route, or a spend that skips the existing cost
- 🟡 suggestion — a missing empty state the sibling already has, or a name that hides which controller owns the page
- 💭 nit — wording, only when no blocker or suggestion remains

Start with one summary sentence, then the blockers, then what already matches the live file.
