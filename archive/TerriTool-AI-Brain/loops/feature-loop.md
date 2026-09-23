---
title: "Feature loop"
---

# Feature loop

**Requirement → Understand product → Identify use case → Identify UI flow → (new/redesigned UI: screen spec) → Trace code → Plan → Implement → Unit/integration tests → Playwright/UI verification → QA report if the human asked → Review → PR → CI → Product verification → Update this Brain**

| Step | Skill / doc |
|------|-------------|
| Understand product | [../product/overview.md](../product/overview.md), feature `MODULE.md` |
| Use case | [../use-cases/README.md](../use-cases/README.md) |
| UI flow | [../ui-flows/README.md](../ui-flows/README.md) |
| New or redesigned screen | [../skills/design-ui.md](../skills/design-ui.md) + [SCREEN-SPEC.md](../ui-flows/SCREEN-SPEC.md) **before** implement |
| Trace | [../skills/trace-feature.md](../skills/trace-feature.md) |
| Plan + implement | [../skills/implement.md](../skills/implement.md) |
| Tests | [../skills/test.md](../skills/test.md) |
| UI | [../skills/verify-ui.md](../skills/verify-ui.md) |
| Review / PR | [pr-loop.md](pr-loop.md) (Codex) |
| CI | **None in repo** — record as skipped, do not invent green |
| Product verification | Same UC on web and, if shared, v2/MCP |
| Learn | Update `MODULE.md`; wiki ingest [../skills/wiki.md](../skills/wiki.md) |

Stop if the requirement would change credit costs or one-product rules without an explicit product decision.

If the human asked to QA the new behavior, finish with [qa-loop.md](qa-loop.md).

Protocol wrapper: [execution-protocol.md](execution-protocol.md).
