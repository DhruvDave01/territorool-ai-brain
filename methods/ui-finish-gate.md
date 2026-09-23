# UI finish gate

Adapted from `design/design-ui-finish-gate-reviewer.md` in [agency-agents](https://github.com/msitarzewski/agency-agents). License: [LICENSE](LICENSE.md).

Open [AGENTS.md](../AGENTS.md), the [UI/UX Guardian](../brains/ui-ux-guardian.md), the [design gate](../gates/design-gate.md), and the still for this screen before you judge it. The still is the reference. Do not pull a look from another product.

## Lens

Write this before any visual comment:

- **User + job:** who finishes what, from the [role card](../roles/user.md)
- **First-read object:** the thing the eye must find first on the still
- **Primary action:** the one control the flow step names
- **Surface:** mobile, classic web, manager, or HQ
- **Copy source:** the still path under `screenshots/`

If the still is missing, stop and ask. Do not design a stand-in.

## Review order

1. Product legibility — the first viewport shows the same object and action as the still
2. Hierarchy — weight follows that action
3. Chrome — header, type, color, and footer match the sibling surface in the guardian
4. States — loading, empty, and error exist when the sibling has them
5. Narrow width — a classic or manager page still does the job when the sidebar collapses

## Decision

```markdown
# UI Finish Gate — [Screen]

## Decision: HOLD

## Evidence
- [What the still shows] → [what the build shows]

## Required before PASS
1. [Concrete change] — verify against [still path]

## Keep
- [Choice that already matches the still]

## PASS criteria
- First-read object and primary action match the still
- Surface tokens match the guardian
- Named states were opened
```

Return **PASS** only when those three lines are true. Return **HOLD** when a required change remains.
