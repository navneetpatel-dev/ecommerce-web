<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Frontend Component Architecture & Styling Standards

All React components across `web/` must adhere to strict separation of concerns and styling rules:

## 1. Pure JSX Presentation

- **Zero Business/State Logic in JSX Components**: Components where JSX is returned must not hold state or business logic (`useState`, `useEffect`, data transformations, or raw formatting). All state, lifecycle, and business logic must be encapsulated in dedicated custom hooks (e.g. `use[Component].hook.ts`).
- **No Inline Functions in JSX**: Event handlers (e.g., `onClick`, `onChange`, `onOpenChange`) must never use inline arrow functions (`onClick={() => ...}`). Handlers must be defined in the hook or component scope and passed as direct references (`onClick={handleDownloadClick}`).
- **No Inline `.map()` Calls**: Array mapping must never be written directly inside parent component JSX trees. Collection rendering must be extracted into dedicated list/renderer components (e.g. `[Feature]List.component.tsx` or `[Feature]TableBody.component.tsx`).
- **Neat & Clean JSX**: The component file should purely express the semantic UI layout and structure. To inspect logic or styling, developers refer to the respective companion files.

## 2. Centralized & Reusable Styling

- **No Hardcoded Class Names**: String literals for Tailwind/CSS classes (e.g. `className="space-y-4 border..."`) must never be hardcoded directly into JSX elements.
- **Centralized Style Dictionaries**: Every component or feature module must maintain a companion `*.styles.ts` file (e.g. `overviewSection.styles.ts`, `commissionInvoicesTable.styles.ts`) that exports named style objects typed `as const` (e.g., `styles.container`, `styles.heading`, `styles.tableCellStandard`).
- **Reusable UI Classes**: Reusable layout and token compositions should be imported from shared style constants where applicable.

**## 3. Modular & Reusable Architecture**

- **Separation of Concerns**: Keep business logic, state management, API interaction, data transformation, event handling, and side effects outside JSX-focused components. Move them into appropriate custom hooks, services, utilities, or module-specific files.
- **Small & Focused Files**: Components, pages, containers, hooks, utilities, services, and other TypeScript/TSX files must remain small and focused on a single responsibility. Split large files into logical, reusable modules when necessary.
- **Maximum Reuse**: Before creating new functionality, component, hook, utility, type, schema, API method, style, or constant, search the existing codebase and reuse or extend an existing implementation whenever appropriate.
- **Avoid Duplication**: Eliminate duplicated business logic, UI logic, API logic, schemas, types, constants, styles, utilities, and component implementations. Maintain a single source of truth wherever practical.
- **No Unnecessary Abstraction**: Do not create abstractions merely to reduce line count. Create shared abstractions when they provide genuine reuse, consistency, or maintainability.

**## 4. Folder & File Structure**

- Maintain a **clear, predictable, scalable folder structure** for components, hooks, styles, APIs, schemas, utilities, types, constants, and other frontend resources.
- **Module-specific files must remain grouped by module/feature** rather than being scattered across unrelated global folders.
- When a module contains many components, hooks, or styles, create appropriate subfolders to keep them organized and easy to navigate.
- Keep related files together where practical, for example:

  - `components/`
  - `hooks/`
  - `styles/`
  - `api/`
  - `schemas/`
  - `utils/`
  - `types/`
  - `constants/`

- Place genuinely reusable cross-module resources in appropriate shared/common directories.
- Do not move module-specific logic into shared folders unless it is genuinely reusable.
- Avoid deeply nested or unnecessarily fragmented folder structures.

**## 5. Hooks & Business Logic**

- Custom hooks are the primary location for component-specific state, business logic, side effects, event handlers, API orchestration, and derived state.
- Prefer dedicated hooks such as `use[Feature].hook.ts` or `use[Component].hook.ts` following the existing project naming convention.
- Hooks should also remain modular; extract reusable logic into smaller hooks or utilities when they become large.
- Components must consume hook outputs rather than reimplementing business logic.

**## 6. API & Schema Architecture**

- API clients, endpoint definitions, request/response types, schemas, API hooks, and API-related transformations must be properly separated and organized.
- Avoid defining API requests, Zod schemas, or large request/response types directly inside UI components.
- Reuse existing API methods, schemas, types, and API utilities instead of creating duplicates.
- Maintain clear boundaries between UI, hooks, API services, and validation/schema logic.

**## 7. JSX Cleanliness**

