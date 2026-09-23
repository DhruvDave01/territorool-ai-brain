---
id: VAULT-20260707-2169a5
type: change
status: HISTORICAL
evidence: DOCUMENTED
source: git web@5ba58f0d (commit message + file list)
origin: manual-commit
supersedes: []
superseded_by: []
features: []
flows: []
platforms: [web]
files: [repos/web/app/Http/Middleware/VerifyCsrfToken.php, repos/web/app/Mcp/Console/McpStdioCommand.php, repos/web/app/Mcp/Http/Controllers/CancelledSubscriptionsController.php, repos/web/app/Mcp/Http/Controllers/McpHttpController.php, repos/web/app/Mcp/Http/Controllers/McpToolsController.php, repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthAuthorizeController.php, repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthDiscoveryController.php, repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthRegisterController.php, repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthTokenController.php, repos/web/app/Mcp/Http/Controllers/SalesAgentsController.php, repos/web/app/Mcp/Http/Middleware/VerifyMcpApiKey.php, repos/web/app/Mcp/Http/Middleware/VerifyMcpAuth.php]
commits: [web@5ba58f0d]
relations:
occurrences: 1
first_recorded: 2026-07-07
last_verified: 2026-07-07
verified_against: web@5ba58f0d
labels: [git-seed, web]
area: memory
tags: [brain/memory, brain/kind/commit]
ref: "web 5ba58f0d — created mcp"
---

# web 5ba58f0d — created mcp

## What

Commit `5ba58f0d` on 2026-07-07 by a team developer: "created mcp". 40 source file(s) changed.

## Why it matters

No feature mapping in the brain index for these files (the change may be infrastructure, or the index lacks the file).

## Evidence

`git -C repos/web show --stat 5ba58f0d` — the commit message is the only statement of intent (DOCUMENTED, not VERIFIED).

## Implication for future work

Map these files to a feature in the brain index before relying on this change for impact analysis.

## Related

- `repos/web/app/Http/Middleware/VerifyCsrfToken.php`
- repos/web/app/Mcp/Console/McpStdioCommand.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Console/McpStdioCommand.php)
- repos/web/app/Mcp/Http/Controllers/CancelledSubscriptionsController.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Controllers/CancelledSubscriptionsController.php)
- repos/web/app/Mcp/Http/Controllers/McpHttpController.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Controllers/McpHttpController.php)
- repos/web/app/Mcp/Http/Controllers/McpToolsController.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Controllers/McpToolsController.php)
- repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthAuthorizeController.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Controllers/OAuth/McpOAuthAuthorizeController.php)
- repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthDiscoveryController.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Controllers/OAuth/McpOAuthDiscoveryController.php)
- repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthRegisterController.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Controllers/OAuth/McpOAuthRegisterController.php)
- repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthTokenController.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Controllers/OAuth/McpOAuthTokenController.php)
- repos/web/app/Mcp/Http/Controllers/SalesAgentsController.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Controllers/SalesAgentsController.php)
- repos/web/app/Mcp/Http/Middleware/VerifyMcpApiKey.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Middleware/VerifyMcpApiKey.php)
- repos/web/app/Mcp/Http/Middleware/VerifyMcpAuth.php — historical path at web@5ba58f0d; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Middleware/VerifyMcpAuth.php)
