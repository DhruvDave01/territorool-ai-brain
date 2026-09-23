---
id: 17-minor-edge
parent: features
sources:
  - App/components/voiceAssistant.zip
  - webterritool/config/prompts/claude_contact_finder_system_prompt.txt
  - config/claude_contact_finder.php
related:
  - 05-constraints-and-drift.md
  - 10-mobile-app.md
---
# Feature: Minor / edge

Related: [05-constraints-and-drift](../05-constraints-and-drift.md) · [10-mobile-app](../10-mobile-app.md)

| Item | Detail |
|------|--------|
| Business card OCR | `@dariyd/react-native-text-recognition` + Gemini `geminiBusinessCard.js` |
| Color picker | User-defined status colors |
| WhatsNew / Spotlight | Some archived under `dashboard/AppCue/Archive` |
| `bizCompanies` | Stack screen registered; rarely navigated |
| `CongContact` / `bizContacts` | Enrichment UIs |
| Filter module | Shared across lists/routes/companies (`FilterModule`, `FilterList`, `FilterRoute`) |
| Session upload models | CSV wizards: `user_session`, `companies_session`, `contacts_session`, … |
| Share emails | `shareRouteList` / `getShareRouteListEmails` |
| Zapier | Public GETs for SFDC-shaped creates |
| `validate-phone` | Public API |
| `getUsers` | API — treat as sensitive |
| Voice assistant zip | `App/components/voiceAssistant.zip` (archived, not live source) |
| Claude contact prompt | `webterritool/config/prompts/claude_contact_finder_system_prompt.txt` + `config/claude_contact_finder.php` |
| `getuserdata` | API GET\|POST |
| `downloadpdf` | Public POST on CompanyController (web/API) |
| `APP_VERSION` check string | `'2.0'` |
