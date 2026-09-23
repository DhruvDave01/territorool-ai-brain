---
title: "Skill: Understand repository"
name: territorool-understand-repo
description: >-
  Map this TerriTool checkout before changing it. Use on a new task or unknown
  area — stack, clients, use cases, risks.
---

# Skill: Understand repository

## Input

- Repository (this checkout)
- Task / context (feature, bug, or question)

## Output

- Architecture understanding (which stack, which client)
- Relevant components (files, UCs, flows)
- Risks (credits, dual-stack, Laravel version conflict)
- Unknowns list

## Rules

1. Read [`../README.md`](../README.md) and [`../knowledge/architecture.md`](../knowledge/architecture.md) if this is a new session. Discovery dump: [`../discovery-report.md`](../discovery-report.md).
2. Investigate **before** modifying.
3. Cite actual files. Use `knowledge/code/CODEMAP.md` and `knowledge/code/ROUTEMAP.md`.
4. Distinguish facts from assumptions. Write `UNKNOWN — needs verification` instead of filling gaps.
5. Check frontend stack **first** ([frontend.md](../knowledge/architecture/frontend.md)).
6. Check whether the behavior must exist on web + v2 + MCP (one product).
7. New or redesigned UI: [design-ui.md](design-ui.md) before implement.
8. Write missing facts into **this Brain**, or `UNKNOWN — needs verification`. Do not start a second pack.
9. Do not treat this Brain as a substitute for reading the controller you will edit.

## Procedure

1. Name the user goal in product language.
2. Find UC + UI flow.
3. List candidate controllers from CODEMAP.
4. Confirm routes in ROUTEMAP / `routes/*.php`.
5. Note tests, MCP tools, and credit impact.
6. Stop and report risks before planning code.
