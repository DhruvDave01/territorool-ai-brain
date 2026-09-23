---
title: "MCP — flows"
---

# MCP — flows

Part of [20-MCP](MODULE.md). Source mermaid in `flows/mmd/`, rendered PNG in `flows/png/` (re-render with `mermaid is inlined in this file`). Product-level map: [FLOWS.md](../../product/FLOWS.md).

ChatGPT public setup landing (`/chatgpt-plugin`): [flows/chatgpt-setup-index-spec.md](flows/chatgpt-setup-index-spec.md). Order is install MCP → create Project → use MCP in a chat.

## MCP agent lead-to-route

![MCP agent lead-to-route](flows/png/14-mcp-agent-lead-to-route.png)

```mermaid
flowchart TD
  Ask[User asks for leads] --> Cred[get_credits]
  Cred --> Search[find_ai_leads]
  Search --> More{Still running?}
  More -->|Yes| Resume[resume_ai_lead_search]
  Resume --> Search
  More -->|No| Preview[Preview hits - do not add_company]
  Preview --> Confirm{User agrees to spend?}
  Confirm -->|No| Stop[Stop]
  Confirm -->|Yes| Save[save_ai_leads confirm_all + token]
  Save --> Co[search_companies / view_company]
  Co --> Next{User wants route or list?}
  Next -->|List| AskL[Ask list name]
  AskL --> List[create_list]
  Next -->|Route| AskR[Ask start, end, route name]
  AskR --> Route[create_route - publishes]
  Route --> Url[Return route_url]
  List --> FromList[create_route_from_list]
```

## MCP agent use cases

![MCP agent use cases](flows/png/uc-mcp-agent.png)

```mermaid
flowchart TD
  Ask[User request] --> Credits[get_credits]
  Credits --> Find[find_ai_leads / resume]
  Find --> Preview[Preview hits<br/>never add_company]
  Preview --> Confirm{User confirms spend?}
  Confirm -->|No| Stop[Stop]
  Confirm -->|Yes| Save[save_ai_leads<br/>confirm_all + token]
  Save --> View[search_companies / view_company]
  View --> Want{Route or list?}
  Want -->|List| List[create_list]
  Want -->|Route| AskR[Ask start, end, name]
  AskR --> Route[create_route publishes]
  List --> FromList[create_route_from_list]
  Route --> Url[Return route_url]
  View --> Status[set_company_status]
  View --> People[find_contacts / add_contact]
  View --> Note[add_note / add_activity]
```
