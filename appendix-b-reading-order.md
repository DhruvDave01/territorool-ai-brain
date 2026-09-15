---
id: appendix-b-reading-order
parent: core
sources:
  - TerriTool/App/App.js
  - App/config/index.js
  - webterritool/routes/api.php
  - app/UserMcp/config/territool_app.php
related:
  - 01-project-overview.md
  - 05-constraints-and-drift.md
  - 07-vocabulary.md
  - 09-credits-billing.md
  - brains/README.md
  - 14-mcp.md
  - 15-voice-policy.md
  - brains/mobile-ui.md
  - screens/navigation-map.md
  - screens/how-it-works.md
---
# Appendix B — Reading order for a new agent

1. Root `../AI_BRAIN.md` sections 1–5 and 7–9, or this vault: [01-project-overview](01-project-overview.md), [05-constraints-and-drift](05-constraints-and-drift.md), [07-vocabulary](07-vocabulary.md), [09-credits-billing](09-credits-billing.md).
2. Pick a [sub brain](brains/README.md) if the task is one surface (mobile code / mobile UI / web code / web UI / APIs).
3. Then either `TerriTool/App/App.js` + `App/config/index.js` **or** `webterritool/routes/api.php` + `app/UserMcp/config/territool_app.php`.
4. Feature folder or giant controller for the task, plus the matching note under [features/](features/).
5. If spoken/MCP behavior: [14-mcp.md](14-mcp.md) and [15-voice-policy.md](15-voice-policy.md).
6. If the task is **how a screen looks**: [brains/mobile-ui.md](brains/mobile-ui.md) then [design/MINI-DESIGN-BRAIN.md](design/MINI-DESIGN-BRAIN.md), or [brains/web-design.md](brains/web-design.md) then [design-web/MINI-DESIGN-BRAIN.md](design-web/MINI-DESIGN-BRAIN.md). Product APIs still come from the [API brain](brains/api.md), not the visual pack. Do not mix classic AdminLTE with manager islands.
7. If the task is **who navigates where** on mobile: [screens/navigation-map.md](screens/navigation-map.md) then [screens/how-it-works.md](screens/how-it-works.md).
