---
id: generate-brain
parent: core
related:
  - schema.md
  - appendix-a-google-source.md
  - 20-how-to-update.md
---
# Generator prompt — same-type AI Brain for another project

**One file.** Copy this entire note into Cursor, Claude Code, or Codex **inside the other project** (the YAML frontmatter can stay). Fill every `PROJECT BRIEF` row first.

This is the TerriTool vault + graph + evals + design packs + agent loaders, **plus** the full mobile scan spec that used to live in `TerriTool/source.txt`. There is no second prompt file.

Land scan results in the vault **and** `AI_BRAIN/code/MOBILE_CODEBASE_BRAIN.md`. Code wins. LLM must not own the wiki.

---

# The prompt

You are building a complete AI Brain for this codebase. Match the TerriTool AI Brain method exactly. Produce every layer below. Do not mark any layer optional. Do not skip a folder because the product is “smaller.” If a surface does not exist (no mobile app, no MCP, no web UI), still create the note and write “None in this repo” plus the proof (what you searched).

This is a product wiki for coding / voice / MCP agents. It is not a redesign, not a personal second brain, not a live production database, not an LLM-owned wiki.

REQUIRED SCAN SPEC — PART B of THIS SAME FILE (section “MOBILE CODEBASE SCAN SPEC”). Execute every phase there. Do not summarize it away. Do not skip a phase. Do not open a second prompt file.

It is the TerriTool source.txt scan (50 phases + final execution). Priority: Accuracy > Completeness > Traceability > Detail. Do not shorten for readability. Do not modify the product’s source code while scanning. Distinguish Confirmed / Inferred / Unknown. Code wins over comments. Recursively scan the entire client app (minor helpers, constants, validators — not only major files). Trace relationships; do not document files in isolation.

Land that scan in BOTH:
  1) Atomic vault notes (code/, screens/, features/, data/, ops/)
  2) AI_BRAIN/code/MOBILE_CODEBASE_BRAIN.md — the full dump Phase 47 asks for. The vault hubs must link to it. Do not replace the vault with only this one file.

If the product has a web app, apply the same 50-phase depth to web and write AI_BRAIN/code/WEB_CODEBASE_BRAIN.md plus the web vault notes.

============================================================
PROJECT BRIEF (human fills every row; do not invent blanks)
============================================================
Product name:
One-paragraph job (who it is for, what a user actually does):
Repos (absolute paths to every git root: app, api, web, mobile, infra, docs):
Roles / user types (from code if possible):
Envs (name → public URL). Never paste passwords, API keys, JWTs, .env values:
Auth (session / JWT / OAuth / API key — how a real request is authenticated):
Money / credits / plans / entitlements (or write NONE) + the source file you believe holds the math:
Integrations (payments, maps, CRM, email, LLM, storage, analytics, MCP, voice):
MCP / agent tool endpoints (URLs) if any:
Voice / chat agents if any:
Must never invent (IDs, prices, tool names, request keys, routes):
Must never change / must match nearest existing code (legacy stacks, mixed tokens, typos in class names):
Old docs that lie (README, Prompts, Notion, Figma paths):
Screenshot / video / design-pack folders (absolute paths; binaries stay on disk):
Web screenshot folders if any:
HTML replicas to IGNORE if any:
Git author for notes (name + email) if committing:
Vercel project name (or NONE if you will still generate vercel.json locally):
Anthropic model name for Ask (default claude-sonnet-5) — not the API key:
Reference brain to copy graph scripts from (if available):
  e.g. /Users/…/AI_BRAIN  (retrieve.py, graph-server.py, scripts/build-graph.py, graph.html, api/chat.js, api/health.js, vercel.json, evals/)
============================================================

If any required brief row is empty, stop after Phase 0, list the missing rows, and wait. Do not guess product behavior.

================================================================================
HARD RULES (all of them)
================================================================================
1. Code wins over README, Prompts, Figma, Notion, screenshots filenames, and this brief. If they disagree: cite the file, add a row to AI_BRAIN/05-constraints-and-drift.md.
2. Do not invent endpoints, request/FormData/JSON keys, MCP/tool names, prices, IDs, env values, or UI chrome you did not see in code or pixels.
3. Never write secrets into notes: no passwords, API keys, JWTs, tokens, connection strings, .env values. Env inventory = names only, never values.
4. Never write per-customer / per-rep data (names, balances, live routes, emails except public support addresses).
5. One file = one concept. Prefer tables. Cite real repo-relative paths. Relative markdown links in the note BODY (graph builders ignore YAML-only related:).
6. Do not copy large binaries into git (PNG, JPG, MP4, TTF dumps, node_modules). Cite disk paths. Inventory markdown only.
7. Trust pixels over filenames. If a file is named gate.png but is a paywall, document the mismatch. Do not invent a second layout from the name.
8. Do not “fix” mixed tokens, two danger colors, typos in class names, or legacy stacks. Document them. Copy the nearest existing screen/page.
9. Do not flatten the vault. Do not put the whole wiki in one file except the frontal lobe AI_BRAIN.md.
10. Do not let an LLM rewrite the wiki as source of truth. Ingest is human/agent-from-code. Query is BM25 + optional LLM answer with citations. Lint is evals.
11. Do not merge unverified third-party graphs or random gist dumps into this vault.
12. Frontal lobe AI_BRAIN.md is the briefing. After the first write, later updates patch AI_BRAIN/ notes unless the human explicitly asks to edit AI_BRAIN.md.
13. Do not commit unless the human asked. If they asked, do not commit .env, credentials, or screenshot binaries.
14. While executing source.txt: do NOT modify product source, refactor, fix bugs, change config, or install/remove packages. Inspect, trace, document only.
15. Never invent behavior that cannot be verified from code. Label every claim Confirmed / Inferred / Unknown. If docs conflict with implementation, code wins and the conflict goes in 05-constraints-and-drift.md.

================================================================================
PHASE 0 — MAP (must output before writing notes)
================================================================================
The mobile scan spec is PART B below in this same file. Keep it in context for the rest of the job.

Scan and list (with paths) — this is source.txt Phase 1 (COMPLETE REPOSITORY DISCOVERY) plus brain coverage:
- Entrypoints (index, App.js, artisan, main.py, next.config, etc.)
- Routers / navigators / route tables
- API route files and client API wrappers
- Auth implementation
- Config / flavor / env name files
- Billing / credit / subscription helpers
- MCP / tool / skills configs
- Database migrations / schema
- Test / QA / playbook folders
- Design tokens / theme files
- Screenshot folders from the brief
- From source.txt Phase 1, also list: framework + versions, SDKs, build system, package manager, architecture, design patterns, state management, navigation, networking, database, local/secure storage, caching, analytics, crash reporting, push, background, deep linking, permissions, native modules, flavors, CI/CD, feature flags, remote config, localization, DI, logging, error handling

Then output a coverage matrix:

| Feature or system | Code path | Note that will exist | Stills path | Status |
|-------------------|-----------|----------------------|-------------|--------|

Also output source.txt Phase 50 coverage report skeleton (Architecture, Screens, Navigation, APIs, Models, State, Storage, Auth, Permissions, Notifications, Native Android, Native iOS, Tests, Security, Configuration) with Complete/Partial/Unknown and High/Medium/Low. Do not mark Complete just because no more files were immediately found.

Do not start Phase 1 until this matrix exists in the chat (and later copy it into AI_BRAIN/design/06-Coverage/Functionality-Coverage-Matrix.md or ops/coverage-matrix.md).

