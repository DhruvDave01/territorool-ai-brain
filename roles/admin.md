# Admin — HQ

Home is `/hq/dashboard`. Other roles never see HQ. There is no mobile HQ.

## Stack

Backpack on AdminLTE. Routes live in `routes/web.php` under prefix `hq`, namespace `Admin`. Restyling HQ means fighting Backpack. Treat it as its own surface.

Stills: [screenshots/web-owner/Admin](../screenshots/web-owner/Admin).

## What they do

Inspect users, grant or extend credits on the same wallet fields the app reads, answer support, manage HQ settings. Admin MCP is the HQ tool surface (`/ai/mcp-admin`), not the field catalog.

## Do not

- Build a new HQ screen with manager-portal CSS or with the mobile `CustomHeader`.
- Give a Sales Agent, Business Sales Agent, or Business Agent a link into `/hq`.
- Invent HQ pixels that are not in the Admin stills. If the still is missing, stop and ask.
