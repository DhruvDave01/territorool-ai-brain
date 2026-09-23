---
title: "Authentication"
---

# Authentication

Evidence: `config/auth.php`, `app/Http/Kernel.php`, `app/User.php`, `app/UserMcp/config/territool_app.php`.

## Web

- Guard `web`, session driver
- `Auth::routes()` plus trial / B2B / onboarding controllers
- CSRF via `web` middleware group
- Role: Spatie-style `HasRoles` on `app/User.php`
- Middleware: `auth`, `guest`, `role`, `manager.only`, `subscriber`

## Mobile / v2

- JWT: `tymon/jwt-auth`; Dingo auth; group uses `jwt.refresh` → `App\Http\Middleware\authJWT`
- Login / renew: `App\Api\V2\Controllers\AuthController`
- MCP customer tools require the same **Active** status gate as mobile login (config comment in `territool_app.php`)

## Passport

Package `laravel/passport` + `HasApiTokens` on `app/Api/User.php`.  
`AuthServiceProvider` does **not** call `Passport::routes()`. Runtime enablement: **UNKNOWN — needs verification**. Do not conflate Passport `oauth_*` tables with MCP `mcp_oauth_*`.

## MCP OAuth

| Server | Roles | Prefix |
|--------|-------|--------|
| UserMcp | Sales Agent, Business Sales Agent, Active | `/ai` → `/ai/mcp` |
| FindMcp | Same family | `/find-mcp/mcp` |
| AdminMcp | Staff | `/ai/mcp-admin` |

Customers sign in through the existing web login, then consent. Tokens bound to `user_id`. Shared `mcp_oauth_*` with `server=user` vs `server=admin`.

## API token guard

`auth.php` also defines `api` driver `token`. Whether anything still uses it: **UNKNOWN**.

## Product gates (not just auth)

- No plan → paywall (RevenueCat checkout path in bible)
- Subscriber middleware for paid features
- Manager-only routes
