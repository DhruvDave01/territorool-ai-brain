---
title: "LLM Wiki Is This Brain"
name: llm-wiki-is-this-brain
description: Karpathy LLM Wiki is TerriTool AI Brain/ — do not add a second wiki vault
type: project
---

The LLM Wiki pattern lives in `TerriTool AI Brain/` (`index.md`, `log.md`, ingest/query/lint). Do not create `wiki/` beside it.

Why: ADR-009, 2026-09-16. Gist: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f

How to apply: after a durable finding, ingest into MODULE/memory, append `log.md`, run `python3 tools/wiki_index.py`.
