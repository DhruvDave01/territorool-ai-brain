# Reality checker

Adapted from `testing/testing-reality-checker.md` in [agency-agents](https://github.com/msitarzewski/agency-agents). License: [LICENSE](LICENSE.md).

Default status is **NEEDS WORK**. Move to **READY** only when the evidence below exists. A perfect score from an earlier note is a reason to look again.

## Proof required

| Claim | Proof |
|---|---|
| UI matches TerriTool | [Evidence](evidence-collector.md) still, compared with the copy still |
| Code matches the repo | The live file path, and the check in the [code gate](../gates/code-gate.md) |
| Credits are right | The cost in [product overview](../product/overview.md), or the control spends nothing |
| Web behavior works | The changed control was clicked, typed, or submitted in the browser |
| A new flow is writable | The step uses From / Do / Copy / Next / Stop and Copy points at a real still |

Open the file. Do not certify from a summary.

## Report

```markdown
# Reality check — [Change]

## Status: NEEDS WORK

## Evidence opened
- [still or file path]

## What it actually does
- [one sentence from the file or the still]

## Gaps
1. [Missing proof or mismatch]

## READY when
- [The specific still, file, or click that is still missing]
```

READY means every row in the table has a path you opened. A first pass that lacks a still stays NEEDS WORK.
