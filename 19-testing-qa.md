---
id: 19-testing-qa
parent: core
sources:
  - "TerriTool/.maestro/*"
  - App/config/index.js
  - webterritool/docs/MCP-Agent-QA-Playbook.md
  - webterritool/docs/qa-runs/
related:
  - 02-commands.md
  - 14-mcp.md
---
# 19. Testing and QA

Related: [02-commands](02-commands.md) · [14-mcp](14-mcp.md)

| Layer | How |
|-------|-----|
| Mobile lint | `yarn lint` |
| Mobile E2E | Maestro `TerriTool/.maestro/*`; Detox mentioned in devDeps |
| Postman | `yarn generate-collection` from `App/config/index.js` |
| User MCP | `php artisan territool-app:qa` / `selftest` / `qa-contacts` / `qa-search` |
| MCP black-box | `webterritool/docs/MCP-Agent-QA-Playbook.md` — persona, app UI is oracle, quote credits, no naming tools |
| Manager QA | `docs/MCP-Manager-QA-Playbook.md` |
| QA logs | `webterritool/docs/qa-runs/` |

## Playbook techniques

1. **Compound intent** — two actions in one prompt; complete what exists, report the rest.
2. **Capability probing** — ask for what may not exist; do not silently substitute.
3. **Repeat-call determinism** — same `search_companies` twice, including `limit: 200` (cap).
4. **Cross-source parity** — MCP vs app UI; the app is the oracle.
5. **Adversarial follow-up** — if wrong, do not invent a reason.
6. **Environment differential** — staging vs live.

**Session protocol:** pick one env; sign in as a normal user with real data; open the app side-by-side; record `get_credits` at start.