================================================================================
PHASE 0B — EXECUTE source.txt IN FULL (50 phases, do not skip)
================================================================================
Run every phase in PART B (this file, below) against the client app. Repeat analogously for web.

| source.txt | Land in vault |
|------------|----------------|
| Phases 1–4 Discovery, structure, startup, architecture | 03-architecture.md, 10-client.md, code/<client>-details.md, screens/how-it-works.md |
| Phase 5 Every screen | 02-User-Interface/Screen-Inventory.md + per-screen rows; code map |
| Phase 6 User flows | design/04-User-Flows/* |
| Phase 7 Navigation brain | screens/navigation-map.md, appendix-c-nav-map.md, 02-User-Interface/Navigation.md |
| Phase 8 API documentation | 12-api-catalog.md, data/formdata-dictionary.md, brains/api.md |
| Phase 9 Data models | 16-data-models.md, data/database-columns.md |
| Phase 10 State management | brains/<client>-code.md, 04-style-guide.md |
| Phase 11 Auth & session | features/01-auth, screens/how-it-works.md |
| Phase 12 Storage & database | 16-data-models.md, code details |
| Phase 13 UI components | design/02-User-Interface/Components.md |
| Phase 14 Design system | design/05-Design-System/*, MINI |
| Phase 15 Forms & validations | design/02-User-Interface/Forms.md |
| Phase 16 Error handling | design/04-User-Flows/Error-and-Recovery.md (or equivalent) |
| Phase 17 Permissions | design/04-User-Flows/Permissions.md |
| Phase 18 Push notifications | features/notifications note |
| Phase 19 Background processing | 10-client.md / ops |
| Phase 20 Third-party dependencies | 17-integrations.md |
| Phase 21 Configuration & environments | ops/env-inventory.md (names only), ops/release-flavor-matrix.md |
| Phase 22 Native Android / iOS | design/02-User-Interface/Platform-Differences.md |
| Phase 23 Analytics & logging | features + 17-integrations.md |
| Phase 24 Security | 05-constraints-and-drift.md, 04-style-guide.md |
| Phase 25 Testing | 19-testing-qa.md |
| Phase 26 Small implementation details | code/<client>-details.md |
| Phase 27 Function / method knowledge map | code/<client>-details.md |
| Phase 28 Dependency & relationship map | 03-architecture.md |
| Phase 29 Feature knowledge map | features/* |
| Phase 30 Change impact map | ops/decision-log.md + code details |
| Phase 31 Dead / unused / duplicate | ops/known-bugs.md, 05-constraints-and-drift.md |
| Phase 32 Comments & TODOs | ops/known-bugs.md |
| Phase 33 Complete application flow map | 18-cross-system-flows.md, screens/how-it-works.md |
| Phase 34 Screen → action → code matrix | screens/how-it-works.md |
| Phase 35 API → feature reverse map | 12-api-catalog.md, brains/api.md |
| Phase 36 Data lifecycle map | 16-data-models.md |
| Phase 37 Conditional logic inventory | code details + NMV where unknown |
| Phase 38 Event & side-effect map | screens/how-it-works.md |
| Phase 39 App lifecycle | screens/how-it-works.md, 10-client.md |
| Phase 40 Network behavior | brains/api.md, 12-api-catalog.md |
| Phase 41 File responsibility index | code/<client>-details.md |
| Phase 42 Constants & configuration index | ops/env-inventory.md + code details |
| Phase 43 Edge case brain | ops/known-bugs.md, NMV |
| Phase 44 Unknown / ambiguous | 06-Coverage/Needs-Manual-Verification.md |
| Phase 45 AI codebase knowledge rules | 04-style-guide.md, CLAUDE.md, AGENTS.md, Cursor rule |
| Phase 46 Document metadata | ingest log YYYY-MM-DD.md |
| Phase 47 Final document structure | AI_BRAIN/code/MOBILE_CODEBASE_BRAIN.md (all 49 sections; do not drop sections to keep it short) |
| Phase 48 Cross-reference everything | markdown links in note bodies; then Phase 7 graph rebuild |
| Phase 49 Validation pass | evals + coverage matrix |
| Phase 50 Coverage report | design/06-Coverage/Functionality-Coverage-Matrix.md |

source.txt Final execution: Discovery → Relationship analysis (Screens ↔ Nav ↔ Components ↔ State ↔ Logic ↔ Repos ↔ Services ↔ APIs ↔ Models ↔ Storage ↔ Native) → Flow analysis → Detail pass (constants, conditions, validation, storage keys, errors, TODOs, edge cases, platform checks, lifecycle, magic values, utils) → Generate docs → Verification pass → Final report with real counts from files inspected. Do not fabricate counts.

If there is no mobile app, write MOBILE_CODEBASE_BRAIN.md as “None — searched <paths>” and still run the same depth on whatever client exists.

================================================================================
PART B — MOBILE CODEBASE SCAN SPEC (full source.txt; do not skip)
Origin: /Users/dhruvdave/Dhurv/Project_TerriTool/TerriTool/source.txt
This is inlined so you only paste ONE file.
================================================================================

# TASK: Create an Extremely Detailed Mobile Application Codebase Documentation / Brain

I want you to deeply analyze my **entire mobile application source code** and create a comprehensive Markdown documentation file that explains the application from the highest architectural level down to the smallest implementation details.

The final documentation must be detailed enough that a new developer or AI agent can understand the application without having to manually explore the entire repository first.

## CRITICAL RULES

1. **Do NOT modify any source code.**
2. **Do NOT refactor anything.**
3. **Do NOT fix bugs.**
4. **Do NOT change configuration files.**
5. **Do NOT install/remove packages.**
6. Your task is ONLY to inspect, understand, trace, and document.
7. Scan the **entire mobile project recursively**.
8. Do not document only major files.
9. Include minor files, helpers, utilities, constants, models, hooks, services, configurations, extensions, validators, storage logic, etc.
10. Do not skip something because it appears unimportant.
11. Trace relationships between files instead of documenting files independently.
12. Whenever possible, reference the **actual file path, class, function, method, variable, or component**.
13. Never invent behavior that cannot be verified from the code.
14. Clearly distinguish between:

* Confirmed from code
* Inferred from code relationships
* Unknown / cannot be determined

15. If documentation/comments conflict with implementation, **the actual executable code is the source of truth**, but record the conflict.
16. Do not rely only on README files or existing documentation. Verify everything against the source code.

---

# PHASE 1 — COMPLETE REPOSITORY DISCOVERY

Before writing documentation, inspect the complete repository.

Identify:

* Mobile framework
* Programming language(s)
* Framework version
* SDK versions
* Build system
* Package manager
* Application architecture
* Design patterns
* State-management solution
* Navigation system
* Networking layer
* Authentication mechanism
* Database
* Local storage
* Secure storage
* Caching
* Analytics
* Crash reporting
* Push notifications
* Background services
* Deep linking
* Permissions
* Third-party SDKs
* Native modules
* Environment management
* Build flavors/schemes
* Testing frameworks
* CI/CD configuration
* Feature flags
* Remote configuration
* Localization
* Dependency injection
* Logging
* Error handling

Inspect all relevant directories and configuration files.

Do not begin final documentation until the repository structure and major relationships have been mapped.

---

# PHASE 2 — PROJECT STRUCTURE

Document the complete meaningful folder/file structure.

For every important directory explain:

* Path
* Purpose
* What it contains
* Why it exists
* What uses it
* What it depends on
* Whether it belongs to UI, business logic, data, infrastructure, configuration, testing, etc.

Example:

```text
src/
├── screens/
├── components/
├── services/
├── models/
├── navigation/
├── hooks/
├── utils/
├── constants/
└── ...
```

Do NOT merely reproduce the directory tree.

Explain the architectural responsibility of each part.

---

# PHASE 3 — APPLICATION STARTUP

Trace application startup from the true entry point.

Document step-by-step:

1. Application launch
2. Entry file execution
3. Framework initialization
4. Native initialization
5. Environment loading
6. Dependency initialization
7. Database initialization
8. Storage initialization
9. Authentication restoration
10. User/session restoration
11. Remote configuration
12. Analytics initialization
13. Push notification initialization
14. Permission checks
15. Navigation initialization
16. Initial route determination
17. Initial API requests
18. First rendered screen

Create a startup execution flow such as:

```text
App Launch
  ↓
Entry Point
  ↓
Initialization
  ↓
Restore Session
  ↓
Check Authentication
  ↓
Load User
  ↓
Determine Navigation
  ↓
Render Screen
```

Use actual code references.

---

# PHASE 4 — ARCHITECTURE

Explain the application's architecture in depth.

Document:

* Architectural pattern
* Layers
* Responsibilities
* Dependency direction
* Data flow
* UI → business logic → service → API/database flow
* Shared modules
* Global modules
* Feature modules
* Dependency injection
* Repository pattern
* Service pattern
* Controllers/ViewModels/BLoCs/Providers/etc.
* Separation of concerns
* Cross-feature dependencies

Explain how a normal user action travels through the architecture.

---

# PHASE 5 — EVERY SCREEN

Create a complete **Screen Inventory**.

For EVERY screen document:

## Screen Name

**File:**
Actual path.

**Purpose:**
Why this screen exists.

**Entry Points:**
How the user reaches it.

**Exit Points:**
Where the user can go from here.

**Navigation Parameters:**
Every parameter accepted.

**UI Components:**
Every major and minor component.

**Displayed Data:**
Where every meaningful piece of data comes from.

**Local State:**
All relevant state variables.

**Global State:**
Any shared/global state used.

**Lifecycle:**
What happens on mount/open/resume/pause/unmount/dispose.

**User Actions:**
Every button, icon, gesture, menu, tab, input, link, swipe, etc.

**API Calls:**
All network requests triggered directly or indirectly.

**Storage:**
Local/secure/database reads and writes.

**Validation:**
Every validation rule.

**Loading State:**
How loading is handled.

**Empty State:**
What happens with no data.

**Error State:**
What happens when something fails.

**Success State:**
What happens after success.

**Permissions:**
Any permission involved.

**Analytics:**
Events triggered.

**Navigation:**
All incoming and outgoing navigation.

**Conditional UI:**
Every meaningful condition controlling visibility or behavior.

**Dependencies:**
Services/components/hooks/models/etc. used.

**Edge Cases:**
Special cases handled by the code.

Repeat this for EVERY screen.

---

# PHASE 6 — COMPLETE USER FLOWS

Trace all major and minor user flows end-to-end.

Examples where applicable:

* Splash
* Onboarding
* Signup
* Login
* Logout
* Forgot password
* OTP
* Email verification
* Home
* Search
* Filter
* Detail views
* Create
* Edit
* Delete
* Profile
* Settings
* Notifications
* Permissions
* Subscription
* Payment
* Upload
* Download
* Sharing
* Deep links
* Background behavior

Do not assume these features exist. Only document those found in the project.

For each flow provide:

```text
User Action
→ Screen
→ Handler
→ Validation
→ State Update
→ Service
→ API
→ Response
→ Model Mapping
→ State Update
→ UI Update
→ Navigation
```

Include alternate/error paths.

---

# PHASE 7 — NAVIGATION BRAIN

Document the complete navigation architecture.

Include:

* Root navigation
* Stack navigation
* Tabs
* Drawers
* Nested navigators
* Route definitions
* Route names
* Parameters
* Guards
* Authentication redirects
* Conditional navigation
* Deep links
* Back behavior
* Modal navigation
* Navigation triggered by notifications

Create a route map.

Example:

```text
Splash
 ├── Login
 │    ├── Forgot Password
 │    └── Signup
 └── Main
      ├── Home
      ├── Search
      └── Profile
```

Use the actual project routes.

---

# PHASE 8 — API DOCUMENTATION

Find every API/network call.

Create an API inventory containing:

* Endpoint
* HTTP method
* Source file
* Function/method
* Base URL source
* Headers
* Authentication
* Query parameters
* Path parameters
* Request body
* Request model
* Response model
* Error handling
* Retry behavior
* Timeout behavior
* Response transformation
* Caching
* Screen/feature using it
* Conditions under which it executes

Trace:

```text
UI
→ Handler
→ Service
→ Network Client
→ Endpoint
→ Response
→ Parsing
→ State
→ UI
```

Do not expose actual secrets in the documentation.

---

# PHASE 9 — DATA MODELS

Document every meaningful:

* Model
* Entity
* DTO
* Request model
* Response model
* Database model
* Serialization model
* Enum
* Type
* Interface

For each field document:

* Name
* Type
* Nullable/required
* Default
* Source
* Meaning
* Serialization name if different
* Where it is used
* Important transformations

Also document relationships between models.

---

# PHASE 10 — STATE MANAGEMENT

Document the entire state-management system.

Include:

* Global state
* Local state
* Stores
* Providers
* Reducers
* Actions
* Events
* BLoCs
* ViewModels
* Controllers
* Observables
* Hooks
* Selectors
* Derived state
* Persistent state

For each state object explain:

* Who creates it
* Who reads it
* Who writes it
* Initial value
* Update conditions
* Persistence
* Reset conditions
* Side effects

---

# PHASE 11 — AUTHENTICATION & SESSION

Trace authentication completely.

Document:

* Signup
* Login
* Logout
* Token creation
* Token storage
* Token retrieval
* Token refresh
* Expiration
* Session restoration
* User restoration
* Unauthorized response handling
* Auto-login
* Biometric authentication if present
* Social login if present
* Authentication guards
* Logout cleanup

Explain where credentials/tokens are stored without exposing actual secret values.

---

# PHASE 12 — STORAGE & DATABASE

Find every persistent/local storage mechanism.

Document:

* Database
* SharedPreferences/UserDefaults
* AsyncStorage
* Secure storage
* Keychain/Keystore
* SQLite
* Realm
* CoreData
* Files
* Cache
* Preferences

For every known storage key/table/entity document:

* Name
* Purpose
* Value/type
* Writer
* Reader
* Creation condition
* Update condition
* Deletion condition

---

# PHASE 13 — UI COMPONENTS

Document reusable UI components.

For each component:

* File
* Purpose
* Props/parameters
* Required props
* Optional props
* Defaults
* Callbacks
* State
* Variants
* Styling
* Dependencies
* Screens using it
* Conditions
* Accessibility behavior where implemented

Include small reusable components too.

---

# PHASE 14 — DESIGN SYSTEM

Extract the design system implemented in code.

Document:

* Colors
* Typography
* Fonts
* Font sizes
* Font weights
* Spacing
* Padding
* Margins
* Border radius
* Shadows
* Icons
* Images
* Buttons
* Inputs
* Cards
* Modals
* Bottom sheets
* App bars
* Navigation bars
* Dialogs
* Toasts
* Loaders
* Empty states
* Error states
* Themes
* Dark mode
* Responsive rules
* Device-specific behavior

Reference actual constants/styles/themes.

---

# PHASE 15 — FORMS & VALIDATIONS

Find every form and validation.

Document:

* Field
* Required/optional
* Type
* Min/max length
* Regex
* Formatting
* Input restrictions
* Error messages
* Submit conditions
* Server-side validation
* Client-side validation
* Cross-field validation

Trace form submission end-to-end.

---

# PHASE 16 — ERROR HANDLING

Document every error-handling strategy.

Include:

* API failures
* Network failures
* Timeouts
* Authentication failures
* Validation failures
* Parsing failures
* Database failures
* Permission failures
* File failures
* Unexpected exceptions
* Global error handlers
* Crash reporting

Document what the user sees for each meaningful failure path.

---

# PHASE 17 — PERMISSIONS

Document every mobile permission.

Examples:

* Camera
* Photos
* Storage
* Location
* Notifications
* Contacts
* Microphone
* Bluetooth

For each permission document:

* Where requested
* Why
* Trigger
* Granted behavior
* Denied behavior
* Permanently denied behavior
* Platform differences

Only include permissions actually present.

---

# PHASE 18 — PUSH NOTIFICATIONS

If present, document:

* Provider
* Token generation
* Token storage
* Token registration
* Refresh
* Foreground notification
* Background notification
* Terminated-state notification
* Notification tap
* Payload parsing
* Deep linking
* Notification permissions
* Badge handling

---

# PHASE 19 — BACKGROUND PROCESSING

Document:

* Background tasks
* Workers
* Services
* Schedulers
* Timers
* Periodic synchronization
* Background location
* Background downloads/uploads
* App lifecycle listeners

Explain when they start and stop.

---

# PHASE 20 — THIRD-PARTY DEPENDENCIES

Document every meaningful dependency.

For each:

* Package/library
* Version
* Purpose
* Initialization
* Files using it
* Features depending on it
* Platform-specific setup

Separate:

* Core dependencies
* UI dependencies
* Networking
* Storage
* Analytics
* Testing
* Build/development dependencies

---

# PHASE 21 — CONFIGURATION & ENVIRONMENTS

Document:

* Development
* Staging
* Production
* Environment variables
* Build flavors
* Schemes
* Bundle/application IDs
* Base URL selection
* Feature flags
* Debug configuration
* Release configuration

Never print secret values.

Use:

```text
API_KEY = [REDACTED]
```

when needed.

---

# PHASE 22 — NATIVE AND PLATFORM-SPECIFIC CODE

Inspect Android and iOS native code where applicable.

Document:

## Android

* Manifest
* Gradle
* Activities
* Services
* Receivers
* Providers
* Permissions
* Intent filters
* Deep links
* ProGuard/R8
* Signing configuration without secrets
* Native integrations

## iOS

* Info.plist
* AppDelegate
* SceneDelegate
* Entitlements
* URL schemes
* Permissions
* Background modes
* Pods/SPM
* Native integrations

Explain platform-specific differences.

---

# PHASE 23 — ANALYTICS & LOGGING

Find:

* Analytics events
* Screen tracking
* User properties
* Crash reporting
* Logs
* Debug logs
* Performance monitoring

Create an analytics-event inventory if applicable.

---

# PHASE 24 — SECURITY IMPLEMENTATION

Document security-related implementation such as:

* Token storage
* Sensitive-data storage
* Encryption
* SSL configuration
* Certificate pinning
* Authentication headers
* Biometrics
* Root/jailbreak detection
* Screenshot protection
* Obfuscation
* Secure storage

Do NOT expose credentials, secrets, private keys, tokens, or passwords.

Also identify potential security-sensitive areas without changing them.

---

# PHASE 25 — TESTING

Document existing tests.

Include:

* Unit tests
* Widget/component tests
* Integration tests
* UI tests
* E2E tests
* Mocks
* Fixtures
* Test helpers

Explain what is currently covered and what appears uncovered.

Do not claim something is untested unless you have inspected the relevant test locations.

---

# PHASE 26 — SMALL IMPLEMENTATION DETAILS

This section is extremely important.

Capture small details developers commonly miss:

* Hardcoded values
* Magic numbers
* Delays
* Debounce durations
* Timeout values
* Retry counts
* Pagination limits
* Default values
* Date formats
* Time formats
* Number formats
* Currency formats
* Regex
* String constants
* Storage keys
* Route names
* API constants
* Enum values
* Feature flags
* Boolean conditions
* Sorting rules
* Filtering rules
* Search behavior
* Character limits
* File-size limits
* Image compression
* Image dimensions
* Pagination behavior
* Cache duration
* Refresh conditions
* Loading conditions
* Disabled button conditions
* Visibility conditions
* Keyboard behavior
* Scroll behavior
* Platform checks
* Device checks
* App version checks

Reference the source file wherever practical.

---

# PHASE 27 — FUNCTION / METHOD KNOWLEDGE MAP

For important business-logic functions and methods document:

```text
Function:
File:
Purpose:
Called By:
Calls:
Inputs:
Outputs:
State Read:
State Modified:
Side Effects:
API Calls:
Storage Access:
Navigation:
Error Handling:
Important Conditions:
```

Do not waste documentation on trivial generated/framework boilerplate unless it affects application behavior.

---

# PHASE 28 — DEPENDENCY & RELATIONSHIP MAP

Explain relationships such as:

```text
Screen
↓
Component
↓
Controller / ViewModel
↓
Repository
↓
Service
↓
API
↓
Model
↓
State
↓
UI
```

Identify heavily shared modules and important dependency chains.

---

# PHASE 29 — FEATURE KNOWLEDGE MAP

For every discovered feature create:

```text
Feature
├── Screens
├── Components
├── State
├── Models
├── Services
├── APIs
├── Storage
├── Navigation
├── Validation
├── Permissions
└── Tests
```

This should make it easy for a developer or AI to understand exactly which files participate in a feature.

---

# PHASE 30 — CHANGE IMPACT MAP

Create a section showing likely dependency impact.

Examples:

```text
Changing User Model
→ Authentication
→ Profile
→ Storage
→ API Parsing
→ UI

Changing API Client
→ Authentication
→ All Repositories
→ Error Handling
→ Network-dependent Features
```

Base this only on actual dependencies discovered in the repository.

---

# PHASE 31 — DEAD / UNUSED / DUPLICATE CODE

Carefully identify potential:

* Unused files
* Unused functions
* Unused imports
* Unreachable screens
* Duplicate helpers
* Duplicate models
* Legacy code
* Commented-out code
* Deprecated APIs

Do NOT delete anything.

Mark uncertain cases as:

> Potentially unused — requires runtime verification.

---

# PHASE 32 — CODE COMMENTS & TODOs

Find meaningful:

* TODO
* FIXME
* HACK
* NOTE
* Deprecated comments

Create an inventory containing:

* File
* Location
* Comment
* Related functionality

---

# PHASE 33 — COMPLETE APPLICATION FLOW MAP

Create a complete end-to-end map of the entire mobile application based strictly on the actual source code.

The goal is to allow a developer or AI agent to understand **how the complete application works from launch until termination**, including every major and minor branch.

Build the map using the actual screens, routes, services, APIs, state, storage, and conditions discovered in the repository.

Example structure:

```text
Application
│
├── App Launch
│   ├── Native Initialization
│   ├── Framework Initialization
│   ├── Environment Configuration
│   ├── Dependency Initialization
│   ├── Database / Storage Initialization
│   ├── Analytics Initialization
│   ├── Crash Reporting Initialization
│   ├── Push Notification Initialization
│   └── Other Startup Services
│
├── Session Restoration
│   ├── Read Stored Credentials
│   ├── Read Authentication Token
│   ├── Read User Data
│   ├── Validate Session
│   │
│   ├── Valid Session
│   │   └── Continue to Authenticated Flow
│   │
│   ├── Expired Session
│   │   ├── Attempt Token Refresh
│   │   ├── Refresh Successful
│   │   │   └── Continue
│   │   └── Refresh Failed
│   │       └── Logout / Authentication Flow
│   │
│   └── No Session
│       └── Authentication / Guest Flow
│
├── Initial Navigation Decision
│   ├── Splash
│   ├── Onboarding Check
│   ├── Authentication Check
│   ├── Permission Check
│   ├── Profile Completion Check
│   ├── Feature Flag Check
│   └── Initial Route
│
├── Authentication Flow
│   ├── Login
│   │   ├── Input
│   │   ├── Validation
│   │   ├── Submit
│   │   ├── API Request
│   │   ├── Success
│   │   │   ├── Store Token
│   │   │   ├── Store User
│   │   │   ├── Initialize Session
│   │   │   └── Navigate to Main Application
│   │   └── Failure
│   │       └── Error Handling
│   │
│   ├── Signup
│   ├── OTP / Verification
│   ├── Forgot Password
│   ├── Reset Password
│   ├── Social Authentication
│   └── Logout
│
├── Main Application
│   │
│   ├── Main Navigation
│   │   ├── Tab / Stack / Drawer 1
│   │   ├── Tab / Stack / Drawer 2
│   │   └── ...
│   │
│   ├── Feature A
│   │   ├── Screen
│   │   ├── User Actions
│   │   ├── State
│   │   ├── Validation
│   │   ├── API
│   │   ├── Storage
│   │   ├── Success Path
│   │   ├── Failure Path
│   │   └── Navigation
│   │
│   ├── Feature B
│   │   └── ...
│   │
│   └── Every Other Discovered Feature
│
├── Global Application Behaviors
│   ├── Network Connectivity
│   ├── Global Loading
│   ├── Global Errors
│   ├── Session Expiration
│   ├── Token Refresh
│   ├── Notifications
│   ├── Deep Links
│   ├── Permissions
│   ├── Background / Foreground
│   ├── App Update Handling
│   └── Analytics
│
└── App Exit / Termination
```

This example is NOT the expected final map.

Replace it with the application's **actual discovered flow**.

For every branch, show:

* Trigger
* Screen
* Condition
* Handler
* State involved
* Service/repository involved
* API involved
* Storage involved
* Result
* Next destination
* Error/fallback branch

Create separate detailed maps for complex features when necessary.

---

# PHASE 34 — SCREEN → ACTION → CODE TRACEABILITY MATRIX

Create a traceability matrix connecting visible application behavior to implementation.

Use a structure such as:

| Screen | UI Element | User Action | Handler | State | Service | API | Result | Next Screen |
| ------ | ---------- | ----------- | ------- | ----- | ------- | --- | ------ | ----------- |

Include every meaningful user interaction discovered.

Examples:

* Buttons
* Icons
* Menu items
* Tabs
* Inputs
* Dropdowns
* Checkboxes
* Radio buttons
* Switches
* Search
* Filters
* Sort
* Swipe actions
* Long press
* Pull-to-refresh
* Pagination
* Modal actions
* Bottom-sheet actions
* Back actions

For each row reference the actual source file/function where possible.

---

# PHASE 35 — API → FEATURE REVERSE MAP

In addition to documenting APIs individually, create the reverse relationship:

```text
API Endpoint
├── Network Function
├── Repository / Service
├── Controller / State
├── Feature
├── Screen(s)
└── User Action(s)
```

This allows someone to answer:

> "If this API changes, which parts of the mobile application could be affected?"

Include all discovered APIs.

---

# PHASE 36 — DATA LIFECYCLE MAP

Trace important data throughout its complete lifecycle.

For every important data entity, explain:

```text
Data Source
↓
API / Database / User Input
↓
Raw Response
↓
DTO / Parsing
↓
Model
↓
Repository
↓
State Management
↓
Screen
↓
User Modification
↓
Validation
↓
API / Database Update
↓
State Refresh
↓
UI Refresh
```

Document where data is:

* Created
* Fetched
* Parsed
* Transformed
* Cached
* Stored
* Read
* Modified
* Synced
* Refreshed
* Invalidated
* Deleted

---

# PHASE 37 — CONDITIONAL LOGIC INVENTORY

Find important conditions controlling application behavior.

Examples:

```text
if user == null
→ Login

if tokenExpired
→ Refresh Token

if list.isEmpty
→ Empty State

if loading
→ Loader

if permissionDenied
→ Permission Handling

if API fails
→ Error State
```

Document actual conditions from the code.

For each important condition include:

* File
* Function
* Condition
* Input/state checked
* True branch
* False branch
* Side effects
* User-visible result

Pay special attention to nested conditions and conditions that change navigation, permissions, API behavior, or data.

---

# PHASE 38 — EVENT & SIDE-EFFECT MAP

Identify important events and side effects.

Examples:

* Screen opened
* Screen resumed
* Button pressed
* State changed
* API completed
* Notification received
* App backgrounded
* App foregrounded
* Network restored
* Token expired
* Permission changed

For each event explain what downstream operations occur.

Example:

```text
User presses Save
↓
validateForm()
↓
Validation passes
↓
setLoading(true)
↓
repository.update(...)
↓
API Request
↓
Response
├── Success
│   ├── Update State
│   ├── Update Local Cache
│   ├── Show Success Message
│   └── Navigate Back
└── Failure
    ├── Stop Loading
    └── Show Error
```

Use actual implementation names.

---

# PHASE 39 — APP LIFECYCLE

Document application behavior during:

```text
Not Running
↓
Launch
↓
Active / Foreground
↓
Inactive
↓
Background
↓
Foreground Again
↓
Termination
```

Explain what happens to:

* Authentication
* API calls
* State
* Timers
* Background services
* Location
* Notifications
* Database
* Cache
* Analytics
* Screens
* Network listeners

Also document Android/iOS differences if implemented.

---

# PHASE 40 — NETWORK BEHAVIOR

Document complete networking behavior.

Include:

* Network client
* Base URL
* Headers
* Authorization injection
* Interceptors
* Request serialization
* Response parsing
* Error parsing
* Status-code handling
* 401 handling
* Token refresh
* Retry
* Timeout
* Cancellation
* Offline handling
* Connectivity detection
* Logging
* Certificate/security configuration

Create the actual request lifecycle:

```text
Feature
→ Repository
→ Service
→ Network Client
→ Interceptor
→ Authentication Header
→ HTTP Request
→ Server
→ HTTP Response
→ Response Interceptor
→ Parsing
→ Repository
→ State
→ UI
```

---

# PHASE 41 — COMPLETE FILE RESPONSIBILITY INDEX

Create a searchable index of meaningful source files.

Use:

| File | Responsibility | Used By | Depends On | Feature |
| ---- | -------------- | ------- | ---------- | ------- |

Do not skip a file merely because it is small.

For very small files, one concise row is enough.

For important files, provide additional explanation.

The goal is that someone can search this MD for a filename and immediately understand why that file exists.

---

# PHASE 42 — IMPORTANT CONSTANTS & CONFIGURATION INDEX

Create inventories for:

* Route names
* API paths
* Storage keys
* Database names
* Table names
* Preference keys
* Event names
* Analytics events
* Notification identifiers
* Deep-link schemes
* Date formats
* Regex patterns
* Pagination sizes
* Timeout values
* Retry counts
* Feature flags
* Environment names
* URLs
* Default values
* Limits
* Status values
* Enum values

For each provide its source file and usage.

Never expose secret values.

---

# PHASE 43 — EDGE CASE BRAIN

Identify edge cases explicitly handled by the application.

Examples include:

* Empty response
* Null values
* Missing fields
* Duplicate data
* Slow network
* No internet
* API timeout
* Unauthorized
* Expired session
* Invalid token
* Deleted user
* Permission denied
* Permission permanently denied
* Missing image
* Invalid URL
* Invalid form
* Double button tap
* Repeated API request
* Pagination end
* Refresh during loading
* App backgrounded during request
* Notification received while open
* Deep link when logged out

Only state an edge case as handled when supported by code.

Separate:

### Explicitly Handled

### Partially Handled

### No Handling Found

### Cannot Determine Statically

---

# PHASE 44 — UNKNOWN / AMBIGUOUS BEHAVIOR

Create a dedicated section for things that cannot be confidently determined from static code inspection.

Use:

| Area | Question | Evidence Found | Why Uncertain | Runtime Verification Needed |
| ---- | -------- | -------------- | ------------- | --------------------------- |

Never fill documentation gaps with assumptions.

This section is extremely important because this Markdown file will be used as an **AI knowledge source**.

Incorrect knowledge is worse than missing knowledge.

---

# PHASE 45 — AI CODEBASE KNOWLEDGE RULES

At the beginning of the final documentation add rules for any future AI using this file.

The rules must include:

1. This document describes the repository at the documented commit/version.
2. Source code remains the final authority.
3. Never invent missing behavior.
4. Distinguish confirmed behavior from inference.
5. Verify implementation before modifying a feature.
6. Check the Change Impact Map before making changes.
7. Check related screens, services, models, APIs, storage, and tests before modifying functionality.
8. Preserve existing behavior unless a change explicitly requires otherwise.
9. Treat potentially unused code cautiously.
10. Never expose secrets from configuration.
11. When this document conflicts with current code, current code wins.
12. Update this document when architecture or behavior changes.

---

# PHASE 46 — DOCUMENT METADATA

At the top of the MD generate:

```markdown
# Mobile Application — Complete Codebase Brain

## Documentation Metadata

- Generated From: Actual Source Code
- Repository:
- Branch:
- Commit:
- Generated Date:
- Mobile Framework:
- Language:
- Application Version:
- Android Version:
- iOS Version:
- Documentation Scope: Complete Mobile Application
- Confidence: Static Code Analysis
```

Populate values only when they can actually be determined.

---

# PHASE 47 — FINAL DOCUMENT STRUCTURE

Generate the final Markdown in a logical order similar to:

```text
01. Documentation Metadata
02. AI Usage Rules
03. Executive Overview
04. Technology Stack
05. Repository Structure
06. Architecture
07. Application Startup
08. Complete Application Flow
09. Navigation
10. Feature Inventory
11. Screen Inventory
12. Screen Details
13. User Flows
14. Components
15. State Management
16. Data Models
17. API & Networking
18. Authentication
19. Storage & Database
20. Forms & Validation
21. Design System
22. Permissions
23. Notifications
24. Background Processing
25. App Lifecycle
26. Error Handling
27. Analytics & Logging
28. Security
29. Native Android
30. Native iOS
31. Environment & Configuration
32. Third-Party Dependencies
33. Testing
34. Function / Method Knowledge Map
35. Feature Knowledge Map
36. Data Lifecycle Map
37. Conditional Logic Inventory
38. Event & Side-Effect Map
39. Screen → Code Traceability Matrix
40. API → Feature Reverse Map
41. File Responsibility Index
42. Constants & Configuration Index
43. Edge Cases
44. Change Impact Map
45. TODO / FIXME Inventory
46. Potential Dead / Legacy Code
47. Unknown / Ambiguous Behavior
48. Glossary
49. Final Codebase Knowledge Summary
```

You may add additional sections when the repository requires them.

Do NOT remove important sections merely because they make the document large.

---

# PHASE 48 — CROSS-REFERENCE EVERYTHING

The final documentation should behave like a knowledge graph.

When documenting a screen, reference its:

* Feature
* Navigation route
* State
* Model
* API
* Storage
* Components

When documenting an API, reference its:

* Service
* Repository
* State
* Screen
* Feature

When documenting a model, reference:

* APIs producing it
* State storing it
* Screens consuming it

When documenting storage, reference:

* Writers
* Readers
* Cleanup logic

The reader should be able to move conceptually:

```text
Feature
↕
Screen
↕
Component
↕
State
↕
Repository
↕
Service
↕
API
↕
Model
↕
Storage
```

---

# PHASE 49 — VALIDATION PASS BEFORE COMPLETION

Before considering the MD complete, perform a second pass over the repository.

Verify:

* Did I inspect every source directory?
* Did I capture every screen?
* Did I capture every navigation route?
* Did I capture every major component?
* Did I capture every API?
* Did I capture every model?
* Did I capture every state-management unit?
* Did I capture every storage mechanism?
* Did I capture every permission?
* Did I capture every meaningful dependency?
* Did I capture Android configuration?
* Did I capture iOS configuration?
* Did I capture environment configuration?
* Did I capture important constants?
* Did I capture validation?
* Did I capture error handling?
* Did I capture lifecycle behavior?
* Did I capture tests?
* Did I capture TODO/FIXME?
* Did I capture important conditional behavior?
* Did I capture small implementation details?
* Did I cross-reference related functionality?

If something was missed, update the document before finishing.

---

# PHASE 50 — COVERAGE REPORT

At the end provide a coverage report.

Use:

| Area           | Status                   | Confidence      | Notes |
| -------------- | ------------------------ | --------------- | ----- |
| Architecture   | Complete/Partial/Unknown | High/Medium/Low |       |
| Screens        |                          |                 |       |
| Navigation     |                          |                 |       |
| APIs           |                          |                 |       |
| Models         |                          |                 |       |
| State          |                          |                 |       |
| Storage        |                          |                 |       |
| Authentication |                          |                 |       |
| Permissions    |                          |                 |       |
| Notifications  |                          |                 |       |
| Native Android |                          |                 |       |
| Native iOS     |                          |                 |       |
| Tests          |                          |                 |       |
| Security       |                          |                 |       |
| Configuration  |                          |                 |       |

Do NOT mark something Complete simply because no more files were immediately found.

---

# FINAL EXECUTION INSTRUCTION

Now execute this task against the repository.

## Step 1 — Discovery

First, recursively inspect the repository and build an internal inventory.

Do NOT generate the final MD immediately.

## Step 2 — Relationship Analysis

Trace relationships between:

```text
Screens
↔ Navigation
↔ Components
↔ State
↔ Business Logic
↔ Repositories
↔ Services
↔ APIs
↔ Models
↔ Storage
↔ Native Code
```

## Step 3 — Flow Analysis

Trace application startup and every discovered feature end-to-end.

## Step 4 — Detail Pass

Perform another repository scan specifically looking for details missed during the architectural analysis:

* Constants
* Conditions
* Validation
* Storage keys
* Error handling
* TODOs
* Edge cases
* Platform checks
* Lifecycle behavior
* Magic values
* Utility functions

## Step 5 — Generate Documentation

Create:

`MOBILE_CODEBASE_BRAIN.md`

If a documentation directory already exists and follows an established convention, place it there instead.

## Step 6 — Verification Pass

After generating the file, compare its coverage against the repository again.

Update missing sections.

## Step 7 — Final Report

After completion, report:

```text
Documentation Generated:
Path:

Repository Files Inspected:
Source Files Documented:
Screens Found:
Features Found:
Routes Found:
API Operations Found:
Models Found:
State Units Found:
Storage Mechanisms Found:
Reusable Components Found:
Permissions Found:
Tests Found:
TODO/FIXME Found:

Coverage:
Known Gaps:
Runtime Verification Required:
```

Do not fabricate counts. Calculate them from the files actually inspected.

---

# DEPTH REQUIREMENT

This is intentionally supposed to be a **large and extremely detailed Markdown file**.

Do not shorten the documentation for readability at the cost of missing implementation knowledge.

The priority order is:

**Accuracy > Completeness > Traceability > Detail

================================================================================
END PART B — resume TerriTool vault phases (Phase 1 frontal lobe)
================================================================================

================================================================================
PHASE 1 — FRONTAL LOBE
================================================================================
Create AI_BRAIN.md at the workspace root (or the path the human named). Include ALL sections. If a section does not apply, keep the heading and write “None” + what you searched.

1. Project overview — product, roles table, repos table, live URLs table
2. Commands — dev, test, lint, build, deploy, brain graph, brain evals (from package.json / Makefile / composer / artisan / README that matches code)
3. Architecture and data flows — mermaid from real paths (client → API → DB → third parties)
4. Style guide — languages, folders, “match this file”, do-not-modernize, do-not-add
5. Durable facts, constraints, known drift — table: old claim vs live truth vs source
6. Users and roles
7. Vocabulary — product word vs code name vs never-say
8. Product features — every major and minor feature as a table pointing at features/*.md
9. Money / credits / packages / billing (or None + proof)
10. Client app(s) — screen counts, state library, navigation kind
11. Backend / web — framework, giant controllers, helpers
12. API catalog — method + path + auth + handler + request shape source
13. Web URL catalog — if web exists; else None
14. MCP servers and tools — from config only; operating rules; omit invented tools
15. Voice / chat agent policy — length, no invented data; else None
16. Data models — tables/collections you opened
17. Integrations
18. Cross-system flows — login, core job, money, sync
19. Testing and QA
20. How to update this brain — code first, then note, then drift row, then evals, then graph rebuild

Appendices in the frontal lobe:
A. Method source (Google AI Mode three steps: rules file, markdown vault, seed facts)
B. Reading order for a new agent
C. Primary nav map (tabs, sidebar, or routes)

Tone: agents will follow this. Short sentences. Tables over prose.

================================================================================
PHASE 2 — ATOMIC VAULT (create every path)
================================================================================
Create AI_BRAIN/ with YAML frontmatter on every note:

---
id: kebab-id
parent: core|features|brains|design|design-web|ops|screens|data|code
sources:
  - real/path/from/repo
related:
  - other-note.md
---

Required tree (create all files; “None” is allowed inside a file, deleting the file is not):

AI_BRAIN/
  README.md
  index.md
  schema.md
  01-project-overview.md
  02-commands.md
  03-architecture.md
  04-style-guide.md
  05-constraints-and-drift.md
  06-users-and-roles.md
  07-vocabulary.md
  09-<money>.md                      # billing/credits/entitlements; if none, file says None
  10-<client>.md
  11-<backend>.md
  12-<api-catalog>.md
  13-<web-urls>.md
  14-mcp.md
  15-voice-policy.md
  16-data-models.md
  17-integrations.md
  18-cross-system-flows.md
  19-testing-qa.md
  20-how-to-update.md
  appendix-a-google-source.md
  appendix-b-reading-order.md
  appendix-c-nav-map.md
  YYYY-MM-DD.md                      # ingest log for this build
  brains/README.md
  brains/<surface>-code.md           # one hub per real surface (client, web, api, infra)
  brains/<surface>-ui.md             # one hub per real UI
  brains/api.md
  features/README.md
  features/01-… through N-….md       # one note per major feature from the matrix
  code/README.md
  code/<surface>-details.md          # folder/file map
  code/MOBILE_CODEBASE_BRAIN.md      # full source.txt Phase 47 dump (required)
  code/WEB_CODEBASE_BRAIN.md         # same depth for web (or “None”)
  prompts/generate-brain.md          # this combined file (only prompt to copy)
  data/formdata-dictionary.md        # or json-body-dictionary.md — keys from actual callers
  data/database-columns.md
  ops/README.md
  ops/env-inventory.md               # NAMES only
  ops/known-bugs.md
  ops/decision-log.md
  ops/release-flavor-matrix.md
  screens/how-it-works.md            # lifecycle of login, money, core job
  screens/navigation-map.md          # who navigates where
  design/                            # Phase 3 — always create
  design-web/                        # Phase 3 — always create (None if no web UI)
  retrieve.py
  graph-server.py
  graph.html
  scripts/build-graph.py
  api/chat.js
  api/health.js
  vercel.json
  .env.example
  .gitignore                         # must include .env
  evals/run.py
  evals/cases.jsonl
  CLAUDE.md                          # if brain lives at repo root; else also at workspace root
  AGENTS.md                          # same

index.md must list every note. schema.md must state: one concept per file, code wins, no secrets, update protocol, naming, graph uses markdown links not YAML-only related.

SUB-BRAINS
Each brains/*.md is a hub: when to open it, invariants, pointers into features/code/design/screens. Not a dump. Minimum hubs: api, plus one code hub per app, plus one UI hub per visual surface.

================================================================================
PHASE 3 — DESIGN BRAINS (always)
================================================================================
Even with no stills: extract tokens from theme/CSS and write MINI + inventory from CODE. Mark visuals NMV/deferred.

Mobile or primary client → AI_BRAIN/design/
Web → AI_BRAIN/design-web/
If two web stacks exist (legacy + new), document both and write “do not mix.”

Create ALL of:

design/
  README.md
  MINI-DESIGN-BRAIN.md
  MASTER-DESIGN-BRAIN.md
  01-Brand-Guidelines/README.md
  01-Brand-Guidelines/Colors.md
  01-Brand-Guidelines/Typography.md
  01-Brand-Guidelines/Logos.md
  01-Brand-Guidelines/Icons.md
  01-Brand-Guidelines/Spacing.md
  01-Brand-Guidelines/Shapes-and-Radius.md
  01-Brand-Guidelines/Shadows-and-Elevation.md
  01-Brand-Guidelines/Brand-Usage-Rules.md
  02-User-Interface/README.md
  02-User-Interface/Screen-Inventory.md
  02-User-Interface/Components.md
  02-User-Interface/Navigation.md
  02-User-Interface/States.md
  02-User-Interface/Forms.md
  02-User-Interface/Modals-and-Popups.md
  02-User-Interface/Feedback-and-Notifications.md
  02-User-Interface/Maps.md            # or “no maps”
  02-User-Interface/Platform-Differences.md
  03-Assets/README.md
  03-Assets/Asset-Inventory.md
  03-Assets/Images/README.md
  03-Assets/Logos/README.md
  03-Assets/Icons/README.md
  03-Assets/Fonts/README.md            # inventory; do not copy TTF unless human asks
  04-User-Flows/README.md
  04-User-Flows/<one file per real flow>.md
  05-Design-System/README.md
  05-Design-System/Design-Tokens.md
  05-Design-System/Components.md
  05-Design-System/Component-States.md
  05-Design-System/Usage-Rules.md
  05-Design-System/Token-Inconsistencies.md
  06-Coverage/README.md
  06-Coverage/Functionality-Coverage-Matrix.md
  06-Coverage/Screenshot-Video-Index.md
  06-Coverage/Mobile-Screenshot-Flow.md   # or Client-Screenshot-Flow.md
  06-Coverage/Needs-Manual-Verification.md
  06-Coverage/Deferred-Scope.md

design-web/ equivalent: MINI, MASTER or README, Tokens, Page-Inventory, Navigation, Usage-Rules, Token-Inconsistencies, Deferred-Scope, Screenshot-Index, 03-Assets/README.md

Screenshot ingest rules:
- Number or name stills per screen/flow folder if the human gave an organized pack.
- Table: filename vs pixels vs code screen.
- Ignore HTML replica folders.
- Dev-only chrome (crash test, preview paywall, log out dev) is labeled dev, not product.
- Link each flow note to the screenshot map with markdown (so the graph connects).
- Ingest log YYYY-MM-DD.md lists packs landed; binaries stay on disk.

MINI-DESIGN-BRAIN.md must include: app-in-one-paragraph, tokens, nav, screen inventory condensed, components, states, do/do-not, inconsistencies not to normalize, deferred, NMV, go-deeper links.

================================================================================
PHASE 4 — AGENT LOADERS (all three, same map)
================================================================================
Create at the workspace root (and copy into AI_BRAIN/ if the vault is its own git root):

1. .cursor/rules/ai-brain.mdc
   - alwaysApply: true
   - session start: read AI_BRAIN.md then matching vault file
   - table: task → files to read (product, client code, client UI, web code, web UI, API, lifecycle, env names, index)
   - must-follow bullets from THIS product (never-invent + match-nearest)

2. CLAUDE.md — same reading map (Claude Code)

3. AGENTS.md — same reading map (Codex)

Also write appendix-b-reading-order.md with the numbered list.

================================================================================
PHASE 5 — RETRIEVAL + GRAPH + ASK (always)
================================================================================
If the reference TerriTool AI_BRAIN path was provided, COPY these files and rebrand strings (product name, SYSTEM prompt, never-invent list). If not, reimplement the same contracts.

Contracts:
- retrieve.py — BM25 over markdown chunks. Strip YAML frontmatter before scoring. Return top chunks with note paths. No embeddings required.
- scripts/build-graph.py — walk all .md (skip .git, node_modules, evals, scripts, api, .vercel). Nodes = notes. Links = markdown [text](href) to other notes. Embed DATA into graph.html. Write graph-search.json from lowercase note bodies (search matches body, not just filenames). Print node/link counts.
- graph.html — Obsidian-style force graph, cluster by folder, search box using graph-search.json, click node, click citation in Ask, zoom not insanely close on one node, chat drawer with flex min-height 0 so citations scroll.
- graph-server.py — bind 127.0.0.1, serve vault, POST /api/chat: retrieve notes, call Anthropic with citations, never put API key in HTML. Rate limit. Optional GRAPH_CHAT_SECRET via header x-brain-secret or Bearer.
- api/chat.js — Vercel function, same retrieve + Anthropic, include **/*.md, maxDuration 60.
- api/health.js
- vercel.json — / redirects to /graph.html; functions include markdown.
- .env.example:
    ANTHROPIC_API_KEY=
    ANTHROPIC_MODEL=claude-sonnet-5
    ANTHROPIC_VERSION=2023-06-01
    GRAPH_CHAT_SECRET=
