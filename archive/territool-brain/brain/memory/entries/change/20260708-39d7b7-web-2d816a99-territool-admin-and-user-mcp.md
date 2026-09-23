---
id: VAULT-20260708-39d7b7
type: change
status: HISTORICAL
evidence: DOCUMENTED
source: git web@2d816a99 (commit message + file list)
origin: manual-commit
supersedes: []
superseded_by: []
features: []
flows: []
platforms: [web]
files: [repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthAuthorizeController.php, repos/web/app/Mcp/Services/OAuth/McpOAuthClientService.php, repos/web/app/Mcp/resources/views/oauth/denied.blade.php, repos/web/app/Mcp/routes/mcp_oauth.php, repos/web/app/TerriToolApp/Console/SelfTestCommand.php, repos/web/app/TerriToolApp/Http/Controllers/AppMcpHttpController.php, repos/web/app/TerriToolApp/Http/Controllers/OAuth/AppOAuthAuthorizeController.php, repos/web/app/TerriToolApp/Http/Controllers/OAuth/AppOAuthDiscoveryController.php, repos/web/app/TerriToolApp/Http/Controllers/OAuth/AppOAuthRegisterController.php, repos/web/app/TerriToolApp/Http/Controllers/OAuth/AppOAuthTokenController.php, repos/web/app/TerriToolApp/Http/Middleware/VerifyAppMcpAuth.php, repos/web/app/TerriToolApp/Services/AppMcpProtocolService.php]
commits: [web@2d816a99]
relations:
occurrences: 1
first_recorded: 2026-07-08
last_verified: 2026-07-08
verified_against: web@2d816a99
labels: [git-seed, web]
area: memory
tags: [brain/memory, brain/kind/commit]
ref: "web 2d816a99 — TerriTool Admin and User MCP"
---

# web 2d816a99 — TerriTool Admin and User MCP

## What

Commit `2d816a99` on 2026-07-08 by a team developer: "TerriTool Admin and User MCP". 30 source file(s) changed (1 non-source file(s) ignored).

## Why it matters

No feature mapping in the brain index for these files (the change may be infrastructure, or the index lacks the file).

## Evidence

`git -C repos/web show --stat 2d816a99` — the commit message is the only statement of intent (DOCUMENTED, not VERIFIED).

## Implication for future work

Map these files to a feature in the brain index before relying on this change for impact analysis.

## Related

- repos/web/app/Mcp/Http/Controllers/OAuth/McpOAuthAuthorizeController.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Http/Controllers/OAuth/McpOAuthAuthorizeController.php)
- repos/web/app/Mcp/Services/OAuth/McpOAuthClientService.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/Services/OAuth/McpOAuthClientService.php)
- repos/web/app/Mcp/resources/views/oauth/denied.blade.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/resources/views/oauth/denied.blade.php)
- repos/web/app/Mcp/routes/mcp_oauth.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/Mcp/routes/mcp_oauth.php)
- repos/web/app/TerriToolApp/Console/SelfTestCommand.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/TerriToolApp/Console/SelfTestCommand.php)
- repos/web/app/TerriToolApp/Http/Controllers/AppMcpHttpController.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/TerriToolApp/Http/Controllers/AppMcpHttpController.php)
- repos/web/app/TerriToolApp/Http/Controllers/OAuth/AppOAuthAuthorizeController.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/TerriToolApp/Http/Controllers/OAuth/AppOAuthAuthorizeController.php)
- repos/web/app/TerriToolApp/Http/Controllers/OAuth/AppOAuthDiscoveryController.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/TerriToolApp/Http/Controllers/OAuth/AppOAuthDiscoveryController.php)
- repos/web/app/TerriToolApp/Http/Controllers/OAuth/AppOAuthRegisterController.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/TerriToolApp/Http/Controllers/OAuth/AppOAuthRegisterController.php)
- repos/web/app/TerriToolApp/Http/Controllers/OAuth/AppOAuthTokenController.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/TerriToolApp/Http/Controllers/OAuth/AppOAuthTokenController.php)
- repos/web/app/TerriToolApp/Http/Middleware/VerifyAppMcpAuth.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/TerriToolApp/Http/Middleware/VerifyAppMcpAuth.php)
- repos/web/app/TerriToolApp/Services/AppMcpProtocolService.php — historical path at web@2d816a99; no longer at HEAD (trace: git -C repos/web log --follow --oneline -- app/TerriToolApp/Services/AppMcpProtocolService.php)