- JSX-returning components should contain **only clean UI composition and presentation**.
- Do not place complex expressions, data processing, filtering, sorting, formatting, mapping, state calculations, or business decisions directly inside JSX.
- Extract repeated or complex rendering into dedicated components.
- Extract collection rendering into dedicated list/table/renderer components rather than placing complex `.map()` implementations inside parent JSX.
- Event handlers must be prepared outside JSX and passed as references.
- The goal is that a developer can understand the component's UI structure by reading the JSX without having to inspect business logic.

**## 8. Styling Consistency**

- All styling must follow the existing centralized styling architecture.
- Do not introduce hardcoded or duplicated class-name strings in components.
- Reuse existing style definitions whenever applicable.
- Feature/module-specific styles should remain with their respective feature/module.
- Shared styles should be centralized and reused rather than duplicated across components.
- Maintain the existing `*.styles.ts` convention and extend existing style dictionaries when appropriate.

**## 9. Refactoring & Safety**

- Before modifying code, inspect the relevant module and its dependencies to understand existing patterns and reusable implementations.
- Refactor incrementally and preserve all existing functionality.
- **Do not break existing features, UI behavior, API contracts, validation, state behavior, permissions, navigation, or user flows.**
- Do not perform unnecessary rewrites when a targeted refactor is sufficient.
- Preserve existing project conventions unless there is a clear architectural reason to improve them.
- After refactoring, verify TypeScript compilation, linting, tests, and the production build where available.
- Any additional architectural, maintainability, performance, accessibility, or code-quality issues discovered during the audit should also be addressed when they can be safely fixed without changing intended behavior.

**## 10. Mobile Shell & Safe Areas**

- The root viewport sets `viewport-fit: "cover"`, so the page extends under the status bar, notch and home indicator. Anything pinned to a viewport edge must carry the matching `env(safe-area-inset-*)` offset; `npm run lint` fails otherwise (`scripts/check-safe-area-offsets.mjs`).
- Bottom-rail offsets (tab-bar clearance, sticky bars, compare bar, toasts) come from `src/shared/constants/layout/mobileRails.ts` — never retype those class strings.
- Text fields render at 16px on phones (`text-[1rem] sm:text-body`). iOS Safari zooms the page when a focused field is under 16px.
- Device emulation **injects** safe-area insets, so it cannot verify them. For any layout, viewport or rail change, run the manual pass in `MOBILE-DEVICE-CHECKLIST.md`.

**## 11. Accessibility & Formatting Conventions**

- Every shell `<main>` carries `id={MAIN_CONTENT_ID}` (from `shared/constants/a11y/landmarks`) and `tabIndex={-1}`: the skip link and the route announcer both target it. `npm run lint` fails otherwise (`scripts/check-page-structure.mjs`).
- Every feature with a `pages/` directory, and every `src/app` route that renders `<main>`, must render an `<h1>` (visually hidden is fine). Same guard.
- Client-side navigation is announced by `RouteAnnouncer` and focus moves into the page body. Do not add a second announcer; put page-specific copy in the page's own `<h1>`.
- Do not render dates/times with bare `toLocaleDateString()` / `toLocaleTimeString()` / `toLocaleString()` — use `formatDate` / `formatTime` / `formatDateTime`, or pass a locale. `scripts/check-date-locale.mjs` enforces it.
- Shared, repeated a11y primitives live in `shared/components/a11y`, `shared/hooks/a11y`, `shared/utils/a11y` and `shared/styles/a11y`.
- Result counts that change without a navigation (filtering, paging) must be a `role="status"` region — `PaginationResultSummary` and the listing `SortBar` already are.
- Data tables get their structure from `DataTable`: every header cell is `scope="col"` and the table is named by its `title`. Do not hand-roll a table.
- Reversible destructive actions offer undo through a toast callback action (`notifySuccess(message, { label, onClick })`); reserve confirm dialogs for irreversible ones.
- Long forms call `useUnsavedChanges(form.formState.isDirty)`. Forms use `mode: "onTouched"` so errors appear on blur, not only on submit.
- Phone input is validated and stored through `shared/schemas/phone.schema` + `shared/utils/validation/phoneNumber` — never a local regex.
- Structured data is server-generated from visible content only: `Product`/`BreadcrumbList` (PDP, category), `Article` (help articles), `Store` (vendor storefronts), `Organization`/`WebSite` (home). Add a builder to `shared/seo/structured-data.ts` rather than inlining JSON-LD.
