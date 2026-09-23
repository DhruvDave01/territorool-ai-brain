# Brain review: UI/UX and code development

Reviewed 2026-09-22. This reviews the current B1 guidance, including the newly added screen map, component contracts, API table, and revised gates. It supersedes the earlier conversation's findings where those gaps have since been fixed. Recommendations below are review findings, not new product rules.

## Assessment

The structure is useful for implementation: surface-specific brains, real screenshot references, sibling-code reuse, role rules, and explicit completion gates. The largest remaining risk is inaccurate or conflicting guidance being presented as verified fact. Correct the contracts and exceptions before adding more instructions.

## Findings

### 1. High — 22 API handler names are truncated

Evidence: [API endpoint table](../brains/api-endpoints.md), starting at the `request-package-upgrade` row. I checked all 145 documented handler strings against the live route file. Twenty-two are truncated rather than exact controller methods.

Examples:

| Documented | Live route handler |
|---|---|
| `RouteController@requestPackageUpgrad` | `RouteController@requestPackageUpgrade` |
| `WebhookController@revenueSubscriptio` | `WebhookController@revenueSubscriptionUpdate` |
| `CompanyController@bulkCompaniesCreat` | `CompanyController@bulkCompaniesCreate` |
| `CompanyController@getCompanyActiviti` | `CompanyController@getCompanyActivities` |
| `RouteController@storeRouteOnboarding` | `RouteController@storeRouteOnboardingConversion` |

Source: `/Users/dhruvdave/Dhurv/Project_TerriTool/Territool_web/webterritool/routes/api.php`.

Impact: a developer copying a handler into a route or searching for an exact method can create a broken route or follow a nonexistent symbol.

Recommendation: regenerate without display-width truncation and validate each method/path/controller/action tuple. Treat generated tables as indexes with validation, not manually abbreviated contracts.

Affected paths: `request-package-upgrade`, `revenue-subscription-update`, `bulk-companies-create`, `uploaderror/merge-contacts-with-company`, `addlogmeeting`, `getcompanyactivities`, `getlogmeeting`, `updatecompanyactivity`, `AILeadsContactFinder`, `fetchOpencorporatesCompany`, `getOpencorporatesCompany`, `getOpencorporatesContact`, `redeemApolloContact`, `redeemCongnismContact`, `redeemFullEnrichContact`, `updatecontactnotes`, `getShareRouteListEmails`, `getactiveroutecompany`, `getuseractiveroutev1`, `routeonboardingconversion`, `fullenrich-webhook/bulk/{jobId}`, and `fullenrich-webhook/bulk/{jobId}/contact`.

### 2. High — API constant mapping includes a commented-out assignment

Evidence: the `fetchOpencorporatesCompany` row in [API endpoints](../brains/api-endpoints.md) maps `URL_FETCH_OPENCORPORATES_COMPANY` to that endpoint. In live `TerriTool/App/config/index.js`, line 39 is the commented old assignment; line 40 actively assigns this constant to `fetchClaudeContact`. The table also lists the active mapping, leaving two contradictory destinations.

Impact: a screen can call the Claude endpoint while its implementer believes it calls OpenCorporates. This matters to provider behavior and credit-path reasoning.

Recommendation: extract active exports only; distinguish aliases from obsolete assignments. Validate every constant's active value against the documented endpoint.

### 3. High — The usability gate can falsely certify font scaling

Evidence: [Design gate](../gates/design-gate.md), Usability row, says text comes from `theme.typography` “so it scales.” The live `patches/react-native+0.84.1.patch` changes Text and TextInput defaults to disable font scaling. The installed React Native files contain those changes too. Typography entries set font styles; they do not opt Text into scaling.

Impact: a screen can satisfy the written check without responding to the user's text-size setting.

Recommendation: document the actual default. If a changed screen is required to support scaling, verify explicit scaling props and test an enlarged text setting, including clipping and input behavior. Do not silently change the app-wide patch as a documentation repair.

### 4. Medium — The font gate still contradicts the Dashboard exception

Evidence: [Code gate](../gates/code-gate.md), Fonts row, requires DIN or `theme.typography` for mobile text. [Mobile UI](../brains/mobile-ui.md), Dashboard section, says tile labels use the system face. Live `dashboard/dashboard.styles.js` supports the exception: `tileTitle` has its DIN font assignment commented out. The design gate recognizes this exception under Chrome but not under Type.

