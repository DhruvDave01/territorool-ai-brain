---
title: "Refactoring loop"
---

# Refactoring loop

```text
Identify Problem
    ↓
Understand Current Behavior
    ↓
Identify Constraints
    ↓
Plan Refactor
    ↓
Make Small Change
    ↓
Run Tests
    ↓
Compare Behavior
    ↓
Continue
```

Constraints: [../product/constraints.md](../product/constraints.md), [../knowledge/conventions.md](../knowledge/conventions.md).

## Rules for this codebase

- One small step at a time. Re-run the behavior you are preserving after each step.
- Do not rename `CompanylController`.
- Do not extract a service layer opportunistically.
- Do not mix frontend stacks.
- Do not reformat a whole hot file.
- Shared behavior must remain shared (web / v2 / MCP).

If the “refactor” would change credits, publish rules, or client drift, it is a **feature** — use [feature-loop.md](feature-loop.md).
