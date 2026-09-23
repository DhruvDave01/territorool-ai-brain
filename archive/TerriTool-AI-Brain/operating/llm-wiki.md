---
title: "LLM Wiki — this Brain"
---

# LLM Wiki — this Brain

Pattern: [Karpathy, LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). Instantiated **inside** `TerriTool AI Brain/`. Do not create a second `wiki/` pack.

The gist is the idea. This file is TerriTool’s schema.

## Three layers

| Layer | Here | Rule |
|-------|------|------|
| **Raw sources** (immutable) | Laravel/React **code** in the repo; `features/*/evidence/` and `evidence/` screenshots/video; `composer.lock`; staging product | Agents **read**. Do not rewrite a PNG or the lockfile to “fix” the wiki. |
| **Wiki** (LLM maintains) | This folder’s markdown: `features/*/MODULE.md`, use cases, flows, knowledge, memory, learnings, validation | Agents **write** after ingest, query, or lint. Humans read. |
| **Schema** | [AGENTS.md](../AGENTS.md), this file, [skills/wiki.md](../skills/wiki.md) | How to ingest / query / lint without drifting. |

`index.md` is the catalog. `log.md` is the timeline. Graph view: open this folder in Obsidian, or [tools/brain-map](../tools/brain-map/) (`dist/territool-ai-brain-map.html`).

## How pages connect

One product fact should be reachable from every layer. Ingest updates the **owning** pages, not a chat transcript.

```text
Raw (immutable)
  code / composer.lock / staging product
  features/*/evidence/*.png   evidence/ (unassigned)
        │ ingest
        ▼
Wiki (LLM writes)
  product/overview + rules + glossary
        │
        ▼
  features/NN-*/MODULE.md  ← source of truth for behavior
        ├── use-cases.md     (existing UC-* ids — never invent UC-001)
        ├── flows.md         (+ SCREEN-SPEC for new UI)
        ├── evidence.md      → local screenshots
        ├── limits.md / known-issues.md
        └── Related          → sibling modules, MCP, CODEMAP/ROUTEMAP
  use-cases/     engineering traces of those UCs
  ui-flows/      screen sequences across modules
  knowledge/     architecture + CODEMAP + ROUTEMAP
  mcp/           Customer / Find / Admin contract
  memory/        one-fact traps (MEMORY.md index)
  learnings/     gotchas, patterns, failures
  validation/    QA reports (sources — compile them into MODULE/UC)
  decisions/     ADRs
        │
        ▼
Schema   AGENTS.md + this file + skills/wiki.md
Nav      index.md (catalog) + log.md (timeline)
```

Query path: `index.md` → MODULE / UC / FLOW → code or `http://127.0.0.1:8000/login`. File durable answers back (ingest).

## Operations

**Ingest.** A new source (QA report, screenshot, MODULE correction, decision) is compiled into the wiki: update the owning `MODULE.md` / UC / flow, `index.md`, append `log.md`. One source may touch many pages. Do not leave the fact only in chat.

**Query.** Answer from `index.md` → feature pages → code/product. File a durable answer back (memory, MODULE, validation) when it will still be true next month.

**Lint.** Health-check: contradictions vs running product/code, stale `LAST_VERIFIED.md`, orphans, missing UCs/flows, `UNKNOWN` that was later proven. Fix the stale layer.

## Not this pattern

- RAG over the repo with no write-back.
- A parallel Obsidian vault outside this folder.
- Generated mocks filed as staging evidence.
- Rewriting raw screenshots or application PHP “because the wiki said so.” Evidence ranking still wins: running product → tests → code → this Brain.