- .gitignore includes .env
- SYSTEM prompt: answer from attached notes; code wins; do not invent tools/keys/prices; if missing say so; never print secrets.

After notes exist: run python3 scripts/build-graph.py
README.md documents:
  cp .env.example .env
  python3 graph-server.py
  open http://127.0.0.1:8765/graph.html
  python3 evals/run.py
  npx vercel --prod --yes   (only if human asked to deploy)

================================================================================
PHASE 6 — EVAL HARNESS (always)
================================================================================
evals/cases.jsonl — at least 40 cases (more if the product is large). Each line:
{"id":"kebab","question":"natural question","expected_notes":["primary.md","also.md"]}

Cover: money, auth, API keys/request bodies, tools/MCP, primary nav, “how do I add X”, known drift, env names, core job lifecycle, UI token, at least one trap where docs used to lie.

evals/run.py — no API key. BM25 retrieve. Floors: top-1 >= 70%, recall@6 >= 95%. Exit 1 on fail. Print misses.

Write cases from the notes you actually created. Run the eval. If it fails, fix notes or questions (not the floor) until PASS, or report remaining misses with evidence.

================================================================================
PHASE 7 — WIRING (always)
================================================================================
- Every hub README tables to children with markdown links.
- Screenshot map links to each flow note; each flow note links back.
- Coverage README lists matrix, screenshot index, screenshot flow, NMV, deferred.
- index.md lists design, design-web, screens, data, ops, evals command, graph command.
- 20-how-to-update.md says: patch code, patch note, drift row, python3 evals/run.py, python3 scripts/build-graph.py.
- Ingest log YYYY-MM-DD.md links the packs and the screenshot map.

