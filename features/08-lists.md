# Feature: Lists

Related: [09-routes](09-routes.md) · [03-companies](03-companies.md)

## What it does

Named buckets of **saved** companies. Create, edit, delete, filter, turn into a driving route.

## Mobile screens

| Screen | File |
|--------|------|
| Index | `list/index.js` |
| Create / Edit | `list/create.js`, `list/edit.js` |
| Detail | `list/basic/index.js` `BasicRouteListDetail` |
| Filter | `list/filter.js` |
| List → route | `list/create/select-start-end-points.js` → `generateroute` |

Filters: status, category, industry, ZIP.

## APIs

`getlist`, `createList`, `updateList`, `deleteList`, `generateroute`.

Web: map view, CSV.

## MCP

- `view_lists` / `view_list` (named list → `view_list` with name or `list_id`)
- `create_list` — ask for list name; if skipped, generate a name
- `create_route_from_list` — publishes and returns `route_url`
