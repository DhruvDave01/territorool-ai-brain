---
title: "QA loop"
---

# QA loop

**Named FLOW + UCs → expected from MODULE.md → walk the product → report pass/fail → write back to this Brain**

This is QA **inside the single Brain**. It does not install Playwright Test, CI, or a second checklist repo. Drive the browser with [../skills/verify-ui.md](../skills/verify-ui.md) and [ui-loop.md](ui-loop.md).

Use when the human asks to QA a flow, a newly developed feature, or a UI change — including when no code should change.

## Steps

1. Name **FLOW-\*** from [../ui-flows/README.md](../ui-flows/README.md) and the **UC-\*** IDs under test.
2. Read expected results from `features/*/MODULE.md` + `use-cases.md`. For a new screen, also the [SCREEN-SPEC](../ui-flows/SCREEN-SPEC.md).
3. Confirm environment: local **`http://127.0.0.1:8000/login`** (not MAMP `/webterritool/public`), or staging. MySQL, role, credits if the UC spends. Blocked env ≠ product fail.
4. Walk happy path as the user: click, type, submit. A single screenshot is not QA.
5. Walk empty, error, and permission when the UC names them.
6. If the change writes companies, credits, or routes, check the other clients in scope (web and MCP).
7. Fill the report below. Attach URL, credit before/after, console/network only when relevant.
8. Learn: update `LAST_VERIFIED.md` only if you re-checked; file durable misses in [../learnings/](../learnings/README.md); wiki ingest [../skills/wiki.md](../skills/wiki.md).

## Smoke set (until they are boring)

| Flow | Must prove |
|------|------------|
| FLOW-AUTH | SA → `/dashboard`; manager → `/manager/dashboard` |
| FLOW-FIND-LEADS | Search **0** credits; each save **−1**; company in Address Book |
| FLOW-AB | Company on list and map |
| FLOW-CONTACTS | Buy **−2** or **−1**, never 0 |
| FLOW-ROUTE | Web may Draft; MCP publishes + `route_url` |
| FLOW-MANAGER | React root filled (`npm run build` if JSX changed) |
| FLOW-MCP | Tool JSON + same side effect visible in web |

A newly developed feature: its spec happy path + empty + error + sibling surfaces that read the same data.

## Report (copy into the reply; optional: feature `evidence.md` row)

| Field | Value |
|-------|-------|
| Flow / UC | |
| Role / URL | |
| Env | local `http://127.0.0.1:8000/login` / staging |
| Steps run | |
| Expected | from MODULE / spec |
| Actual | |
| Credits before → after | or `n/a` |
| Console / network | none / notable |
| Result | **pass** / **fail** / **blocked (env)** |

## Not this loop

- Product code change with no QA ask → still verify inside feature/bug/UI loops; you do not need a second report unless the human asked for QA.
- Do not claim `npm run test:e2e` is green. There is no Playwright Test suite.