Rebuild the graph after wiring. Report node count, link count, orphan notes (deg 0). Frontal AI_BRAIN.md may remain outside the vault graph; that is OK. No other orphans: fix with markdown links.

================================================================================
PHASE 8 — VERCEL / GITHUB (do the files always; deploy only if asked)
================================================================================
Always write vercel.json, api/chat.js, api/health.js, .env.example.
Document Vercel project env names: ANTHROPIC_API_KEY, optional ANTHROPIC_MODEL, optional GRAPH_CHAT_SECRET.
If the human said “push/deploy”: commit without secrets/binaries, push, vercel --prod.
If they did not: leave deploy steps in README and do not deploy.

================================================================================
QUALITY BAR (must all pass)
================================================================================
- Every API row cites a route file or client caller.
- Every price/credit/plan cites a helper or config file.
- Every MCP/tool row cites the tool config. Zero invented tools.
- Drift table includes every README/Prompts contradiction you found.
- Env inventory has names only.
- index.md lists every note you created.
- Filename vs pixels table exists if stills were provided.
- MOBILE_CODEBASE_BRAIN.md contains source.txt Phase 47 sections (or a written None + search proof).
- evals/run.py PASS or a written miss list with why.
- graph build prints nodes and links; search matches note bodies.
- CLAUDE.md, AGENTS.md, and the Cursor rule contain the same reading map.
- No .env committed. No screenshot binaries in git.

================================================================================
DELIVER TO THE HUMAN
================================================================================
1. File tree written.
2. Coverage matrix (documented / NMV / deferred / none-in-repo).
3. Graph stats (nodes, links, orphans).
4. Eval stats (cases, top-1, recall@6, PASS/FAIL).
5. The 10 facts an agent will get wrong without this brain.
6. How to run graph locally and what env names to set (not values).
7. What was not deployed because they did not ask (if applicable).

---

## Information required from you (checklist)

Fill this before pasting **this one file**:

- [ ] Product name and one paragraph
- [ ] Absolute paths to every repo
- [ ] Roles
- [ ] Env names + public URLs (no secrets)
- [ ] Auth mechanism
- [ ] Money/credits/plans or NONE
- [ ] Integrations list
- [ ] MCP URLs if any
- [ ] Never-invent list
- [ ] Never-change / match-nearest list
- [ ] Old docs that lie
- [ ] Screenshot folder paths
- [ ] Path to an existing TerriTool `AI_BRAIN/` if you want graph scripts copied instead of rewritten
- [ ] Whether to commit / push / Vercel this time
