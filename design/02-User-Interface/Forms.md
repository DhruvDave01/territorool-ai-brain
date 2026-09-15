---
id: Forms
parent: design
---
# Forms

## Shared field look

- Background `#FAFBFC`
- Border `#E2E4E9` / `#E5E7EB`
- Radius 12
- Min height ~48
- Label above, often with Ionicons
- Placeholder `#9CA3AF`

## Login

- Email Address, Password
- Validation via `react-native-form-validator` + API errors as Toast
- Forgot Password opens **web** `{host}/password/reset` — leftover in-app modal is **not** wired to the link

## Add / Edit Company (`IMG_4587`–`4588`, VID2)

- Segment **Search** vs **Manual**
- Search: autocomplete “Searching…”, pick Places result, autofill
- Manual: Unclassified default category, optional business-card icon
- Fields include name, address, city, category, revenue (`$XXX,XXX` mask in VID2), LinkedIn, hours
- CTA “Add Company” dims while saving

## Add Contact (`IMG_4599`–`4600`, VID1)

- Name, position, email, phone, LinkedIn, life cycle (Lead), notes
- VID1 toast **“Please provide position.”** when position empty
- CTA “Add to Contact”

## Scan Business Card (`IMG_4606`–`4607`)

- Camera / Gallery
- Card preview + Remove Card
- Review details: tap fields; Copy all
- Groups CONTACT vs COMPANY
- OCR may fill incomplete LinkedIn as em dash

## AI Find Leads (`IMG_4565`)

- City / ZIP (example 74011)
- Ideal businesses
- Ideal prospects (AI)
- Next step disabled until results selected

## Create List name modal (VID3 `x3_t34s`)

- Title “Create New List”
- Placeholder “e.g. Top accounts, Q4 targets”
- Cancel outline / Save List filled

## Share Route / Share List (`IMG_4611`, VID3 `v3_004_32s`)

- Email address, `ShareEmailField`
- Cancel / Share
- Copy: TerriTool users get an email

## Report company (`IMG_4580`)

- Radio reasons
- Submit disabled until a reason is selected

## Filter (`IMG_4590`, VID3)

See Screen-Inventory filter fields. Dropdowns + segmented A-Z + scroll.

## Settings tags

“Edit Status” on Settings opens tag editor (color picker in code). **No dedicated still** of the editor sheet.

## Keyboard

VID1: iOS keyboard over AI Find Leads city field. `react-native-keyboard-aware-scroll-view` used on several forms.
