---
title: "Conventions (agent-facing)"
---

# Conventions (agent-facing)

Match the file you are in. There is no ESLint / PHPStan / EditorConfig.

1. **PHP 7.2-safe.** Lockfile Laravel 5.3.31. No PHP 8 syntax.
2. **Two UI stacks.** `/manager` = React + Vite. Else Blade + jQuery. Do not mix.
3. **Do not rename `CompanylController`.**
4. **Shared product rules** go in `Helper` / v2, not a Blade-only or MCP-only copy.
5. JSON `status: 1` success; `status: 0` or `2` often failure — but some legacy note endpoints return `status: 0` on success. Read the message.
6. Table names often ≠ model names (`Subscription` → `user_packages`).
7. Eloquent relations are usually **missing**. Write joins unless you verified the model.
8. Minimal diff. Do not reformat mixed tabs/spaces in a 7k-line controller.
9. Manager: edit JSX, then `npm run build`.
10. After behavior change, update `features/*/MODULE.md`.

Deep (with examples): [../code/coding-conventions.md](code/coding-conventions.md).
