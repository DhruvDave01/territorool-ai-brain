# Design-system components

When adding UI, reuse in this order:

1. `CustomHeader` + `screenCurvedBodyStyles`
2. `CustomFooter` if the screen is a module (not Dashboard)
3. `AppButton` for form CTAs
4. `AppConfirmModal` for confirms
5. `Toast.show` for async results
6. `FilterModule` for company filters
7. `ShareEmailField` for share-by-email
8. `SearchGlyph` in search bars

Do not add `@react-navigation/bottom-tabs`. Do not create a second header gradient.

Full API notes: [../02-User-Interface/Components.md](../02-User-Interface/Components.md).
