---
title: "Skill: Wiki (ingest / query / lint)"
name: territorool-wiki
description: >-
  Maintain the TerriTool AI Brain as an LLM Wiki (ingest, query, lint). Use
  after QA, a new source, or when the Brain may be stale or disconnected.
---

# Skill: Wiki (ingest / query / lint)

This Brain **is** the wiki. Schema: [../operating/llm-wiki.md](../operating/llm-wiki.md). Catalog: [../index.md](../index.md). Timeline: [../log.md](../log.md).

## Ingest

When the human adds a source (screenshot, QA pass, product decision, code fact):

1. Name the raw source (path, URL, MCP result). Do not modify evidence PNGs or `composer.lock`.
2. Compile into **every** owning wiki page the source touches — typically `MODULE.md` + `use-cases.md` + `flows.md` + `Related` + memory/learnings if it is a trap. One source may update 5–15 pages. Do not leave the fact only in `log.md` or chat.
3. Refresh [../index.md](../index.md) (`python3 tools/wiki_index.py` from `TerriTool AI Brain/`). Optional health-check: `python3 tools/wiki_index.py --lint`.
4. Append **one** entry to [../log.md](../log.md):

```text
## [YYYY-MM-DD] ingest | short title
```

Then 1–3 sentences (what changed, which pages).

## Query

1. Read `index.md` first.
2. Open the linked MODULE / UC / FLOW.
3. Verify against code or running product when the answer could be stale.
4. If the answer should compound, file it (ingest), do not leave it in chat.

## Lint

Look for: credit/one-product contradictions, Laravel 7 vs lockfile 5.3, MAMP `/public` vs `http://127.0.0.1:8000/login`, missing `use-cases.md`/`flows.md`, unassigned evidence, `LAST_VERIFIED` dates bumped without a check, orphans with no inbound links from README/index.

Append:

```text
## [YYYY-MM-DD] lint | one-line outcome
```

## Do not

- Create `wiki/` or a second vault.
- Install qmd / RAG unless asked.
- Treat `index.md` as higher rank than `MODULE.md` or source code.
