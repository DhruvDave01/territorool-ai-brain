---
title: "Services"
---

# Services

Laravel `app/Services` plus MCP tool services. Controllers still hold a lot of logic — do not assume a service exists.

| Class | Path | Responsibility | Called from |
|-------|------|----------------|-------------|
| `ManagerDashboardService` | `app/Services/Manager/ManagerDashboardService.php` | KPIs, scoring, territory visit helpers | Manager controller; **PHPUnit** |
| `ManagerFindLeadsService` | `app/Services/Manager/ManagerFindLeadsService.php` | Manager AI find + assign + credit check | Manager controller; **PHPUnit** |
| `ClaudeContactFinderService` | `app/Services/ClaudeContactFinder/` | Claude people search | Contact buy/find path |
| `InviteRewardService` | `app/Services/InviteRewardService.php` | Invite rewards | Invite/API |
| `OnboardingSegmentClassifier` | `app/Services/OnboardingSegmentClassifier.php` | Post-register segment | Onboarding |
| `UserDataService` | `app/Services/UserDataService.php` | Aggregated user payload (incl. credits) | API userdata |
| `TikTokEventsService` | `app/Services/TikTokEventsService.php` | Ads events | funnels |
| `GoogleSheetsClient` | `app/Services/GoogleSheets/` | Sheet export | ops |

## MCP (not under `app/Services`)

| Class | Path | Responsibility |
|-------|------|----------------|
| `AppMcpProtocolService` | `app/UserMcp/Services/` | JSON-RPC + handler map |
| `CustomerApiClient` | same | Dispatch v2 as the customer |
| `CustomerAuthenticator` | same | MCP user identity |
| `AppMcpRegistry` | same | Tool catalog from config |
| `*Tools` | `app/UserMcp/Services/Tools/` | Composite product tools |
| FindMcp `*Tools` | `app/FindMcp/Services/Tools/` | Subset |
| AdminMcp services | `app/AdminMcp/Services/` | Read-only HQ queries (`sales_desk` / MySQL) |

## Helper

`Helper` is the historical “service.” New shared credit/geo/save logic still often lands here. Prefer extending Helper or an existing service over a new parallel class.
