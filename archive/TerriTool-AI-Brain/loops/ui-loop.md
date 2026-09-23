---
title: "UI loop"
---

# UI loop

**Prefer source code + actual browser over source code only.**

```text
Requirement
    ↓
Understand User Flow
    ↓
Inspect Existing UI
    ↓
Use Playwright
    ↓
Execute Flow
    ↓
Observe Actual Behavior
    ↓
Compare Expected vs Actual
    ↓
Modify
    ↓
Re-run Playwright
    ↓
Verify
```

| Step | Open |
|------|------|
| User flow | [../ui-flows/README.md](../ui-flows/README.md), `features/*/flows.md` |
| Inspect UI | Blade under `resources/views/front/` or React `resources/manager-portal/` |
| Playwright | [../skills/verify-ui.md](../skills/verify-ui.md) |
| Expected | Feature `MODULE.md` + UC expected result |
| New / redesigned UI | Spec first: [../skills/design-ui.md](../skills/design-ui.md) |
| QA report (no code, or after a change) | [qa-loop.md](qa-loop.md) |
| File what you learned | [../skills/wiki.md](../skills/wiki.md) |

## Capture for each important flow

Route, page, components, user actions, state changes, API requests, expected UI, error/loading, permissions, validation, success.

A single screenshot is not verification.

## Environment failures (not product bugs)

- Canonical local QA is `http://127.0.0.1:8000/login`. Do not use MAMP `localhost:8888/webterritool/public`. If artisan is down, staging `https://staging.territool.com/login` may still be 200.
- Playwright MCP: `Browser is already in use ... mcp-chrome-... --isolated`.
- Login layout queries MySQL even for guests (`Helper::userActiveSubscription`). MySQL down → HTTP 500 on `/login` in tests.
