# Feature: Maps and geo

Related: [09-routes](09-routes.md) · [07-ai-find-leads](07-ai-find-leads.md) · [17-integrations](../17-integrations.md)

## Mobile

| Piece | Detail |
|-------|--------|
| Provider | Android Google; iOS MapKit (`mapProvider.js`) |
| Clustering | `App/customPackage/react-native-map-clustering` + `supercluster` |
| Directions polyline | **Mapbox** Directions v5 (`googleDirections.js` + `MAPBOX_ACCESS_TOKEN`) — filename says google |
| External nav | `mapAppChooser.js`, `react-native-map-link` |
| Lasso | `route/lassoMap.js` |

## Web

- Google Maps JS, Geocoding, Places (New)
- Manager: Leaflet + Turf (`@turf/buffer`, `@turf/helpers`, `concaveman`)

## Lookups

| API | Path | Notes |
|------|------|--------|
| City search | `citysearch` | Public |
| Industries | `getIndutriesType` | Typo in path |
| Categories | `getcategories` | |

Mongo models: `Models/MongoDB/{City,Country,Location,TestModel}.php`.