Impact: an agent can replace correct system typography with DIN to pass the general gate, producing theme drift.

Recommendation: scope font checks to the named sibling and explicitly carry its exceptions into both gates. Defaults should not override observed screen-specific styling.

### 5. Medium — Unknown requirements may be dropped without resolution

Evidence: [Guardian](../brains/ui-ux-guardian.md), Consistency report, allows UNKNOWN items to be left out, and allows shipping when each unknown was “asked or dropped.” Asking does not mean the answer has arrived; dropping a required interaction does not complete the task.

Impact: an incomplete screen could pass the gate merely because its uncertain requirement was recorded and omitted.

Recommendation: distinguish optional details from required behavior. Required unknowns must be resolved before completion; optional omissions must be named. Minor evidence-backed implementation choices can remain documented inferences where they preserve the existing design.

### 6. Medium — Top-level delivery rules remain ambiguous for development

Evidence: [AGENTS.md](../AGENTS.md), hard rule 9, says every UI request receives an image first and HTML is written only on explicit request. The revised [design gate](../gates/design-gate.md) now correctly distinguishes picture requests from code requests. [Render a still](../methods/render-still.md) itself uses temporary HTML to produce a PNG.

Impact: “implement this UI” can be interpreted as an image-only task, and the HTML wording can be interpreted as banning the internal rendering method.

Recommendation: preserve image-first delivery for picture requests while explicitly authorizing implementation for code requests. Distinguish internal rendering files from delivered HTML. Use the same wording at the entry point and in the gates.

### 7. Medium — Current feature pages still point readers toward unavailable legacy references

Evidence: [Find Leads](../features/05-Find-Leads.md), Related section, names `api-surfaces.md`, `ROUTEMAP.md`, `CODEMAP.md`, `engineering/README.md`, `glossary.md`, `roles.md`, and `OVERVIEW.md` without usable current links. Similar references occur in Routes and HQ. Current AGENTS.md explicitly excludes the archive as a source.

Impact: a developer cannot follow these references within the approved current brain. The normal Markdown-link scan does not detect bare filenames.

Recommendation: replace them with current API, code review, role, and feature links. Mark genuinely missing contracts as gaps rather than pointing readers to excluded material.

## Improvements already present

- The Guardian now requires KNOWN / INFERRED / UNKNOWN / CONFLICTING classification.
- The design gate distinguishes composited pictures from captures of running code.
- The code gate names lint, tests, builds, Maestro, behavior checks, and unverified outcomes.
- Find Leads now distinguishes Business Sales Agents' manager-funded credits from individual billing.
- Mobile screen and component maps make the live implementation easier to find.
- Feature Screens blocks supply existing state copy.

These should be retained. Earlier findings that these sections were entirely missing are no longer current.

## Next improvements after correcting the findings

1. Add reproducible validators for endpoint tables and screen maps, with source revision and generation date. Validate active declarations rather than comments or truncated terminal output.
2. Build a web component reference comparable to the mobile component page, with exact view/JSX paths, input contracts, and per-screen state copy. HQ needs more specific screen-to-evidence mapping.
3. Add task-specific validation selection: affected files, applicable commands, required runtime, expected outcomes, and limitations. Include ownership and credit-mutation cases when those contracts change.
4. Record per-surface layout evidence: spacing, dimensions, responsive behavior, and exceptions, each linked to the actual style or component. Do not invent a unified spacing scale if the product does not have one.
5. Keep design proposals and shipped captures explicitly labeled. Only running-build evidence should establish that an implementation works.

## Scope and verification

- Reviewed current AGENTS.md, six brains, API endpoint table, mobile component/screen maps, design/code gates, relevant methods, selected flows, roles, and feature pages.
- Checked 803 local Markdown references across 68 non-archive Markdown files before adding this report: no missing targets. This does not validate anchors, bare filenames, or semantic correctness.
- Compared all 145 API-table handler strings against the live route source; 22 failed exact-name matching. This was not a full audit of every auth/method/path assignment.
- Inspected live mobile config, AppButton, header references, Dashboard typography, theme typography, scaling patch, and installed Text/TextInput scaling behavior in source.
- No application tests, builds, simulator sessions, browser interactions, or full pixel comparisons were performed. This is a documentation and source-consistency review, not runtime certification.
- No existing guidance or application code was changed. Only this review report was added.
