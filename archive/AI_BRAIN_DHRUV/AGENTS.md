# TerriTool AI Brain (Codex / agents)

At session start, treat `../AI_BRAIN.md` as the product briefing and this folder as detailed notes. Do not invent leads, routes, credits, FormData keys, or MCP tools.

Same reading map as `CLAUDE.md` and the workspace `.cursor/rules/ai-brain.mdc`.

| Task | Also read |
|------|----------|
| Product / credits / MCP | `../AI_BRAIN.md` plus `09-credits-billing.md` or `14-mcp.md` |
| Mobile implementation | `brains/mobile-code.md` then `code/mobile-code-details.md` + `code/MOBILE_CODEBASE_BRAIN.md` + `data/formdata-dictionary.md` |
| Any UI / UX / new screen or page chrome | `brains/ui-ux-guardian.md` first |
| Mobile UI | `brains/ui-ux-guardian.md` then `brains/mobile-ui.md` then `design/MINI-DESIGN-BRAIN.md` |
| Web / Laravel | `brains/web-code.md` then `code/web-code-details.md` + `code/WEB_CODEBASE_BRAIN.md` |
| Web UI | `brains/ui-ux-guardian.md` then `brains/web-design.md` then `design-web/MINI-DESIGN-BRAIN.md` |
| APIs | `brains/api.md` then `12-mobile-api.md` + `13-web-urls.md` |
| Lifecycle | `screens/how-it-works.md` |
| Web journeys | `screens/web-how-it-works.md` + `13-web-urls.md` |
| Manager MCP assign → route → contacts | `screens/manager-mcp-how-it-works.md` then `14-mcp.md` |
| Env names only | `ops/env-inventory.md` |
| Index | `index.md` |

Must follow: class screens, FormData, no Redux, no NativeBase, no nested navigators; UI/UX Guardian (`brains/ui-ux-guardian.md`) — copy existing chrome, ask on major UX, do not make UI “better”; copy nearest mobile chrome; poll `simplerouteview` until `route_status === "published"`; `get_credits` before spend; never `add_company` for AI hunt hits; User MCP `save_ai_leads` preview then stop, then `confirm_all` + token; BA hunt is `hunt_engine=manager_portal` not V2; Find MCP save has no preview; code wins. Check live `App/config/index.js` for staging vs prod `URL_BASE`.
