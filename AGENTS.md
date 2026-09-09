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
