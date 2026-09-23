---
title: "Loops"
---

# Loops

Loops are **repeatable engineering processes**. Skills are the steps inside them. Protocol: [execution-protocol.md](execution-protocol.md). All of them live in this Brain — do not keep a second process doc.

| Loop | When | Primary agent (target) |
|------|------|------------------------|
| [execution-protocol.md](execution-protocol.md) | Every non-trivial task | All |
| [feature-loop.md](feature-loop.md) | New or changed behavior | Claude |
| [bug-loop.md](bug-loop.md) | Defect | Claude |
| [ui-loop.md](ui-loop.md) | User-visible change | Claude + Playwright |
| [qa-loop.md](qa-loop.md) | QA a named flow or new feature (may not change code) | Claude + Playwright |
| Wiki ingest / lint | After a source or when the Brain may be stale | [../skills/wiki.md](../skills/wiki.md) |
| [refactoring-loop.md](refactoring-loop.md) | Structure without behavior change | Claude |
| [pr-loop.md](pr-loop.md) | Review, CI, merge hygiene | **Codex** |
| [release-loop.md](release-loop.md) | Ship | Human; Claude assists. CI **absent** |

New or redesigned UI: fill [../ui-flows/SCREEN-SPEC.md](../ui-flows/SCREEN-SPEC.md) with [../skills/design-ui.md](../skills/design-ui.md) **before** the feature loop implements.

Claude: Understand → Plan → Execute → Verify → Learn.  
Codex: take a verified implementation and make it merge-ready.

Cursor skills: `.cursor/skills/territool-*-loop`, `.cursor/skills/territool-design-ui`, `.cursor/skills/territool-wiki`, `.cursor/skills/territool-learn`.  
Claude Code skills: `.claude/skills/territool-*`.

Large tasks: dispatch explore vs implement vs review — [execution-protocol.md](execution-protocol.md) (Subagents).
