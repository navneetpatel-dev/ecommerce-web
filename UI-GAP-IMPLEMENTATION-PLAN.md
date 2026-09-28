# UI gap remediation — implementation plan

**Scope:** frontend only (`web/`). Every change below is additive or a like-for-like
refactor: no API contract changes, no new dependencies, no new design tokens, no raw
colour/px values, no animation that isn't already declared in
`shared/styles/globals.css` `@theme`.

**Source of truth for "done" in each workstream** — run all of these:

```bash
cd web
npm run typecheck        # tsc --noEmit
npm run lint             # eslint + raw-error-message guard + client-money-math guard
npm run test             # vitest
npm run limits           # per-file line ceilings (scripts/check-line-limits.mjs)
npm run build && npm run budgets
```

---

## 0. Guardrails — what every line of this plan must obey

### 0.1 The only values you may use

| Concern           | Tokens (already in `shared/styles/globals.css`)                                                                                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Surfaces          | `surface`, `surface-raised`, `paper`, `line`, `line-strong`, `overlay`                                                                                                                                            |
| Text              | `ink`, `ink-muted`, `ink-faint`                                                                                                                                                                                   |
| Brand/interaction | `brand`, `brand-hover`, `brand-subtle`                                                                                                                                                                            |
| Semantic          | `accent`/`accent-subtle`, `danger`/`danger-subtle`, `success`/`success-subtle`, `warning`/`warning-subtle`                                                                                                        |
| Type scale        | `text-display-lg                                                                                                                                                                                                  | md  | sm`, `text-h1 | h2  | h3`, `text-body-lg | body | body-sm`, plus the `.text-eyebrow`class and`text-label`/`text-mono` |
| Radii             | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`, `rounded-card`, `rounded-button`, `rounded-input`                                                                                                       |
| Elevation         | `shadow-elevation-1..4`, `shadow-card-hairline(-strong)`                                                                                                                                                          |
| Motion            | `animate-fade-in`, `animate-slide-in-{left,right,bottom}`, `animate-scale-in`, `animate-shimmer`, `animate-pulse-scale`, `animate-pulse-ring`, `animate-accordion-{down,up}` + `duration-*` bound to `--motion-*` |
| Spacing           | the 8px scale (`gap-*`, `p-*`, `space-y-*`, `py-*` …)                                                                                                                                                             |

`prefers-reduced-motion` already collapses every `--motion-*` token to `0ms` globally
(`globals.css`) and the pre-hydration script in `app/layout.tsx` applies
`data-theme`, so nothing in this plan needs a per-component theme or motion opt-in.

### 0.2 The only components/utilities you may reach for

- Primitives: `@/shared/components/ui/{button,input,select,textarea,label,dialog,toast,tabs,accordion,badge,card,skeleton,switch,tooltip,popover,table,separator,progress,avatar,checkbox,radio-group,slider}`
- Shared building blocks: `EmptyState`, `MoneyAmount`, `QueryErrorAlert`, `ErrorFallbackActions`, `StatusBadge`, `Skeleton*` (`SkeletonRows/Grid/Card/ChartCard/ReviewList/DetailQuery`), `DataTable`, `RecordDetailDialog`, `BottomSheet`, `DisabledActionHint`, `FormFieldFrame`/`FormError`, `Pagination*`, `StatCard`, `TruncatedText`
- Shared style groups: `shared/styles/common.styles.ts` (`PANEL_SURFACE`, `PANEL_SURFACE_RAISED`, `PANEL_ELEVATED`, `PANEL_HEADER`, `PANEL_EMPTY_STATE`, `PANEL_DASHED`, `ROW_BETWEEN`, `FLEX_CENTER_GAP_2`, `STOREFRONT_SPLIT_*`, `storefront-container` …) — compose with `cn()`.
- Copy: `LABELS` (`shared/constants/labels.ts` + `labels/*.ts` subsets). **No string literals in components.**
- Routes: `PATHS` (`shared/constants/paths/paths.ts`). **No path literals in components.**
- Money/date: `formatInr`, `formatInrAmount`, `formatOrderDate`, `MoneyAmount` (`shared/utils/formatting/orderFormat.ts`). Never `₹` + arithmetic (guarded by `scripts/check-no-client-money-math.mjs`).
- Icons: `lucide-react` only.
- Class strings live in a sibling `*.styles.ts` object typed `as const`; components only reference `styles.x` / `commonStyles.x`.

### 0.3 Layering (enforced by `eslint.config.mjs` + `FRONTEND-STRUCTURE-CONVENTIONS.md`)

```
features/<feature>/
  api/<functionality>/<file>.api.ts
  components/<functionality>/<file>.component.tsx   # presentation only, no state/map/inline arrows
  hooks/<functionality>/<file>.hook.ts              # all state, effects, handlers, derivations
  styles/<functionality>/<file>.styles.ts           # every class string
  stores/<functionality>/<file>.store.ts            # cross-route client state
  constants/ types/ utils/
app/<segment>/<route>/{page.tsx,loading.tsx,error.tsx,not-found.tsx}  # thin wrappers + metadata
shared/…                                            # never imports features/ or app/
```

Line ceilings (`npm run limits`): route files `page|layout|loading|error|not-found.tsx` ≤ 120,
hooks ≤ 150, everything else `.ts`/`.tsx` ≤ 200. Split new files to fit.

### 0.4 Responsive contract — every workstream obeys this

**Breakpoint tokens** (single scale, declared once in `globals.css` `@theme`; never invent one):

| Token | Min width      | Device band                         |
| ----- | -------------- | ----------------------------------- |
| —     | 0              | small phone (360–479)               |
| `xs`  | 30rem / 480px  | large phone                         |
| `sm`  | 40rem / 640px  | phone landscape / small tablet      |
| `md`  | 48rem / 768px  | **tablet portrait**                 |
| `lg`  | 64rem / 1024px | **tablet landscape / small laptop** |
| `xl`  | 80rem / 1280px | desktop                             |
| `2xl` | 96rem / 1536px | wide desktop                        |

Mobile-first only: base → `sm:` → `md:` → `lg:` → `xl:`. `max-*:` variants are allowed only as
"stop at" overrides (the header already does this, e.g. `max-sm:h-9`). No `@media` blocks in
`*.styles.ts` — the only media queries in the repo live in `globals.css`.

**Where each surface actually switches** (measured from the code, not assumed):

| Surface                                         | Switches at                                                       | Class that owns it                                                                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storefront mobile tab bar                       | visible < lg                                                      | `mobileTabBarStyles.nav` (… `lg:hidden`)                                                                                                                      |
| Storefront hamburger / full nav + header search | hamburger + mobile search < **xl**; full nav + header search ≥ xl | `header.styles.ts`: `desktopNav: hidden xl:flex`, `menuButton: xl:hidden`, `searchWrapper: hidden xl:flex`, `searchButtonSkeleton: hidden lg:block xl:hidden` |
| Storefront search sheet                         | < xl (`hideFrom="xl"`)                                            | `MobileOverlays.component.tsx`                                                                                                                                |
| Dashboard sidebars + workspace drawer           | sidebar ≥ lg, drawer < lg                                         | `sidebarNavStyles.aside` (`hidden lg:flex`), `workspaceNavDrawerStyles.backdropWrapper` (`lg:hidden`)                                                         |
| Data tables ↔ mobile cards                      | table ≥ lg, cards < lg                                            | `TABLE_CARD_MOBILE_LIST` (`lg:hidden`), `TableScrollShell` (`hidden lg:block`)                                                                                |
| PLP filter/sort                                 | sidebar ≥ **xl**, mobile action bar + bottom sheets < xl          | `filterSidebar.styles.ts` (`hidden w-64 … xl:block`), `mobileBarRoot` (`xl:hidden`)                                                                           |
| PLP grid columns                                | 2 / 3 / 3 / 4                                                     | `productGrid.styles.ts.grid` (`grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4`)                                                                     |
| PDP sticky add-to-cart                          | < md only                                                         | `productDetailContent.styles.ts` `stickyBarRoot` (`md:hidden`, `bottom-14`)                                                                                   |
| Checkout / PDP split layout                     | ≥ lg                                                              | `STOREFRONT_SPLIT_LAYOUT` / `_MAIN` / `_ASIDE` in `common.styles.ts`                                                                                          |
| Compare section grid                            | 1 / 2 / — / 4                                                     | `productCompareSection.styles.ts` (`grid gap-4 md:grid-cols-2 xl:grid-cols-4`)                                                                                |

**Interaction rules for anything this plan adds** (design spec §3.3, §3.5, §6.8):

1. **44×44px minimum tap area at every band up to and including lg** (touch laptops count). The
   repo enforces this by locking controls to `h-11` (`button.tsx`: "Project control height is
   fixed at 44px for all sizes"). New interactive elements either use `Button`/`Input`/`Select`
   or carry `min-h-11`. Never justify a smaller control with "there's spacing around it" —
   spacing is not tap area.
2. **Safe-area insets** on everything fixed to the bottom: tab bar (already via
   `env(safe-area-inset-bottom)`), bottom sheets (already), and every fixed bar this plan touches
   — the existing `bottom-14` / `bottom-4` / `bottom-0` offsets omit the inset (see WS-13).
3. **Landscape phone (< md):** tab-bar labels hide; bottom sheets/sheets cap at 90vh with internal
   scroll (spec §3.5).
4. **Hover is never the only affordance** — hover-revealed controls must also be tap/focus
   reachable (this is also what WS-2 enforces).
5. **No horizontal page scroll at any band.** Wide content scrolls inside its own
   `overflow-x-auto` container (the repo's table pattern), never the page.
6. **Skeletons reserve the exact box of the content they replace** (spec §2.4) — including the
   responsive grid columns (WS-13 fixes a real mismatch here).
7. **Body text never drops below the token floor** — `text-body` (15px) at every band (spec §3.2).

**Two measured spec deviations — record the decision in the PR description, don't leave silent:**

- Spec §3.1 puts the full horizontal nav + mega menu at **lg**; the app does it at **xl**
  (`desktopNav: hidden xl:flex`), so the lg band (1024–1279) still shows a hamburger.
- Spec §3.1 puts the PLP filter sidebar at **lg** (collapsible, always visible at xl); the app
  keeps the mobile action bar + bottom sheets until **xl** (`filterSidebar: … xl:block`,
  `mobileBarRoot: xl:hidden`).

  **Option A — align the code to the spec:** `desktopNav`/`searchWrapper` → `lg:flex`,
  `menuButton` → `lg:hidden`, `filterSidebar` → `lg:block` (+ a collapse toggle),
  `mobileBarRoot` → `lg:hidden`. A navigation-model change: needs one design review and a
  regression pass at 1024 / 1100 / 1279 widths (ws-13 acceptance covers it).
  **Option B — align the spec to the code:** document "shopper chrome persists through tablet
  landscape; desktop chrome starts at xl" in `prompts/design/ecommerce-ui-ux-design-spec.md` §3.1
  so the two documents agree, and leave classes untouched.

---

## Workstream index

| #     | Workstream                                                                                        | Files touched                             | Type     | Depends on |
| ----- | ------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------- | ---------- |
| WS-1  | Form-control a11y wiring (`aria-describedby`, `aria-invalid`, `htmlFor`)                          | 5 new/modified shared files, 0 call sites | fix      | —          |
| WS-2  | Overlay a11y (dialog semantics, Escape, focus trap, restore)                                      | 1 new hook + 12 existing components       | fix      | —          |
| WS-3  | Wire the extended a11y rules into `npm run lint`                                                  | `eslint.config.mjs`                       | gate     | WS-1, WS-2 |
| WS-4  | Route loading states (delivery app, root, wrong-shape routes)                                     | 4 skeleton files + ~20 route files        | add      | —          |
| WS-5  | Dead ends: order tracking, gift cards, mobile nav                                                 | 4 files                                   | fix      | —          |
| WS-6  | Removable applied-filter chips on PLP                                                             | 6 new feature files + 2 edits             | feature  | —          |
| WS-7  | Toast stack (success/info/error, max 3)                                                           | 4 new shared files + 3 edits              | feature  | —          |
| WS-8  | Compare persistence + `/compare` route                                                            | 7 new files + 5 edits                     | feature  | —          |
| WS-9  | "Did you mean" on zero-result search                                                              | 4 new files + 2 edits                     | feature  | WS-6       |
| WS-10 | EmptyState "art frame" (token-only illustration)                                                  | 2 edits                                   | polish   | —          |
| WS-11 | Consistency guards: inline `₹`, inline class literals, 82 shims                                   | 1 new script + ~40 files                  | refactor | WS-3       |
| WS-12 | Metadata / robots / PWA manifest                                                                  | ~12 files                                 | fix      | —          |
| WS-13 | Responsive & tablet hardening (safe-area offsets, skeleton grid parity, sheet heights, landscape) | 8 style files + 1 test                    | fix      | —          |
| —     | **Deferred (needs backend contract)**                                                             | —                                         | —        | backend    |

Ship in this order: WS-1 → WS-2 → WS-3 (gate green) → WS-4 → WS-5 → WS-12 → WS-13 → WS-6 → WS-7 → WS-8 → WS-9 → WS-10 → WS-11.
WS-13 lands **before** WS-6/WS-7/WS-8 because those add chips, a toast viewport and a compare-bar button whose phone placement depends on WS-13.3/13.4/13.9. WS-1/2/3 are the accessibility
gate; WS-6/7/8/9 are spec features; WS-11 is the long tail; WS-13 is the band-correctness pass every new surface inherits.

---

## WS-1 — Form-control a11y wiring

**Gap:** 233 `<FormFieldFrame>` usages, only ~104 pass `htmlFor`; `aria-describedby` appears
0 times and `aria-invalid` 3 times app-wide. Error/hint text is visually adjacent but
programmatically invisible to assistive tech (spec §6.6).

**Approach:** fix it **once** in the shared layer via React context instead of touching 233
call sites. `FormFieldFrame` publishes the generated control id + description ids; the
`Input`/`Textarea`/`SelectTrigger` primitives consume it. Zero call-site churn, no visual
change, no behavioural regression risk.

### New file — `src/shared/components/forms/fieldControl.context.tsx`

```tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface FieldControlWiring {
  /** id the frame's <Label htmlFor> points at. */
  controlId: string;
  /** Space-joined hint + error ids, when the frame renders either. */
  describedById?: string;
  /** True while the frame renders an error — controls must report aria-invalid. */
  invalid: boolean;
}

const FieldControlContext = createContext<FieldControlWiring | null>(null);

export function FieldControlProvider({
  value,
  children,
}: {
  value: FieldControlWiring;
  children: ReactNode;
}) {
  return (
    <FieldControlContext.Provider value={value}>
      {children}
    </FieldControlContext.Provider>
  );
}

/** Wiring published by the nearest FormFieldFrame, or null outside one. */
export function useFieldControl(): FieldControlWiring | null {
  return useContext(FieldControlContext);
}

/** Merge an explicit attr with the frame's value (explicit wins, both kept). */
export function joinAriaIds(
  explicit: string | undefined,
  fromFrame: string | undefined,
): string | undefined {
  const merged = [explicit, fromFrame].filter(Boolean).join(" ");
  return merged || undefined;
}
```

Placement note: this mirrors the existing `shared/context/ThemePalette.context.tsx`
convention (JSX provider in a `.context.tsx`, hook colocated).

### Edit — `src/shared/components/forms/FormFieldFrame.component.tsx`

Replace the label/error/hint rendering. All ids are derived values, so the file stays
presentation-only (no state, no handlers).

```tsx
import { useId } from "react";
import { FieldControlProvider, joinAriaIds } from "./fieldControl.context";

// React's useId contains ":" / "«»" — legal in ids, awkward in selectors and
// e2e locators — strip them so the id stays copy-pasteable and CSS-safe.
const generatedId = `field-${useId().replace(/[:«»]/g, "")}`;
const controlId = htmlFor ?? generatedId;
const errorId = error ? `${controlId}-error` : undefined;
const hintId = hint ? `${controlId}-hint` : undefined;
const describedById = joinAriaIds(errorId, hintId);

const labelNode = (
  <Label htmlFor={controlId}>
    {label}
    {required ? <RequiredMark /> : null}
  </Label>
);
const errorNode = error ? (
  <p id={errorId} role="alert" className={formFieldFrameStyles.error}>
    {error}
  </p>
) : null;
const hintNode = hint ? (
  <p id={hintId} className={formFieldFrameStyles.hint}>
    {hint}
  </p>
) : null;
```

Then in the JSX: keep both existing branches (`labelAction` row / plain label;
`footerAction` row / stacked) but swap `<Label htmlFor={htmlFor}>` → `{labelNode}`,
the two `<p role="alert">` blocks → `{errorNode}`, the hint `<p>` → `{hintNode}`, and wrap
`{children}` once:

```tsx
<FieldControlProvider
  value={{ controlId, describedById, invalid: Boolean(error) }}
>
  {children}
</FieldControlProvider>
```

For `footerAction` renders, `errorNode`/`hintNode` belong inside that footer row's slot
(unchanged position) — only the `id` attributes are new.

### Edit — `src/shared/components/ui/input.tsx`, `textarea.tsx`, `select.tsx`

Explicit props must win, then the frame fills the blanks. Spread `{...props}` **before**
the derived attributes:

```tsx
import {
  joinAriaIds,
  useFieldControl,
} from "@/shared/components/forms/fieldControl.context";
// …
const field = useFieldControl();
const isInvalid = error || field?.invalid;

<input
  className={cn(/* unchanged */)}
  ref={ref}
  {...props}
  id={props.id ?? field?.controlId}
  aria-invalid={props["aria-invalid"] ?? (isInvalid ? true : undefined)}
  aria-describedby={joinAriaIds(
    props["aria-describedby"],
    field?.describedById,
  )}
/>;
```

Same three attributes on:

- `src/shared/components/ui/textarea.tsx` (bug-report body, rejection reasons, ticket replies)
- `src/shared/components/ui/select.tsx` → inside `SelectTrigger` (Radix spreads unknown
  props onto the trigger `<button role="combobox">`, so `id`/`aria-*` land correctly)

`PasswordInput` delegates to `Input`, so it inherits the wiring for free.

### Follow-up call sites (frames can't reach these)

The 13 `label-has-associated-control` findings are bare `<label>` usages outside a frame.
Convert them to `FormFieldFrame` (preferred) so they get the same wiring:

| File                                                                                                                      | Lines                  |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `features/admin-dashboard/components/delivery-agents/CreateDeliveryAgentForm/CreateDeliveryAgentFormFields.component.tsx` | 37, 48, 60, 72, 83, 94 |
| `features/admin-dashboard/components/delivery-agents/DeliveryDispatch/DeliveryDispatchAgentSelect.component.tsx`          | 27                     |
| `features/admin-dashboard/components/delivery-agents/DeliveryDispatch/DeliveryDispatchPickupList.component.tsx`           | 59                     |
| `features/admin-dashboard/components/users/ChangeUserRoleDialog/ChangeUserRoleDialog.component.tsx`                       | 85, 108                |
| `features/delivery-dashboard/components/doorstep/DoorstepConfirmCard/DoorstepPasscodeSection.component.tsx`               | 25                     |
| `features/delivery-dashboard/components/pickups/PickupChecklistCard.component.tsx`                                        | 67                     |
| `features/delivery-dashboard/components/rto/RtoHandoverCard.component.tsx`                                                | 60                     |

### Test — `src/shared/components/forms/__tests__/fieldControl.test.tsx`

```tsx
render(
  <FormFieldFrame label="Email" error="Enter a valid email address">
    <Input type="email" />
  </FormFieldFrame>,
);
expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
// describedby must point at nodes that actually exist:
const input = screen.getByLabelText("Email");
for (const id of (input.getAttribute("aria-describedby") ?? "").split(" ")) {
  expect(document.getElementById(id)).not.toBeNull();
}
// explicit args still win:
render(
  <FormFieldFrame label="Zone" htmlFor="zone-name">
    <Input id="zone-name" />
  </FormFieldFrame>,
);
```

### Acceptance

- `npx eslint . --rule '{"jsx-a11y/label-has-associated-control":"error"}'` → **0 findings**.
- `npm run test` green; every other snapshot/DOM assertion unchanged (attribute-only diff).

---

## WS-2 — Overlay accessibility (dialog semantics, Escape, focus trap, restore)

**Gap:** `role="dialog"`/`aria-modal` appear 0 times outside Radix. Custom overlays
(`MobileNavDrawer`, `BottomSheetView`, `WorkspaceNavDrawer`) close only by clicking a
`<div onClick>` backdrop: no Escape, no focus move on open, no Tab trap, no focus restore,
and the backdrop itself is not reachable by keyboard (7 `click-events-have-key-events` +
11 `no-static-element-interactions` findings).

### New file — `src/shared/hooks/ui/useModalOverlay.hook.ts`

One hook, reused by every hand-rolled overlay. No styling, no tokens — pure behaviour.

```ts
"use client";

import { useEffect, type RefObject } from "react";

/** Every focusable element inside the overlay, in DOM order. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface UseModalOverlayParams {
  open: boolean;
  onClose: () => void;
  /** The panel that should receive focus and trap Tab. */
  panelRef: RefObject<HTMLElement | null>;
}

/**
 * Modal behaviour for hand-rolled overlays: Escape to close, focus moves into
 * the panel on open, Tab cycles inside it, focus returns to the trigger on
 * close, and the page behind is scroll-locked. Radix primitives (ui/dialog,
 * ui/select, ui/popover) already do this themselves — only use this hook for
 * overlays built from plain elements.
 */
export function useModalOverlay({
  open,
  onClose,
  panelRef,
}: UseModalOverlayParams) {
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      );

    focusables()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const outside = !panel || !active || !panel.contains(active);

      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose, panelRef]);
}
```

Also export it from `src/shared/hooks/ui/` — note that folder has **no `index.ts` barrel**
(it is consumed by module path, e.g. `@/shared/hooks/ui/use-debounce.hook`), so follow that
convention and import `@/shared/hooks/ui/useModalOverlay.hook` directly rather than adding one.

### Apply — `features/storefront/components/mobile-nav/MobileNavDrawer.component.tsx`

Smallest possible diff: add the hook, a ref, dialog semantics, and make the backdrop a real
(but hidden, untabbable) button so it needs no click handler on a `div`.

```tsx
import { useRef } from "react";
import { useModalOverlay } from "@/shared/hooks/ui/useModalOverlay.hook";

  const panelRef = useRef<HTMLDivElement>(null);
  useModalOverlay({ open, onClose, panelRef });

  if (!open) return null;

  return (
    <div className={styles.overlayWrapper}>
      {/* Hidden, untabbable close target: keeps click-outside-to-close while
          removing the div-with-onClick that has no keyboard equivalent. */}
      <Button
        type="button"
        variant="ghost"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className={styles.backdrop}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={LABELS.menu}
        className={styles.drawer}
      >
```

`styles.backdrop` is already `absolute inset-0 bg-overlay animate-fade-in`; the `Button`
base adds `h-11 min-h-11` plus a hover tint, so extend the style entry (token-only) to keep
today's geometry:

```ts
// styles/mobile-nav/mobileNavDrawer.styles.ts
backdrop:
  "absolute inset-0 h-auto max-h-none min-h-0 w-auto max-w-none rounded-none border-0 bg-overlay p-0 hover:bg-overlay animate-fade-in",
```

Same treatment for `shared/components/layout/WorkspaceNavDrawer.component.tsx` (already has
`workspaceNavDrawerStyles.backdrop` / `.panel`) and
`shared/components/dialogs/BottomSheetView.component.tsx` (`bottomSheetViewStyles.sheet`
gets the ref; add `role="dialog"` + `aria-modal="true"` + `aria-label={title ?? LABELS.filters}`).

### Remaining `no-static-element-interactions` / `click-events-have-key-events` sites

Presentation-only changes: promote the clickable wrapper to the existing shared control,
move nothing else (handlers already come from hooks/props).

| File:line                                                                                              | Today                              | Change                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `features/storefront/components/header/AccountMenu.component.tsx:34`                                   | `<div onClick>` popover shell      | trigger becomes `Button variant="ghost" size="icon"` with `aria-label={LABELS.account}` + `aria-expanded`; panel body unchanged                |
| `features/storefront/components/header/DesktopPrimaryNav.component.tsx:37`                             | `<div>` mega-menu hover/click zone | click moves to the nav trigger `Button` (`aria-expanded={megaMenuOpen}`); the zone keeps only `onMouseEnter/onMouseLeave`                      |
| `features/categories/components/mega-menu/CategoriesMegaMenu/index.tsx:31`                             | panel wrapper click capture        | attach handlers to the inner `Link`/`Button` elements                                                                                          |
| `features/products/components/card/CardQuantityControl/CardQuantityControl.component.tsx:35`           | step wrapper `onClick`             | let the existing `QuantitySelector` buttons own the clicks                                                                                     |
| `shared/components/QuantitySelector/QuantitySelector.component.tsx:84`                                 | `onClick` on a `span` wrapper      | move the handler onto the sibling `Button`                                                                                                     |
| `shared/components/ImageGallery/ImageGalleryStage.component.tsx:56`                                    | stage tap-to-zoom `onClick`        | add `role="button"` + `tabIndex={0}` + Enter/Space `onKeyDown`, or reuse the existing zoom `Button` overlay                                    |
| `features/home/components/hero/HeroSection/HeroSection.component.tsx:37`                               | slide-dot row `onClick`            | render dots as `<button type="button" aria-label={LABELS.heroSlide}>` — colours stay `bg-brand` / `bg-line`, `aria-current` for the active dot |
| `shared/components/DataTable/DataTableMobileCards.component.tsx:48,114`                                | card / `<td onClick>`              | promote the primary cell to `Button variant="link"`, or add `role="button"` + `tabIndex` + `onKeyDown`                                         |
| `features/admin-dashboard/components/users/ChangeUserRoleDialog/ChangeUserRoleDialog.component.tsx:53` | clickable row                      | same as the DataTable mobile-card treatment                                                                                                    |
| `MobileNavDrawer` / `WorkspaceNavDrawer` / `BottomSheetView` backdrops                                 | `<div onClick>`                    | see the apply section above                                                                                                                    |

New labels needed: `LABELS.heroSlide` (or reuse an existing slide label if one exists —
check `labels/commerce.ts` / `labels/navigation.ts` first).

### Acceptance

- `npx eslint . --rule '{"jsx-a11y/click-events-have-key-events":"error","jsx-a11y/no-static-element-interactions":"error","jsx-a11y/no-noninteractive-element-interactions":"error"}'` → **0 findings**.
- Manual: open the mobile nav → focus lands inside the drawer, Tab cycles within it, Escape
  closes it, focus returns to the hamburger, and the page behind does not scroll.

---

## WS-3 — Put the extended a11y rules behind `npm run lint`

**Finding (corrected from the audit):** the plugin is already loaded —
`eslint-config-next/dist/index.js` registers `jsx-a11y` and enables `alt-text`,
`aria-props`, `aria-proptypes`, `aria-unsupported-elements`,
`role-has-required-aria-props`, `role-supports-aria-props` — but **all as `warn`**, and
`npm run lint` tolerates warnings (measured: 0 errors / 74 warnings, none of them
`jsx-a11y`). The rules that would have caught WS-1/WS-2 are simply not enabled.

### Edit — `web/eslint.config.mjs`

Append after the existing `react-hooks` override block. No new dependency: the preset
already registers the plugin.

```js
  // Accessibility gate (WCAG 2.2 AA — design spec §6). `eslint-config-next`
  // ships jsx-a11y as warnings only; these are promoted to errors because the
  // codebase is fixed for them (UI-GAP-IMPLEMENTATION-PLAN.md WS-1/WS-2).
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/no-noninteractive-element-interactions": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/no-autofocus": "warn", // 7 pre-existing sites; triage separately
    },
  },
```

Ordering rule: land WS-1 + WS-2 first, then this block — the gate must be born green
(measured baseline for these rules: 13 + 11 + 7 + 2 findings, all cleared by WS-1/WS-2).

---

## WS-4 — Route loading states

**Gap:** no `loading.tsx` anywhere under `app/delivery/**` (the offline-PWA surface), none at
`app/loading.tsx` (so `/vendor`, `/delivery`, `/auth/callback` paint blank), and 19 storefront
routes inherit the _wrong shape_ — `app/(storefront)/loading.tsx` renders
`StorefrontPageSkeleton` (hero + 10 category tiles + 8 product cards), which is what a wallet
ledger, a tracking form and a blog post all show while loading today.

### Step 1 — new skeletons in `shared/components/Skeletons/pageSkeletons.styles.ts`

Add to the existing `pageSkeletonsStyles` object (all classes are token-based, reusing
`storefront-container` and the existing `h*-w*` helpers where possible):

```ts
  // Ledger / list pages: wallet, my-returns, reviews, gift-cards
  ledgerContainer: "storefront-container space-y-6 py-8",
  ledgerHeaderStack: "space-y-3",
  ledgerRow: "h-20 w-full",
  ledgerAside: "h-56 w-full",

  // Form pages: order tracking, support/bug-report create
  formContainer: "storefront-container max-w-[560px] space-y-6 py-10",
  formFieldBlock: "space-y-2",
  formLabel: "h-3 w-28",
  formControl: "h-11 w-full",
  formActionRow: "flex gap-3",

  // Detail pages: my-returns/[id], support/*/[id], orders/confirmation
  detailContainer: "storefront-container max-w-[860px] space-y-6 py-8",
  detailHero: "h-36 w-full",
  detailCard: "h-28 w-full",

  // Delivery agent app: every /delivery/dashboard/* route
  deliveryContainer: "space-y-4 px-4 py-4",
  deliveryHeaderCard: "h-24 w-full",
  deliveryMetricGrid: "grid grid-cols-2 gap-3 sm:grid-cols-3",
  deliveryMetric: "h-20 w-full",
  deliveryTaskCard: "h-28 w-full",
```

### Step 2 — new components in `shared/components/Skeletons/pageSkeletons.component.tsx`

```tsx
/** Wallet / returns / reviews / gift-cards ledger while the query settles. */
export function LedgerPageSkeleton() {
  return (
    <div className={styles.ledgerContainer}>
      <div className={styles.ledgerHeaderStack}>
        <Skeleton className={styles.h3w28} />
        <Skeleton className={styles.h8w48} />
      </div>
      <Skeleton className={styles.ledgerAside} />
      <SkeletonCard count={3} height={styles.ledgerRow} />
    </div>
  );
}

/** Single-column form pages (order tracking, support create forms). */
export function FormPageSkeleton() {
  return (
    <div className={styles.formContainer}>
      <div className={styles.ledgerHeaderStack}>
        <Skeleton className={styles.h3w24} />
        <Skeleton className={styles.h8w40} />
      </div>
      <SkeletonCard count={3} height={styles.formControl} />
      <div className={styles.formActionRow}>
        <Skeleton className={styles.formControl} />
        <Skeleton className={styles.formControl} />
      </div>
    </div>
  );
}

/** Detail views (return detail, ticket/bug detail, order confirmation). */
export function DetailPageSkeleton() {
  return (
    <div className={styles.detailContainer}>
      <Skeleton className={styles.h3w28} />
      <Skeleton className={styles.detailHero} />
      <SkeletonCard count={3} height={styles.detailCard} />
    </div>
  );
}

/** Delivery agent app shell — list-shaped, matches the task-card UI. */
export function DeliveryPageSkeleton() {
  return (
    <div className={styles.deliveryContainer} aria-busy="true">
      <Skeleton className={styles.deliveryHeaderCard} />
      <div className={styles.deliveryMetricGrid}>
        <Skeleton className={styles.deliveryMetric} />
        <Skeleton className={styles.deliveryMetric} />
        <Skeleton className={styles.deliveryMetric} />
      </div>
      <SkeletonCard count={4} height={styles.deliveryTaskCard} />
    </div>
  );
}
```

`SkeletonCard` and `Skeleton` are already imported in that file; `SkeletonCard` takes
`{ count, height }`, so no new prop plumbing is needed. Reuse the existing `h3w28`, `h8w48`,
`h3w24`, `h8w40` helper keys rather than adding new ones.

**Responsive requirement (WS-13.5, §0.4 rule 6):** the grid skeleton must mirror `ProductGrid`'s
column counts at _every_ band. The shared `skeletonPrimitivesStyles.gridContainer` currently reads
`lg:grid-cols-4` while the real grid is `lg:grid-cols-3 xl:grid-cols-4`, so the PLP loading state
shows 4 columns and then snaps to 3 at 1024–1279px. Fix that in the same PR as these skeletons —
WS-13.5 has the exact class string plus a parity unit test.

### Step 3 — export the new skeletons

Add the four names to **both** barrel files (they enumerate exports explicitly):
`shared/components/Skeletons/index.ts` and `shared/components/Skeletons.component.tsx`.

```ts
export { DeliveryPageSkeleton } from "./pageSkeletons.component";
export { DetailPageSkeleton } from "./pageSkeletons.component";
export { FormPageSkeleton } from "./pageSkeletons.component";
export { LedgerPageSkeleton } from "./pageSkeletons.component";
```

### Step 4 — route files (each ≤ 120 lines, no logic — matches `orders/loading.tsx`)

Pattern to copy (existing template):

```tsx
import { LedgerPageSkeleton } from "@/shared/components/Skeletons.component";

export default function WalletLoading() {
  return <LedgerPageSkeleton />;
}
```

| New file                                                | Renders                                                           | Why it can't inherit                                                |
| ------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| `app/loading.tsx`                                       | `FormPageSkeleton`                                                | covers `/vendor`, `/delivery`, `/auth/callback`; nothing above them |
| `app/delivery/dashboard/loading.tsx`                    | `DeliveryPageSkeleton`                                            | no ancestor skeleton exists at all                                  |
| `app/(storefront)/wallet/loading.tsx`                   | `LedgerPageSkeleton`                                              | inherits product-grid skeleton today                                |
| `app/(storefront)/my-returns/loading.tsx`               | `LedgerPageSkeleton`                                              | idem                                                                |
| `app/(storefront)/my-returns/[id]/loading.tsx`          | `DetailPageSkeleton`                                              | detail shape                                                        |
| `app/(storefront)/reviews/loading.tsx`                  | `ReviewListSkeleton` (already exists)                             | review list shape                                                   |
| `app/(storefront)/help/loading.tsx`                     | `ContentPageSkeleton` (already exists)                            | prose shape                                                         |
| `app/(storefront)/help/[slug]/loading.tsx`              | `ContentPageSkeleton`                                             | idem                                                                |
| `app/(storefront)/blog/[slug]/loading.tsx`              | `ContentPageSkeleton`                                             | prose post shape                                                    |
| `app/(storefront)/gift-cards/loading.tsx`               | `FormPageSkeleton`                                                | purchase form shape                                                 |
| `app/(storefront)/gift-cards/redeem/[code]/loading.tsx` | `FormPageSkeleton`                                                | redeem form shape                                                   |
| `app/(storefront)/orders/tracking/loading.tsx`          | `FormPageSkeleton`                                                | inherits the 5-card orders list today                               |
| `app/(storefront)/orders/confirmation/loading.tsx`      | `DetailPageSkeleton`                                              | idem                                                                |
| `app/(storefront)/support/tickets/new/loading.tsx`      | `FormPageSkeleton`                                                | inherits ticket list today                                          |
| `app/(storefront)/support/tickets/[id]/loading.tsx`     | `DetailPageSkeleton`                                              | idem                                                                |
| `app/(storefront)/support/bug-reports/new/loading.tsx`  | `FormPageSkeleton`                                                | inherits bug list today                                             |
| `app/(storefront)/support/bug-reports/[id]/loading.tsx` | `DetailPageSkeleton`                                              | idem                                                                |
| `app/(storefront)/vendors/[slug]/loading.tsx`           | `StorefrontPageSkeleton` is wrong here → use `LedgerPageSkeleton` | vendor storefront is a listing page, not the hero/grid home         |

Do **not** add `loading.tsx` where the inherited one is already correct (admin/`*`,
`vendor/dashboard/*`, `orders/[orderId]/*`, `products/*`, `cart`, `checkout`, `categories`,
`wishlist`, `profile`) — that is the repo's documented rule
(`FRONTEND-STRUCTURE-CONVENTIONS.md` §8).

### Acceptance

- Cold-navigating `/wallet`, `/orders/tracking`, `/delivery/dashboard/today` shows a
  right-shaped skeleton (verified with throttled network in devtools).
- `npm run limits` passes (all new route files are single-digit lines).

---

## WS-5 — Dead ends: order tracking, gift cards, mobile nav

**Gap:** `/orders/tracking` has no in-app entry point (only `sitemap.ts`); the footer's
"Track order" link points at `/orders`; `PATHS.giftCards` is never used (one raw
`"/gift-cards"` literal instead); the mobile nav omits categories, returns, reviews, gift
cards and tracking.

### Edit — `shared/constants/paths/paths.ts`

```ts
  orders: "/orders",
  order: (id: string) => `/orders/${id}`,
  orderConfirmation: (id: string) => `/orders/${id}/confirmation`,
  /** Public tracking lookup — the entry point the footer's "Track order" needs. */
  orderTracking: "/orders/tracking",
```

`PATHS.compare` is added in WS-8.

### Edit — `shared/constants/navigation/footer.ts`

```ts
    links: [
      { href: PATHS.orderTracking, label: LABELS.trackOrder }, // was PATHS.orders
      { href: PATHS.help, label: LABELS.helpCenter },
      // …unchanged
```

### Edit — `features/account/hooks/orders-activity/useOrdersActivitySection.hook.ts`

- replace `href: "/gift-cards"` with `href: PATHS.giftCards`,
- add a `tracking` entry to `summaryItems` reusing the existing `Package` (or `Truck`) icon:

```ts
      {
        id: "tracking",
        icon: Truck,
        label: LABELS.trackOrder,
        value: LABELS.view,
        href: PATHS.orderTracking,
      },
```

`LABELS.view` / `LABELS.trackOrder` already exist, so no new copy is needed here.

### Edit — `features/storefront/components/mobile-nav/MobileNavDrawer.component.tsx`

Extend `navLinks` (guest-visible) and the authed account block. All entries reuse
`styles.navLink` / `styles.accountLink`, so no style changes are needed:

```ts
const navLinks = [
  { href: PATHS.products, label: LABELS.allProducts },
  { href: PATHS.productsNewest, label: LABELS.newArrivals },
  { href: PATHS.categories, label: LABELS.categories },
  { href: PATHS.vendors, label: LABELS.vendors },
  { href: PATHS.orderTracking, label: LABELS.trackOrder },
];
```

Authed/customer block (after Wallet, before Help): `PATHS.myReturns` → `LABELS.returnsPageTitle`
(there is no `LABELS.myReturns` key; `returnsPageTitle` is what the vendor nav already uses for
its returns item), `PATHS.reviews` → `LABELS.reviews`, `PATHS.giftCards` →
`giftCardsLabels.giftCards` (imported from `@/shared/constants/labels/giftCards`, exactly as
`useOrdersActivitySection.hook.ts` does).

### Acceptance

- Footer "Track order" lands on `/orders/tracking` and the lookup works.
- Every route that previously had no inbound link now has one (re-run the old grep:
  `grep -rn 'PATHS.giftCards' src` must be non-zero).
- No raw path literals added (`grep -rn 'href: "/' src/features | grep -v PATHS` → unchanged).

---

## WS-6 — Removable applied-filter chips on PLP

**Gap:** spec §4.2/§4.5 require removable applied-filter chips; today only "Clear filters" /
"Reset filters" exist, so a shopper can't drop one facet without re-doing the whole filter set.

### Step 1 — multi-key removal in `features/products/hooks/filters/useFilters.hook.ts`

A chip that removes a price _range_ must write both keys in one URL update, and an attribute
chip must rebuild the `attrs` map. Both are URL/state logic → they belong in this hook.

```ts
/** Clear several facets in a single URL write (price range, etc.). */
const removeFilters = (keys: string[]) => {
  const next: Record<string, unknown> = { ...filters, page: 1 };
  for (const key of keys) next[key] = undefined;
  pushFilters(next);
};

/** Drop one selected value of one attribute facet, keeping the rest. */
const removeAttrValue = (attrKey: string, value: string) => {
  const remaining = (filters.attrs?.[attrKey] ?? []).filter((v) => v !== value);
  const nextAttrs = { ...(filters.attrs ?? {}) };
  if (remaining.length > 0) nextAttrs[attrKey] = remaining;
  else delete nextAttrs[attrKey];
  pushFilters({
    ...filters,
    attrs: Object.keys(nextAttrs).length > 0 ? nextAttrs : undefined,
    page: 1,
  });
};
```

Both callbacks depend on `filters` + `router`, so wrap them in `useCallback` inside `useFilters`.
That keeps them referentially stable between renders and makes the chips hook's `useMemo`
meaningful (they only change when the filter set itself changes — exactly when chips must
recompute).

```ts
const removeFilters = useCallback(
  (keys: string[]) => {
    /* as above */
  },
  [filters, router],
);
const removeAttrValue = useCallback(
  (attrKey: string, value: string) => {
    /* as above */
  },
  [filters, router],
);

return {
  filters,
  updateFilter,
  updateFilterDebounced,
  removeFilters,
  removeAttrValue,
  clearFilters,
};
```

### Step 2 — labels (add to `shared/constants/labels/tables3.ts`, already merged into `LABELS`)

```ts
  removeFilter: "Remove {filter} filter",
  appliedFiltersLabel: "Applied filters",
  activeFilterSearch: "Search: “{value}”",
  activeFilterCategory: "Category: {value}",
  activeFilterVendor: "Vendor: {value}",
  activeFilterPrice: "Price: {range}",
  activeFilterPriceFrom: "{amount} & up",
  activeFilterPriceUpTo: "Up to {amount}",
  activeFilterRating: "{value} stars & up",
  activeFilterAttribute: "{name}: {value}",
```

All price strings are produced with `formatInr` (the `₹` glyph lives only inside
`shared/utils/formatting/orderFormat.ts` — enforced by WS-11), never with a literal glyph.

### Step 3 — type — `features/products/types/filters/appliedFilterChip.types.ts`

```ts
export interface AppliedFilterChip {
  id: string;
  label: string;
  /** Bound in the hook, passed by reference — components never build handlers. */
  onRemove: () => void;
}
```

### Step 4 — `features/products/hooks/filters/useAppliedFilterChips.hook.ts`

Pure derivation (no state, no effects) → memoised:

```ts
"use client";

import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { ProductFilters } from "../../api/listing/products.api";
import type { AppliedFilterChip } from "../../types/filters/appliedFilterChip.types";

interface UseAppliedFilterChipsParams {
  filters: ProductFilters;
  removeFilters: (keys: string[]) => void;
  removeAttrValue: (attrKey: string, value: string) => void;
  categoryName?: string;
  vendorName?: string;
}

export function useAppliedFilterChips({
  filters,
  removeFilters,
  removeAttrValue,
  categoryName,
  vendorName,
}: UseAppliedFilterChipsParams): AppliedFilterChip[] {
  return useMemo(() => {
    const chips: AppliedFilterChip[] = [];

    if (filters.search) {
      chips.push({
        id: "search",
        label: formatLabel(LABELS.activeFilterSearch, {
          value: filters.search,
        }),
        onRemove: () => removeFilters(["search"]),
      });
    }
    if (filters.categoryId) {
      chips.push({
        id: "categoryId",
        label: formatLabel(LABELS.activeFilterCategory, {
          value: categoryName ?? LABELS.category,
        }),
        onRemove: () => removeFilters(["categoryId"]),
      });
    }
    if (filters.vendorId) {
      chips.push({
        id: "vendorId",
        label: formatLabel(LABELS.activeFilterVendor, {
          value: vendorName ?? LABELS.vendor,
        }),
        onRemove: () => removeFilters(["vendorId"]),
      });
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      chips.push({
        id: "price",
        label: formatLabel(LABELS.activeFilterPrice, {
          range: priceRangeLabel(filters.minPrice, filters.maxPrice),
        }),
        onRemove: () => removeFilters(["minPrice", "maxPrice"]),
      });
    }
    if (filters.rating !== undefined) {
      chips.push({
        id: "rating",
        label: formatLabel(LABELS.activeFilterRating, {
          value: filters.rating,
        }),
        onRemove: () => removeFilters(["rating"]),
      });
    }
    for (const [attrKey, values] of Object.entries(filters.attrs ?? {})) {
      for (const value of values) {
        chips.push({
          id: `${attrKey}:${value}`,
          label: formatLabel(LABELS.activeFilterAttribute, {
            name: attrKey,
            value,
          }),
          onRemove: () => removeAttrValue(attrKey, value),
        });
      }
    }
    return chips;
  }, [filters, removeFilters, removeAttrValue, categoryName, vendorName]);
}

function priceRangeLabel(min?: number, max?: number): string {
  if (min !== undefined && max !== undefined) {
    return `${formatInr(min)} – ${formatInr(max)}`;
  }
  if (min !== undefined) {
    return formatLabel(LABELS.activeFilterPriceFrom, {
      amount: formatInr(min),
    });
  }
  return formatLabel(LABELS.activeFilterPriceUpTo, {
    amount: formatInr(max ?? 0),
  });
}
```

### Step 5 — styles — `features/products/styles/filters/appliedFilterChips.styles.ts`

```ts
export const appliedFilterChipsStyles = {
  row: "flex flex-wrap items-center gap-2 py-1",
  label: "text-eyebrow", // already token-bound in globals.css
  chip: [
    "inline-flex h-11 items-center gap-2 rounded-full border border-transparent",
    "bg-brand-subtle px-4 text-body-sm font-medium text-brand",
    "transition-colors hover:bg-surface hover:border-line",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  ].join(" "),
  chipIcon: "h-3 w-3 shrink-0",
  resetAll: "ml-1 h-8 px-2 text-body-sm text-ink-muted hover:text-ink",
} as const;
```

Colour notes for review: `bg-brand-subtle` + `text-brand` is the token pair the spec assigns to
filter chips (§4.2); `hover:bg-surface` + `hover:border-line` gives hover feedback in **both**
palettes without introducing a new colour. Sizing: `h-11` (44px) per §0.4 rule 1 — the 32px pill
originally drafted here was wrong (spacing around a control is not tap area, and the repo locks
every control to `h-11`); see WS-13.9, which owns the final value. Responsive: the row wraps
(`flex-wrap`), so chips stay usable at 360px, and each chip's remove action is keyboard-operable.

### Step 6 — components (`features/products/components/filters/AppliedFilterChips/`)

```tsx
// AppliedFilterChip.component.tsx — presentation only
export function AppliedFilterChip({ label, onRemove, removeAriaLabel }: Props) {
  return (
    <button
      type="button"
      className={appliedFilterChipsStyles.chip}
      onClick={onRemove}
      aria-label={removeAriaLabel}
    >
      <span>{label}</span>
      <X className={appliedFilterChipsStyles.chipIcon} aria-hidden />
    </button>
  );
}
```

```tsx
// AppliedFilterChipsList.component.tsx — one component owns the collection
export function AppliedFilterChipsList({
  chips,
}: {
  chips: AppliedFilterChip[];
}) {
  return (
    <>
      {chips.map((chip) => (
        <AppliedFilterChip
          key={chip.id}
          label={chip.label}
          onRemove={chip.onRemove}
          removeAriaLabel={formatLabel(LABELS.removeFilter, {
            filter: chip.label,
          })}
        />
      ))}
    </>
  );
}
```

```tsx
// AppliedFilterChips.component.tsx — wrapper: hides itself when nothing is applied
export function AppliedFilterChips({ chips }: { chips: AppliedFilterChip[] }) {
  if (chips.length === 0) return null;
  return (
    <div
      className={appliedFilterChipsStyles.row}
      aria-label={LABELS.appliedFiltersLabel}
      role="group"
    >
      <AppliedFilterChipsList chips={chips} />
    </div>
  );
}
```

Plus `index.ts` re-exporting the wrapper + the type, and a matching entry in
`features/products/index.ts` only if another feature needs it (PLP is the only consumer → keep
it feature-internal).

### Step 7 — wire into the PLP

`features/products/pages/listing/ProductListingPage/ProductListingPage.page.tsx`:

```tsx
const chips = useAppliedFilterChips({
  filters: listing.filters,
  removeFilters: listing.removeFilters,
  removeAttrValue: listing.removeAttrValue,
  categoryName,
});
// …
<ListingResults
  /* …existing props… */
  chips={chips}
/>;
```

`useProductListing` must re-export `removeFilters` / `removeAttrValue` from `useFilters`
(same naming as the existing `updateFilter` passthrough), and `ListingResults.component.tsx`
renders `<AppliedFilterChips chips={chips} />` directly above `<SortBar />` (prop typed
`chips: AppliedFilterChip[]`, passed straight through — no logic added to the component).

`vendorName` stays undefined on the generic PLP (the vendor storefront page passes it if/when
it reuses this component) — leaving the fallback label in place is deliberate.

### Tests — `features/products/hooks/__tests__/useAppliedFilterChips.test.tsx`

- search + category + price + rating + one attribute value → 5 chips, correct labels.
- removing the price chip calls `removeFilters(["minPrice", "maxPrice"])` once.
- removing one attribute value keeps the others (`removeAttrValue("colour", "black")`).
- empty filters → `[]` (wrapper renders nothing).

### Acceptance

- Removing a chip updates the URL and the result count with no full-page reload.
- Keyboard: Tab reaches each chip, Enter/Space removes it, focus moves to the next chip.
- Screen reader announces the action (`aria-label="Remove Price: ₹500 – ₹1,000 filter"`).

---

## WS-7 — Toast stack (success / info / error, max 3)

**Gap:** only `ErrorToast` exists. Spec §4.4 wants a toast region that also carries success and
info feedback, stacks with a max of 3, and supports one optional action link. `ui/toast.tsx`
already ships every Radix part (`ToastProvider`, `Toast`, `ToastTitle`, `ToastDescription`,
`ToastAction`, `ToastClose`, `ToastViewport`) — this workstream just builds the stack.

### Step 1 — `shared/constants/timing/timing.ts`

```ts
/** Toast auto-dismiss per severity (UI spec §4.4). Errors linger longest. */
export const TOAST_DURATION_MS = {
  success: 4000,
  info: 5000,
  error: 6000,
} as const;

/** Older toasts are dismissed early once this many are visible (spec §4.4). */
export const TOAST_MAX_VISIBLE = 3;
```

### Step 2 — `shared/stores/notifications/toast.store.ts` (new)

```ts
import { create } from "zustand";
import { TOAST_MAX_VISIBLE } from "@/shared/constants/timing/timing";

export type ToastKind = "success" | "info" | "error";

export interface AppToast {
  /** Monotonic id — also the React key so Radix restarts its dismiss timer. */
  id: number;
  kind: ToastKind;
  message: string;
  /** Optional single action (spec §4.4). */
  actionLabel?: string;
  actionHref?: string;
}

interface ToastState {
  toasts: AppToast[];
  push: (toast: Omit<AppToast, "id">) => void;
  dismiss: (id: number) => void;
}

/** App-wide toast queue. Mounted once by ToastStackContainer (app-providers.tsx). */
export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push: (toast) => {
    const next: AppToast = { ...toast, id: (get().toasts.at(-1)?.id ?? 0) + 1 };
    // Oldest first-out once the visible cap is exceeded.
    const toasts = [...get().toasts, next].slice(-TOAST_MAX_VISIBLE);
    set({ toasts });
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export function notifySuccess(
  message: string,
  action?: { label: string; href: string },
): void {
  useToastStore.getState().push({
    kind: "success",
    message,
    actionLabel: action?.label,
    actionHref: action?.href,
  });
}

export function notifyInfo(
  message: string,
  action?: { label: string; href: string },
): void {
  useToastStore.getState().push({
    kind: "info",
    message,
    actionLabel: action?.label,
    actionHref: action?.href,
  });
}
```

### Step 3 — `shared/stores/notifications/errorToast.store.ts` becomes a compat shim

19 files import `notifyError` from this path — keep the module and the signature, drop the
old single-toast state (verify with `grep -rn 'useErrorToastStore' src` first; today only
`ErrorToastContainer` uses it).

```ts
import { useToastStore } from "./toast.store";

/** Global imperative error notice (unchanged public API). */
export function notifyError(message: string): void {
  useToastStore.getState().push({ kind: "error", message });
}
```

### Step 4 — styles — `shared/styles/notifications/toastStack.styles.ts` (new)

```ts
/** Kind → token pair. Only semantic-subtle + tone tokens, no new colours. */
export const toastStackStyles = {
  item: "flex items-start gap-3 border-l-[3px]",
  variants: {
    success: "border-l-success bg-success-subtle text-success",
    info: "border-l-brand bg-brand-subtle text-brand",
    error: "border-l-danger bg-danger-subtle text-danger",
  },
  body: "min-w-0 flex-1 space-y-1",
  title: "font-medium",
  message: "text-ink-muted",
  icon: "mt-0.5 h-4 w-4 shrink-0",
  action: "mt-1",
} as const;
```

`Toast`'s own base class already supplies `rounded-md border border-line bg-surface-raised
p-4 shadow-elevation-3 animate-slide-in-bottom`; the kind classes above are applied on top and
only change the accent (`border-l-*`, `bg-*-subtle`). `bg-surface-raised` stays the card body,
so text stays `text-ink`-readable in both palettes — the accent tones are used for the icon,
left rule and title, matching spec §4.4's "-subtle background + full-tone icon" rule.

### Step 5 — components

```tsx
// shared/components/notifications/ToastStackItem.component.tsx — presentation only
const ICONS: Record<ToastKind, LucideIcon> = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
};

export function ToastStackItem({ toast, onOpenChange, onAction }: Props) {
  const Icon = ICONS[toast.kind];
  return (
    <Toast
      type={toast.kind === "error" ? "foreground" : "background"}
      open
      duration={TOAST_DURATION_MS[toast.kind]}
      onOpenChange={onOpenChange}
      className={cn(
        toastStackStyles.item,
        toastStackStyles.variants[toast.kind],
      )}
    >
      <Icon className={toastStackStyles.icon} aria-hidden />
      <div className={toastStackStyles.body}>
        <ToastTitle className={toastStackStyles.title}>
          {LABELS.toastTitles[toast.kind]}
        </ToastTitle>
        <ToastDescription>{toast.message}</ToastDescription>
        {toast.actionLabel && toast.actionHref ? (
          <ToastAction
            altText={toast.actionLabel}
            asChild
            className={toastStackStyles.action}
          >
            <Link href={toast.actionHref} onClick={onAction}>
              {toast.actionLabel}
            </Link>
          </ToastAction>
        ) : null}
      </div>
      <ToastClose aria-label={LABELS.dismiss} />
    </Toast>
  );
}
```

`type="foreground"` for errors / `"background"` for the rest is what makes Radix emit
`role="status"` + `aria-live="assertive" | "polite"` (verified in `@radix-ui/react-toast`) —
exactly the behaviour spec §6.3 asks for, so no manual `role` is added.

```tsx
// shared/components/notifications/ToastStack.component.tsx
export function ToastStack({ toasts, onDismiss, onAction }: Props) {
  return (
    <ToastProvider swipeDirection="right" label={LABELS.notifications}>
      <ToastStackList
        toasts={toasts}
        onDismiss={onDismiss}
        onAction={onAction}
      />
      {/* WS-13.4: offsets the viewport above the mobile tab bar + home indicator */}
      <ToastViewport className={toastStackStyles.viewport} />
    </ToastProvider>
  );
}
```

`ToastStackList.component.tsx` owns the `.map()` (same convention as
`AppliedFilterChipsList`) and keys each item by `toast.id` so a replacing toast remounts.

New labels — only the `toastTitles` block is genuinely new. `notifications` already exists
(`labels/adminNavigation.ts:61`) and `dismiss` already exists (`labels/reports2.ts:50`); reuse
both and do **not** re-declare them (a duplicate key would silently override the spread):

```ts
// shared/constants/labels/commerce.ts — add only this
  toastTitles: {
    success: "Done",
    info: "Heads up",
    error: "Something went wrong",
  },
```

### Step 6 — container + mount

```tsx
// shared/containers/notifications/ToastStackContainer.container.tsx
export function ToastStackContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <ToastStack
      toasts={toasts}
      onDismiss={dismiss}
      onAction={dismiss /* action also dismisses */}
    />
  );
}
```

`app/_providers/app-providers.tsx`: replace `<ErrorToastContainer />` with
`<ToastStackContainer />` (keep the import style/order), then delete
`shared/components/notifications/ErrorToast.component.tsx` and
`shared/containers/notifications/ErrorToastContainer.container.tsx`.

### Step 7 — first success call sites (keep this list short and high-value)

| Call site                                               | Copy                                                                                         |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| checkout order placed (`features/checkout`)             | `notifySuccess(LABELS.orderPlacedToast, { label: LABELS.viewOrder, href: PATHS.order(id) })` |
| address saved (`features/account/components/addresses`) | `notifySuccess(LABELS.addressSaved)`                                                         |
| review submitted (`features/reviews`)                   | `notifySuccess(LABELS.reviewSubmitted)`                                                      |
| wishlist move-to-cart (`features/wishlist`)             | `notifyInfo(LABELS.movedToCart, { label: LABELS.viewCart, href: PATHS.cart })`               |

Add the four copy keys only where an equivalent label doesn't already exist (check
`labels/commerce.ts` / `labels/cart.ts` first — most of these strings are already present).

### Tests — `shared/stores/notifications/__tests__/toast.store.test.ts`

- cap: pushing 4 toasts keeps the last 3.
- `notifyError` still routes into the queue with `kind: "error"` (compat guarantee).
- dismiss removes only the targeted id.

### Acceptance

- Error from a row action (e.g. invoice download) still appears exactly as before.
- A 4th toast pushes the oldest out; each toast's timer restarts on remount.
- Screen reader: errors announce assertively, success/info politely.

---

## WS-8 — Compare persistence + `/compare` route

**Gap:** `comparedProducts` is `useState` inside `useProductListing.hook.ts`, so a selection
dies on navigation, refresh, or pagination, and there is no `/compare` URL to link to (spec
§4.6 expects a persistent selection + a "Compare now" destination).

### Step 1 — constants

```ts
// shared/constants/storage/storage.ts — add to STORAGE_KEYS
  /** Compare tray selection (sessionStorage — survives navigation, not the tab). */
  COMPARE_SELECTION: "compareSelection",

// features/products/constants/compare/compare.ts
export const MAX_COMPARED_PRODUCTS = 4;
/** Side-by-side comparison needs at least two products. */
export const MIN_COMPARED_PRODUCTS = 2;

// shared/constants/paths/paths.ts
  products: "/products",
  compare: "/compare",
```

### Step 2 — `features/products/stores/compare/compareStorage.ts`

Mirrors the defensive try/catch style of the theme bootstrap; storage is never trusted.

```ts
import type { ProductListItem } from "@/shared/api/types";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";

/** Session-scoped so a stale tray never greets a new browser session. */
export function readStoredCompare(): ProductListItem[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.COMPARE_SELECTION);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ProductListItem[]) : [];
  } catch {
    return [];
  }
}

export function writeStoredCompare(products: ProductListItem[]): void {
  try {
    if (products.length === 0) {
      window.sessionStorage.removeItem(STORAGE_KEYS.COMPARE_SELECTION);
      return;
    }
    window.sessionStorage.setItem(
      STORAGE_KEYS.COMPARE_SELECTION,
      JSON.stringify(products),
    );
  } catch {
    /* storage unavailable (private mode / quota) — tray stays in memory */
  }
}
```

### Step 3 — `features/products/stores/compare/compare.store.ts`

Same zustand shape as `shared/stores/exports/exportJobs.store.ts` (no middleware — the repo
uses none), with the write happening inside the actions so no effect is needed for persisting.

```ts
import { create } from "zustand";
import type { ProductListItem } from "@/shared/api/types";
import { MAX_COMPARED_PRODUCTS } from "../../constants/compare/compare";
import { readStoredCompare, writeStoredCompare } from "./compareStorage";

interface CompareState {
  mode: boolean;
  products: ProductListItem[];
  toggleMode: () => void;
  toggle: (product: ProductListItem) => void;
  clear: () => void;
  /** Called once on mount — sessionStorage cannot be read during SSR. */
  hydrate: () => void;
}

let hydrated = false;

export const useCompareStore = create<CompareState>((set, get) => ({
  mode: false,
  products: [],
  toggleMode: () => set({ mode: !get().mode }),
  toggle: (product) => {
    const current = get().products;
    const exists = current.some((item) => item.id === product.id);
    const next = exists
      ? current.filter((item) => item.id !== product.id)
      : current.length >= MAX_COMPARED_PRODUCTS
        ? current
        : [...current, product];
    writeStoredCompare(next);
    set({ products: next });
  },
  clear: () => {
    writeStoredCompare([]);
    set({ products: [] });
  },
  hydrate: () => {
    if (hydrated) return;
    hydrated = true;
    set({ products: readStoredCompare() });
  },
}));
```

### Step 4 — thin feature hook + refactor `useProductListing`

```ts
// features/products/hooks/compare/useCompare.hook.ts
"use client";

import { useEffect } from "react";
import { MIN_COMPARED_PRODUCTS } from "../../constants/compare/compare";
import { useCompareStore } from "../../stores/compare/compare.store";

/** Compare tray for any surface (PLP bar, /compare page). */
export function useCompare() {
  const mode = useCompareStore((s) => s.mode);
  const products = useCompareStore((s) => s.products);
  const toggleMode = useCompareStore((s) => s.toggleMode);
  const toggle = useCompareStore((s) => s.toggle);
  const clear = useCompareStore((s) => s.clear);
  const hydrate = useCompareStore((s) => s.hydrate);

  // sessionStorage read is a post-mount concern (SSR has no window).
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return {
    compareMode: mode,
    comparedProducts: products,
    comparedIds: products.map((item) => item.id),
    compareAtLimit: products.length >= MAX_COMPARED_PRODUCTS,
    canCompare: products.length >= MIN_COMPARED_PRODUCTS,
    toggleCompareMode: toggleMode,
    toggleCompareProduct: toggle,
    clearComparedProducts: clear,
    hydrate,
  };
}
```

`useProductListing.hook.ts` then **deletes** its `mode`/`products` state and spreads the hook:

```ts
  const compare = useCompare();
  // …
  return {
    …,
    compareMode: compare.compareMode,
    comparedProducts: compare.comparedProducts,
    comparedIds: compare.comparedIds,
    compareAtLimit: compare.compareAtLimit,
    toggleCompareMode: compare.toggleCompareMode,
    toggleCompareProduct: compare.toggleCompareProduct,
    clearComparedProducts: compare.clearComparedProducts,
  };
```

Nothing in `ProductListingPage.page.tsx` changes except adding `compareHref={PATHS.compare}`
to the bar (below) — every existing prop name is preserved.

### Step 5 — `ProductCompareBar`: deep link to `/compare`

Add props `compareHref?: string` and render an extra secondary action next to "Compare now",
reusing `Button asChild` + `Link` (no new styles needed; the bar already has a right-actions row):

```tsx
{
  compareHref ? (
    <Button type="button" variant="outline" size="sm" asChild>
      <Link href={compareHref}>{LABELS.compareNow}</Link>
    </Button>
  ) : null;
}
```

PLP keeps `onCompareNow={listing.scrollToCompare}` for the in-page section; the link is the
persistent entry point used by every other surface that renders the bar.

**Mobile note (WS-13.3):** the bar is currently `bottom-4 z-30` while the mobile tab bar is `z-40`,
so it renders _underneath_ the tab bar on phones and this new link would be untappable. WS-13.3
fixes the offset and z-index as part of this workstream's PR — do not ship the link without it.

### Step 6 — the `/compare` route

```tsx
// features/products/pages/compare/ComparePage.page.tsx
"use client";

export function ComparePage() {
  const compare = useCompare();
  if (!compare.canCompare) {
    return (
      <EmptyState
        icon={GitCompareArrows}
        eyebrow={LABELS.compare}
        heading={LABELS.compareEmptyHeading}
        message={LABELS.compareMinRequired}
        actionLabel={LABELS.browseAllProducts}
        actionTo={PATHS.products}
      />
    );
  }
  return (
    <div className={comparePageStyles.container}>
      <h1 className={comparePageStyles.title}>{LABELS.comparePageTitle}</h1>
      <ProductCompareSection products={compare.comparedProducts} />
    </div>
  );
}
```

- `ProductCompareSection` and `EmptyState` are reused as-is — the route adds no new visual
  language (`comparePageStyles` = `storefront-container space-y-6 py-8` + `text-h1 text-ink`).
- `features/products/pages/compare/comparePage.styles.ts` holds those two class strings.
- `app/(storefront)/compare/page.tsx` mirrors the other thin storefront routes:

```tsx
import { ComparePage } from "@/features/products";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.comparePageTitle);

export default function Compare() {
  return <ComparePage />;
}
```

- Export `ComparePage` from `features/products/index.ts`.
- New labels: `comparePageTitle: "Compare products"`, `compareEmptyHeading: "Nothing to compare yet"`
  (or reuse existing `compareSelectionCount` / `compareMaxReached` copy where it fits).

### Tests

- `features/products/stores/__tests__/compare.store.test.ts` — toggle adds/removes, respects
  `MAX_COMPARED_PRODUCTS`, `clear` empties the tray, sessionStorage round-trips.
- `features/products/pages/__tests__/ComparePage.test.tsx` — <2 selected renders `EmptyState`;
  ≥2 renders `ProductCompareSection` with every selected product.

### Acceptance

- Select 2 products on PLP → navigate to PDP → back → selection is still there (bar + section).
- Hard-refresh `/compare` → the tray renders (sessionStorage hydration).
- `sessionStorage` empty/blocked → no crash, empty state shown.

---

## WS-9 — "Did you mean" on zero-result search

**Gap:** spec §5.4 requires a suggestion line above the empty state when a close match exists;
today a zero-result search shows only "No results". The autocomplete endpoint already exists —
no API work needed.

### Step 1 — `features/search/hooks/did-you-mean/useSearchDidYouMean.hook.ts`

```ts
"use client";

import { useAutocomplete } from "../../api/search/search.queries";
import type { SearchSuggestion } from "../../types/search";

interface UseSearchDidYouMeanParams {
  term?: string;
  /** Only fetch when the listing actually came back empty. */
  hasNoResults: boolean;
}

/** Top autocomplete match for a failed search term, or null. */
export function useSearchDidYouMean({
  term,
  hasNoResults,
}: UseSearchDidYouMeanParams): SearchSuggestion | null {
  const query = term?.trim() ?? "";
  const { data } = useAutocomplete(query, hasNoResults && query.length > 0);
  const suggestions = data ?? [];
  // Guard against echoing the exact term the shopper just typed.
  // SearchSuggestion has { type, id, slug, name, path?, imageUrl?, basePrice?, sku? }.
  const match = suggestions.find(
    (item) => item.name.toLowerCase() !== query.toLowerCase(),
  );
  return match ?? null;
}
```

Note the `enabled` gate reuses the hook's own `SEARCH_AUTOCOMPLETE_MIN_CHARS` rule, so a
1-character query never fires a request.

### Step 2 — `features/search/components/did-you-mean/SearchDidYouMean.component.tsx` (+ styles)

```tsx
export function SearchDidYouMean({
  term,
  href,
}: {
  term: string;
  href: string;
}) {
  return (
    <p className={searchDidYouMeanStyles.row}>
      <span className={searchDidYouMeanStyles.text}>
        {formatLabel(LABELS.searchDidYouMean, { term })}
      </span>
      <Link href={href} className={searchDidYouMeanStyles.link}>
        {LABELS.searchDidYouMeanAction}
      </Link>
    </p>
  );
}
```

```ts
// features/search/styles/did-you-mean/searchDidYouMean.styles.ts
export const searchDidYouMeanStyles = {
  row: "mb-6 flex flex-wrap items-center justify-center gap-2 text-body text-ink-muted",
  text: "text-ink-muted",
  link: "font-medium text-brand underline-offset-4 hover:underline",
} as const;
```

Labels (add to `labels/commerce.ts`): `searchDidYouMean: "Did you mean {term}?"`,
`searchDidYouMeanAction: "Search instead"`. The link target comes from the existing
`suggestionHref(suggestion: SearchSuggestion): string` in
`features/search/utils/suggestions/suggestionHref.ts` (handles product/vendor/category) — do
**not** hand-build a URL.

### Step 3 — PLP wiring

`ProductListingPage.page.tsx` (logic stays in hooks):

```tsx
const didYouMean = useSearchDidYouMean({
  term: listing.filters.search,
  hasNoResults: listing.data?.items.length === 0,
});
const didYouMeanHref = didYouMean ? suggestionHref(didYouMean) : undefined;
```

Pass `didYouMeanTerm` / `didYouMeanHref` into `ListingResults`, which renders it directly above
`<EmptyState>` when present. `ListingResults` stays presentation-only.

### Acceptance

- Searching gibberish on `/products?search=…` shows the suggestion line when autocomplete has a
  near match, and nothing when it doesn't.
- The link lands on the suggested product/category and the suggestion row disappears.

---

## WS-10 — EmptyState "art frame" (token-only, no new assets)

**Gap:** spec §1.8/§4.5 describe a ~120px illustration above the empty-state heading; the
component renders a 20px Lucide icon in a 56px bordered circle, and `public/` ships no
illustration assets. Rather than adding binary art, promote the existing mark into a proper
token-based art frame (documented deviation, reversible if illustrations are ever commissioned).

### Edit — `shared/components/display/EmptyState.component.tsx` + `displayComponents.styles.ts`

```ts
// displayComponents.styles.ts — replace the iconWrap/icon entries
  artWrap:
    "mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-brand-subtle text-brand",
  artIcon: "h-12 w-12",
  // keep iconWrap/icon for the compact inline variant if any caller uses it
```

```tsx
{
  Icon ? (
    <div className={emptyStateStyles.artWrap}>
      <Icon
        className={cn(emptyStateStyles.artIcon, iconClassName)}
        strokeWidth={1}
        aria-hidden
      />
    </div>
  ) : null;
}
```

Only tokens change (`bg-brand-subtle`, `text-brand`, `rounded-full`) — no colour, radius or
shadow outside the existing scale, and dark mode follows automatically because both values are
palette-driven. `strokeWidth={1}` matches the 160px 404 art already used in `app/not-found.tsx`.

### Acceptance

- PLP zero-results, wishlist empty, cart empty (its own component) and the 404 look consistent;
  the frame re-colours correctly when the palette switches light ↔ dark.

---

## WS-11 — Consistency guards (inline currency, inline classes, shims)

Do this **after** WS-3, so a single lint run protects the result.

### 11a. Make `MoneyAmount` the only money renderer

`MoneyAmount` currently renders `₹{formatInrAmount(value)}`, while `formatInr` in
`shared/utils/formatting/orderFormat.ts` already returns glyph + grouped digits. Point the
component at it so the glyph has exactly one definition:

```tsx
// shared/components/display/MoneyAmount.component.tsx
import { formatInr } from "@/shared/utils/formatting/orderFormat";
// …
if (!pending && value != null) return <>{formatInr(value)}</>;
```

Then replace the inline `₹{formatInrAmount(...)}` sites (they skip the pending/failed affordance
today) with `<MoneyAmount value={…} pending={…} unavailable={…} />`:

| File                                                                                                  | Sites                         |
| ----------------------------------------------------------------------------------------------------- | ----------------------------- |
| `features/products/components/detail/ProductDetailContent/PriceAvailabilityBlock.component.tsx`       | 48, 67, 72                    |
| `features/products/components/detail/ProductDetailContent/StickyAddToCartBar.component.tsx`           | 40                            |
| `features/products/components/variants/VariantSelector/VariantPriceStockSection.component.tsx`        | 50, 54                        |
| `features/products/components/card/ProductCard/CardDetails.component.tsx`                             | 31, 36                        |
| `features/products/components/compare/ProductCompareSection/ProductCompareCard.component.tsx`         | 23                            |
| `features/admin-dashboard/components/coupons/CouponsPageHeader/CouponBatchDetailDialog.component.tsx` | 56, 64                        |
| `features/admin-dashboard/components/coupons/CouponsTable/CouponsAnalyticsDialog.component.tsx`       | 52, 58                        |
| `features/products/components/offers/ProductEligibleOffers/EligibleOfferItem.component.tsx`           | 17 (offer text → `formatInr`) |
| `features/products/hooks/specs/useProductSpecifications.hook.ts`                                      | 59 (spec value → `formatInr`) |

Pure-display amounts with no pending/unavailable concept (e.g. an always-present coupon batch
total) may use `formatInr` directly — the rule is "never a literal glyph", not "always the
component".

### 11b. New guard — `web/scripts/check-no-inline-currency.mjs`

Mirror the shape of the existing `scripts/check-no-raw-error-message.mjs` (pure Node `fs` walk,
allowlist, non-zero exit, readable message) and wire it into `lint`:

```jsonc
// package.json
"lint": "eslint . && node scripts/check-no-raw-error-message.mjs && node scripts/check-no-inline-currency.mjs && node scripts/check-no-client-money-math.mjs"
```

Rules it enforces (line scan, same approach as the raw-error guard):

1. No `₹` under `src/features/**` or `src/shared/components/**`, except
   `shared/utils/formatting/orderFormat.ts` (the single definition) and the two
   `prefix="₹"` input adornments in the admin settings forms (allowlist those files).
2. No `>{formatInrAmount` JSX child anywhere (that shape renders an unglyphed amount).

Add `scripts/lib/__tests__/inlineCurrency.test.mjs` next to the existing `moneyMath` tests so the
guard itself is covered.

### 11c. Inline class literals → `*.styles.ts`

25 `cn("…")` literals remain. `shared/components/ui/*` may keep theirs (they are the
design-system bridge, excluded from the rule); relocate the feature/shared-component ones:

| File                                                                                 | Literal to relocate                                      |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `shared/components/forms/CheckboxField.component.tsx:40`                             | `"min-w-0 flex-1"`                                       |
| `shared/components/forms/DateRangeFields.component.tsx:38,42,58`                     | `"contents"`, `"w-full sm:w-44"` ×2                      |
| `shared/components/forms/FormStack.component.tsx:11`                                 | `"space-y-6"`                                            |
| `shared/components/QuantitySelector/AnimatedQuantityValue.component.tsx:29`          | `"relative inline-flex overflow-hidden"`                 |
| `features/storefront/components/header/HeaderActionSkeletons.component.tsx:18,70,71` | `"hidden lg:block"`, `"invisible"`, `"absolute inset-0"` |

Then extend the new guard to also fail on `cn("` literals under `src/features/**`, so the
convention stops regressing.

### 11d. Inline `style={{ fontSize: "var(--text-*)" }}` → styles

5 sites duplicate a type token that already exists as a class: `SlideCopy.component.tsx:41`,
`ProductHeadingBlock.component.tsx:47`, `MaintenanceView.component.tsx:10`,
`GiftCardPurchasePage.page.tsx:16`, `WalletPage.page.tsx:21`. Replace each with the matching
`text-display-lg` / `text-display-sm` / `text-h1` class in the file's existing `*.styles.ts`.
Leave the genuinely dynamic ones (virtualizer heights, progress widths, chart colours).

### 11e. Remove the 82 re-export shims in `shared/components/`

Each shim is a 1–3 line `export * from "./<folder>/<X>"` giving one component two import paths.
Procedure per batch of ~10 files:

1. `grep -rln "@/shared/components/<Name>.component" src` → rewrite imports to the folder path
   (or the folder's `index.ts` barrel where one exists).
2. Delete the shim.
3. `npm run typecheck && npm run test && npm run lint` before moving to the next batch — never one
   big sweep (the historical casing bug `4f244a74` is exactly this class of mistake).

Batch order: leaf display components (`EmptyState`, `MoneyAmount`, `StatusBadge`,
`TruncatedText`, `StatCard`) → gallery/media → dialogs → the ones only tests import.

Files that aggregate several siblings (`Skeletons.component.tsx`, `Breadcrumbs.component.tsx`,
`skeletons/primitives.component.tsx`) are **not** shims — keep them. The list of 82 was produced
by this rule: file whose non-blank lines are all `export … from "…"` (≤ 4 lines).

---

## WS-12 — Metadata, robots, PWA manifest

### 12a. Delivery route metadata (8 files)

All eight delivery routes are server wrappers with no metadata (verified shape:
`app/delivery/dashboard/today/page.tsx` is 4 lines). Add one line each, using the shared
no-index helper so the agent app never lands in search results:

```tsx
import { TodayPage } from "@/features/delivery-dashboard";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.deliveryDashboard);

export default function Today() {
  return <TodayPage />;
}
```

| File                                                      | Title source               |
| --------------------------------------------------------- | -------------------------- |
| `app/delivery/page.tsx`                                   | `LABELS.deliveryDashboard` |
| `app/delivery/dashboard/today/page.tsx`                   | `LABELS.today`             |
| `app/delivery/dashboard/deliveries/page.tsx`              | `LABELS.deliveries`        |
| `app/delivery/dashboard/deliveries/[shipmentId]/page.tsx` | `LABELS.deliveries`        |
| `app/delivery/dashboard/pickups/page.tsx`                 | `LABELS.pickups`           |
| `app/delivery/dashboard/pickups/[returnId]/page.tsx`      | `LABELS.pickups`           |
| `app/delivery/dashboard/history/page.tsx`                 | `LABELS.history`           |
| `app/delivery/dashboard/profile/page.tsx`                 | `LABELS.profile`           |

Guard rails: keep these files as **server** components (a `"use client"` directive in the same
file forbids `export const metadata`; if any of them turns out to be a client file, keep the
client component in the feature and make the route file a thin server wrapper — that is already
the pattern for `/wallet` and `/reviews`).

Not in scope (corrects the earlier audit): `app/(storefront)/faq/page.tsx` is a
`redirect(PATHS.help)` and `app/auth/callback/page.tsx` is an auth redirect — neither needs or
can usefully carry metadata.

### 12b. `app/robots.ts`

```ts
    rules: [
      {
        userAgent: "*",
        allow: PATHS.home,
        disallow: [
          PATHS.login,
          PATHS.register,
          PATHS.forgotPassword,
          PATHS.resetPassword,
          PATHS.otp,
          PATHS.verifyEmail,
          PATHS.cart,
          PATHS.checkout,
          PATHS.profile,
          PATHS.orders,
          PATHS.wishlist,
          PATHS.wallet,
          PATHS.myReturns,
          "/admin/",
          "/vendor/",
          "/delivery/", // agent app — was missing entirely
          "/auth/",
          "/support/",
          "/gift-cards/redeem/",
        ],
      },
    ],
```

Removed: the dead `"/search?"` entry (no `/search` route exists — search lives on
`/products?search=…`, which is intentionally indexable; filtered PLP pages already carry
`filteredCategoryNoindex` metadata).

### 12c. PWA manifest + icon

`app/manifest.ts` today exposes only `favicon.ico` and hardcodes light-only colours. Next 16
serves `app/icon.svg` at `/icon.svg`, which unlocks a scalable, palette-accurate icon without
adding binary assets:

```tsx
// app/manifest.ts
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    // Manifest JSON cannot read CSS custom properties, so these mirror the
    // light-palette token values in shared/styles/globals.css (--paper, --brand).
    background_color: "#f6f3ec",
    theme_color: "#8a6a2e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
```

`app/icon.svg` is a hand-written text SVG (existing Lucide/`lucide-react` marks can be
inlined as a `<path>`) using the same two token values, so the brand mark stays palette-accurate:
literal hex is allowed _only_ here and in `manifest.ts`, mirroring how `globals.css` already
mirrors the palette, and each site gets a comment naming the token it copies.

Follow-up (design asset task, not code): 192/512 PNG exports of the same mark for install
prompts on older Android/Chrome — the SVG entries above already satisfy modern browsers.

### Acceptance

- `curl localhost:3000/robots.txt` lists `/delivery/`; `/sitemap.xml` is unchanged.
- Devtools → Application → Manifest: name, colours and icons resolve with no console warnings.
- `/delivery/dashboard/today` HTML carries `robots: noindex`.

---

## WS-13 — Responsive & tablet hardening

**Gap:** the plan's earlier workstreams are band-aware only incidentally. Auditing the real classes
turned up concrete defects where fixed-position surfaces do not clear the mobile tab bar / iOS home
indicator, one skeleton that doesn't match its content grid, and two spec §3.1 deviations (see
§0.4). Everything below is a class-string change in a `*.styles.ts` file — no markup logic moves.

### 13.1 One shared bottom offset instead of per-page safe-area maths

Today `MobileTabBar` pads its own inset (`env(safe-area-inset-bottom)`), and the storefront layout
reserves the bar's height (`pb-14 lg:pb-0`), but only **3 of ~25** storefront pages add the inset
themselves — so on iOS devices with a home indicator the last row of most pages can sit under it.

```ts
// shared/styles/common.styles.ts — new shared group (Rule 5: name it once)
/** Bottom offset that clears the mobile tab bar + iOS home indicator. */
export const MOBILE_TAB_BAR_OFFSET =
  "calc(3.5rem + env(safe-area-inset-bottom, 0px))";

// features/storefront/styles/layout/storefrontLayout.styles.ts
main: "flex-1 min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-72px)] pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0",
```

Then delete the now-redundant per-page overrides in `walletPage.styles.ts:3`,
`supportTicketsPages.styles.ts:25`, `bugReportsPages.styles.ts:31` (verify no double padding by
measuring bottom whitespace at 390×844 before/after).

### 13.2 PDP sticky add-to-cart misses the home indicator

```ts
// features/products/styles/detail/productDetailContent.styles.ts
stickyBarRoot:
  "fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-30 border-t border-line bg-surface/95 p-3 shadow-elevation-3 backdrop-blur-sm md:hidden",
```

It deliberately stacks on top of the tab bar (`bottom-14`), so the inset must be this bar's
`bottom-14` equivalent — this is the primary mobile CTA (spec §3.3 thumb-reach), so it must never
sit under the indicator.

### 13.3 Compare bar renders **under** the tab bar (and the plan adds a button to it)

`productCompareBarStyles.root` is `fixed bottom-4 … z-30`; `MobileTabBar` is `z-40`, so on phones
the bar is partially covered and the new "Compare now" link (WS-8 step 5) becomes untappable.

```ts
root: "fixed left-4 right-4 z-[45] bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] rounded-lg border border-line bg-surface-raised p-4 shadow-elevation-3 md:bottom-4 md:z-30",
```

`z-[45]` sits deliberately between the mobile tab bar (`z-40`) and the drawer/dialog layer (`z-50`),
so the bar stacks above the tab bar without relying on DOM order and without covering a dialog.
`md:z-30` restores the current desktop stacking (nothing overlaps it once the tab bar is gone).
`left-4 right-4` (16px) is already tailwind-4's `--space-4`, so no spacing token is bypassed.

### 13.4 Toast viewport sits on top of the tab bar

`ui/toast.tsx`'s viewport is `fixed bottom-0 right-0 z-[100] w-full … md:max-w-[360px]` — correct
per spec §4.4 (bottom-centre mobile / bottom-right desktop) but it covers the tab bar. The primitive
already accepts `className`, so WS-7 passes one:

```ts
// shared/styles/notifications/toastStack.styles.ts — add
viewport: "bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] md:bottom-0",
```

### 13.5 Skeleton grid columns don't match the real PLP grid

`skeletonPrimitivesStyles.gridContainer` is `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, but
`ProductGrid` is `grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4`. At the lg band the
loading state shows 4 columns then snaps to 3 — exactly the CLS the skeleton exists to prevent.

```ts
gridContainer: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6",
```

Keep the two strings in sync by commenting both with `// mirrors productGrid.styles.ts.grid`.

### 13.6 Bottom sheets ignore the md height rule

Spec §3.1: the filter/sort sheet is full-screen at xs/sm and **60% height at md**. The shared sheet
is a flat `max-h-[85vh]` at every band.

```ts
// shared/styles/dialogs/dialogComponents.styles.ts — bottomSheetViewStyles.sheet
sheet:
  "absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col rounded-t-lg bg-surface shadow-elevation-4 animate-slide-in-bottom md:max-h-[60vh]",
```

Landscape (§3.5) already satisfies "≤ 90vh" because the base is stricter; no extra rule needed.

### 13.7 Landscape phone: tab-bar labels must hide (spec §3.5)

```ts
// shared/styles/layout/layout.styles.ts — mobileTabBarStyles
textLabel: "text-[0.625rem] max-md:landscape:hidden",
textLabelNormal: "text-[0.625rem] font-normal max-md:landscape:hidden",
```

The tab item is already `min-h-11` with a column layout, so hiding the label leaves a centred icon
and reclaims ~12px of vertical space. No new media query is added — `landscape:` is a Tailwind v4
variant resolved from the same breakpoint tokens.

### 13.8 Rule for any new fixed/sticky surface

Nothing added by this plan may be `fixed`/`sticky` unless it declares, in the same style object:
(a) the bands it exists at, (b) its `env(safe-area-inset-*)` offset, (c) its z-index relative to
`MobileTabBar` (z-40) and `ui/dialog`/`ui/toast` (z-50/z-100). The three surfaces above
(13.2–13.4) are the ones that violated it; this line exists so review can check it mechanically.

### 13.9 Chips must satisfy the 44px rule — supersedes the WS-6 style block

```ts
// features/products/styles/filters/appliedFilterChips.styles.ts
chip:
  "inline-flex h-11 items-center gap-2 rounded-full border border-transparent bg-brand-subtle px-4 text-body-sm font-medium text-brand transition-colors hover:bg-surface hover:border-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
```

The 32px pill originally proposed fails §0.4 rule 1 (44px, xs→lg) and the repo's own locked
`h-11` control height. The row already wraps (`flex-wrap`), so 44px chips still read compact at
360–375px, and the tap target matches every other control on the page.

### 13.10 Tablet-band regression pass (md 768 and lg 1024) per changed surface

| Surface               | At md (768)                                        | At lg (1024)                                                                          |
| --------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Storefront header     | hamburger + tab bar, brand name not truncated      | hamburger + mobile **search button** (`hidden lg:block xl:hidden`), still no full nav |
| PLP                   | 3 columns; mobile action bar + filter/sort sheets  | 3 columns; same bar/sheets unless Option A is chosen                                  |
| Compare bar           | single column, clears the tab bar (13.3)           | `lg:flex-row`, bottom-right                                                           |
| Toast stack           | bottom-right ≤ 360px, clears the tab bar (13.4)    | same; tab bar now hidden                                                              |
| PDP sticky CTA        | **hidden** ≥ md (renders < md only)                | hidden                                                                                |
| Delivery/admin/vendor | drawer + mobile cards                              | sidebar + data tables                                                                 |
| New skeletons (WS-4)  | ledger/form/detail shapes match the md content box | same, no column snap (13.5)                                                           |

### Acceptance (WS-13)

| Viewport          | Device class     | Must pass                                                                                         |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| 360×640           | small Android    | no horizontal page scroll; chips are 44px; compare bar + toast + sticky CTA all clear the tab bar |
| 390×844           | iPhone (notch)   | home-indicator inset respected on every fixed bar and the layout's bottom padding                 |
| 390×844 landscape | phone landscape  | tab-bar labels hidden; bottom sheets ≤ 90vh and scroll internally                                 |
| 768×1024          | tablet portrait  | 3-col PLP; data tables render as cards; new skeletons match the content box                       |
| 1024×768          | tablet landscape | Option A/B decision is visible and consistent between spec and code; no clipped nav               |
| 1280×800          | desktop          | 4-col PLP; toasts bottom-right; nothing overlaps the tab bar (absent)                             |

Automated guard for 13.5 (cheap, catches the regression class):

```ts
// shared/styles/skeletons/__tests__/skeletonGridParity.test.ts
it("skeleton grid mirrors the product grid columns", () => {
  const columns = (value: string) =>
    value
      .split(" ")
      .filter(
        (c) =>
          c.startsWith("grid-cols-") || /^(sm|md|lg|xl):grid-cols-/.test(c),
      );
  expect(columns(skeletonPrimitivesStyles.gridContainer)).toEqual(
    columns(productGridStyles.grid),
  );
});
```

Manual-only checks (no e2e infra in the repo): the six-viewport table above, plus a keyboard pass
at 375px to confirm WS-2's focus trap still works with the tab bar visible.

---

## Explicitly out of scope — blocked on backend contracts

Listed so nobody "implements" them by inventing endpoints:

1. **Notification inbox / header bell.** `backend/src/modules/notifications/notifications.routes.ts`
   exposes only `GET /logs`, `POST /test`, `POST /broadcast`, `GET /push/public-key`,
   `POST|DELETE /push/subscribe`. There is no per-user list, unread count, or mark-read endpoint,
   and no realtime channel for them. FE work becomes possible once those exist:
   `features/notifications/{api,hooks,components}` + a bell in
   `features/storefront/components/header/StorefrontActionButtons.component.tsx` and
   `shared/components/layout/WorkspaceNavDrawer.component.tsx` + a `notificationBell.store.ts`
   badge — the toast stack from WS-7 is the natural in-session surface in the meantime.
2. **Per-channel notification preferences** (spec §5.13 Email/SMS matrix). No preference fields in
   the user/settings models (grepped: no `notificationPreferences` / `notifyEmail` / `emailOptIn`).
   Needs a backend contract + settings schema first.
3. **Real chat widget.** `useChatWidget.hook.ts` only toggles a panel; there is no chat module,
   endpoint, or socket namespace. Optional stopgap while it waits:

   ```tsx
   // shared/components/system/ChatWidget.component.tsx — replace the static body
   <Button variant="link" size="sm" asChild>
     <Link href={PATHS.supportTicketNew}>{LABELS.mySupportTickets}</Link>
   </Button>
   ```

   That routes shoppers into the existing support-ticket flow instead of a dead panel
   (one-line change, no new state).

4. **i18n / locale switching.** Single `en_IN` locale with centralised English copy; adding
   locales is a routing + library decision well outside this remediation.

---

## PR sequencing

| PR  | Contents               | Why this order                                                                                 |
| --- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | **WS-1 + WS-2 + WS-3** | fixes land before the gate that enforces them                                                  |
| 2   | **WS-4**               | self-contained; visible win                                                                    |
| 3   | **WS-5 + WS-12**       | tiny diffs, plus the robots/metadata corrections                                               |
| 4   | **WS-13**              | band-correctness pass — 13.3/13.4/13.9 are prerequisites for the surfaces WS-6/WS-7/WS-8 add   |
| 5   | **WS-6**               | first feature; touches PLP only; uses the final `h-11` chip from 13.9                          |
| 6   | **WS-7**               | shared-layer change, affects every dashboard → keep it isolated; uses the 13.4 viewport offset |
| 7   | **WS-8**               | depends on nothing, but re-orders product files; ships 13.3's bar offset at the same time      |
| 8   | **WS-9 + WS-10**       | both are PLP/empty-state polish                                                                |
| 9+  | **WS-11**              | one PR per shim batch, plus the currency/class guards last                                     |

---

## Verification matrix (run per PR)

| Command                                   | Expectation                                                                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                       | clean                                                                                                                                 |
| `npm run lint`                            | 0 errors; after PR 1 the six `jsx-a11y` rules are errors. Existing 74 `react-hooks/*` warnings may stay                               |
| `npm run test`                            | green, with the new tests from each workstream                                                                                        |
| `npm run limits`                          | passes — **never** add a file to `scripts/line-limits-baseline.json` to make it pass                                                  |
| `npm run build && npm run budgets`        | passes (no new client bundle from WS-4/5/12; WS-6/7/9 add only presentational code)                                                   |
| Manual, keyboard only                     | chips (Tab + Enter removes), mobile nav (focus trap/Escape/restore), PLP zero-results, toast stack, compare tray, wallet skeleton     |
| Manual, phone bands (360×640, 390×844)    | no horizontal page scroll; 44px chips; tab bar, PDP sticky CTA, compare bar and toasts all clear the tab bar and the home indicator   |
| Manual, phone landscape (390×844 rotated) | tab-bar labels hidden; filter/sort sheets ≤ 90vh and scroll internally                                                                |
| Manual, tablet bands (768×1024, 1024×768) | 3-col PLP + card-mode tables at md; no column snap in the PLP loading state (WS-13.5); Option A/B nav decision visible and consistent |
| Manual, both palettes                     | toggle `data-theme` on every changed surface — chips, toasts, empty-state art, skeletons, `/compare`, `/orders/tracking`              |

---

## Definition of done

- [ ] Every `<Input>`/`<Select>`/`<Textarea>` inside a `FormFieldFrame` is reachable via
      `getByLabelText`, reports `aria-invalid`, and its `aria-describedby` ids resolve (WS-1).
- [ ] Mobile/workspace nav and bottom sheets are real dialogs: `role="dialog"`, `aria-modal`,
      Escape, focus trap, focus restore, scroll lock (WS-2).
- [ ] `npm run lint` fails on a regression in any of the six a11y rules (WS-3).
- [ ] No route renders a blank screen or a wrong-shaped skeleton; the delivery app has one (WS-4).
- [ ] Footer "Track order" reaches `/orders/tracking`; no route is orphaned; no raw path literals
      (WS-5).
- [ ] Applied filters are individually removable and keyboard-operable (WS-6).
- [ ] Success/info/error toasts stack with a max of 3 and announce correctly (WS-7).
- [ ] Compare survives navigation and has its own `/compare` URL (WS-8).
- [ ] Zero-result searches offer a suggestion line when autocomplete has one (WS-9).
- [ ] Empty states use the token-based art frame consistently (WS-10).
- [ ] No literal `₹`, no new inline class literal, no duplicate component import paths (WS-11).
- [ ] Every route carries metadata or a documented reason not to; `/delivery/` is disallowed;
      the manifest resolves with real icons (WS-12).
- [ ] Every band passes on the six-viewport matrix in WS-13: no horizontal page scroll, 44px
      tap targets, every fixed bar clears the tab bar + safe-area inset, skeletons match the real
      grid, and the two spec §3.1 deviations are resolved (code aligned or spec updated).

### Two corrections to the original audit, carried into this plan

1. **`jsx-a11y` is not absent** — `eslint-config-next` loads it and enables six rules, but as
   warnings, and the rules that catch WS-1/WS-2 are not enabled at all. WS-3 therefore _extends_
   the gate rather than creating one.
2. **`/faq` and `/auth/callback` are redirects**, so their "missing metadata" was a false
   positive; only the 8 delivery routes need metadata.

---

## Implementation status (as built)

**Landed and verified** — `tsc --noEmit` 0 errors · `npm run lint` 0 errors · `npm run limits`
passes · 268 tests pass (63 files) · `next build` succeeds.

| WS    | Status  | Notes / deviations from the written plan                                                                                                                                                                                                                                                                                                             |
| ----- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WS-1  | ✅ done | Context + `useId` wiring in `FormFieldFrame`, consumed by `Input`/`Textarea`/`SelectTrigger`; 13 bare-label sites given `htmlFor` + control ids (kept `<label>` rather than converting to `FormFieldFrame` where the label sits in a bespoke header row — same a11y outcome, no layout churn). 5 tests.                                              |
| WS-2  | ✅ done | `useModalOverlay` + dialog semantics on the three overlays; shared `OVERLAY_BACKDROP`; hover-only wrappers marked `role="presentation"`; Hero keyboard moved to its arrow buttons; gallery gets a labelled full-bleed button behind the zoom overlay. **0 findings on all six rules.**                                                               |
| WS-3  | ✅ done | Six rules promoted to errors in `eslint.config.mjs`.                                                                                                                                                                                                                                                                                                 |
| WS-4  | ✅ done | 4 skeletons + **20** new `loading.tsx` routes (29 → 49), plus `category/[...slug]` and the vendor bug-report form.                                                                                                                                                                                                                                   |
| WS-5  | ✅ done | `PATHS.orderTracking`, footer/account/mobile-nav entry points, `PATHS.giftCards` now used.                                                                                                                                                                                                                                                           |
| WS-6  | ✅ done | `useFilters.removeFilters`/`removeAttrValue`, `useAppliedFilterChips`, 3 components + styles + a dedicated `labels/appliedFilters.ts` subset (kept `tables3.ts` under its ceiling).                                                                                                                                                                  |
| WS-7  | ✅ done | `toast.store` + `ToastStack*` + container; `ErrorToast` replaced while `notifyError` keeps its signature. Toast titles are **flat** label keys (`toastSuccessTitle`…) because `LABELS` is consumed as `Record<string, string>`. 3 tests.                                                                                                             |
| WS-8  | ✅ done | `compare.store` + sessionStorage, `useCompare`, `PATHS.compare`, `/compare` page reusing `ProductCompareSection`/`EmptyState`, bar deep link. 6 tests.                                                                                                                                                                                               |
| WS-9  | ✅ done | Reuses `useAutocomplete` + `suggestionHref`; suggestion line above the zero-result state.                                                                                                                                                                                                                                                            |
| WS-10 | ✅ done | Token-only art frame on `EmptyState`.                                                                                                                                                                                                                                                                                                                |
| WS-11 | ✅ done | ~120 money renders moved behind `formatInr`/`MoneyAmount` (+ new `CURRENCY_SYMBOL` as the single glyph definition, and `scripts/check-no-inline-currency.mjs` wired into `npm run lint`); inline class literals moved into styles; 13 inline type-token styles moved into styles as classes; **78 re-export shims deleted** (594 imports rewritten). |
| WS-12 | ✅ done | 7 delivery routes no-indexed, robots corrected, manifest + `app/icon.svg` (the 8th delivery route is a redirect).                                                                                                                                                                                                                                    |
| WS-13 | ✅ done | Safe-area offset centralised in the storefront layout (3 ad-hoc overrides removed), PDP sticky CTA + compare bar (`z-[45]`) + toast viewport offsets, skeleton-grid parity (+ the parity test), sheet `md:max-h-[60vh]`, landscape tab-bar labels.                                                                                                   |

**Found and fixed while implementing (not in the original plan):**

- **`npm run typecheck` was unusable on macOS**: git tracks `components/Header/` while the working
  tree had `header/`, producing TS1149 casing errors. Renamed the directory back to git's casing.
- **6 files exceeded their line ceilings** (`labels/tables2.ts`, `auth` bootstrap hook + its test,
  the export-jobs watcher, both infinite-select hooks). Fixed by extracting a media-upload label
  subset, a JWT-claims util, splitting the auth-bootstrap test into two files with shared fixtures,
  extracting `useExportJobsSocket`, and adding shared `useInfiniteScrollSentinel` +
  `useInfiniteSelectQueryState` + `mergeUniqueById` used by both select variants. `npm run limits`
  now passes.
- **7 `jsx-a11y/no-autofocus` warnings** resolved with justified inline suppressions (each is a
  control inside a dialog/popover opened by a user action, where moving focus in is correct).
- **Three real money bugs** surfaced by the sweep: coupon "applied" copy rendered an unformatted
  number; the gift-card amount hint and redeem-success copy interpolated raw numbers into `₹{}`
  templates. All three now go through `formatInr`.

**Budget gate — now passing: `1167.7 KB` gz vs the 1200 KB ceiling** (1272.2 KB before the fix
below). The pre-existing failure is kept here for context:

- **`npm run budgets` fails: 1268 KB gzipped vs a 1200 KB ceiling.** This was already failing
  before any of the above (measured baseline: **1266 KB**), so it is not a regression — the
  implementation added ~2 KB net. Largest identified client chunks: `1icfl-gqn42s8.js`
  **104 KB gz = `html5-qrcode`** (delivery barcode scanner, already dynamically imported),
  94/98 KB gz vendor chunks, `24hmv2jc4w76g.js` 42 KB gz = `leaflet` (also dynamic), and
  `recharts` spread across the admin route chunks. Because the budget sums _all_ generated client
  JS (not first-load), the only way to move it is to drop shipped code:
  1. **Replaced `html5-qrcode` with the native `BarcodeDetector` API — done.** The camera loop now
     lives in `features/delivery-dashboard/hooks/pickups/useBarcodeScanner.hook.ts` (detects ~10×/s
     against a rear-camera `<video>`, stops on the first decode, releases the tracks on unmount) over
     the pure helpers in `utils/pickups/barcodeDetection.ts` (constructor probe, format intersection,
     decode normalisation). Browsers with no usable detector — Firefox, older Safari — get an
     explicit "type the tracking number instead" notice; the pickups/deliveries pages already had the
     manual search box for that path, so no capability is lost. Covered by 14 unit tests (8 helper +
     6 hook: decode-once, unsupported, camera failure, quiet frames, track release, no camera when
     unmounted early), and the dependency plus its lock entry are gone, so the ~104 KB gz chunk
     leaves the build rather than being deferred. **Wants a real device pass on Android Chrome and
     iOS Safari before release** — the unit tests mock `getUserMedia` and `BarcodeDetector`.
  2. Lazy-mount the admin `recharts` panels (moves weight between chunks; does not reduce the total).
     Not needed once option 1 landed.
  3. Raise the ceiling with a documented justification. Not taken: the ceiling now has ~32 KB of
     headroom, so the 1200 KB figure stands.

**Warning baseline** (unchanged by this work): 74 `react-hooks/*` warnings, which the repo's own
`eslint.config.mjs` comment marks as _"TEMPORARY (Phase 6 scope): pre-existing findings … demoted to
warnings so CI is green while each is refactored"_. Fixing them is a behavioural refactor of 40+
hooks and is tracked there, not here.

---

## WS-14 — Mobile conventions & device verification

Scope: close the gap between design spec §3.1–3.5/§6.8 and the code, without changing the theme or
introducing new UX patterns. Nothing here adds client JS (budget unchanged at 1167.7 KB gz).

**P0 — silent breakages on real devices**

- **`viewportFit: "cover"` added to `ROOT_VIEWPORT`.** Without it every `env(safe-area-inset-*)` in
  the tab bar, sticky bars, sheets, drawers and toasts resolved to `0` on iOS, so the whole WS-13
  safe-area layer was inert — and DevTools emulation hid it because the emulator injects insets.
  Turning cover **on** also exposed the top edge, so the two top-anchored surfaces
  (storefront header, auth top bar + impersonation banner) now reserve
  `env(safe-area-inset-top)`, and every full-bleed rail (tab bar, PDP/checkout bars, compare bar,
  toasts, sheets, drawers, cart drawer, cookie banner) carries its horizontal/top/bottom insets.
- **16px field fonts on phones.** `Input` already did this; `Textarea`, `NumberInput`, `OtpInput`
  and the admin role dialog's native `<select>` did not, so iOS zoomed the page on focus —
  including checkout, reviews and OTP entry. All now use `text-[1rem] sm:text-body(-sm)`.

**Guards (fail the build, so this cannot regress) — `scripts/check-safe-area-offsets.mjs`**

- Fails any `fixed`/`sticky`/`absolute` element pinned to a viewport edge without the matching
  `env(safe-area-inset-*)`, with three justified allowlist entries for elements that apply the
  offset inline, and a stale-entry check so the allowlist cannot rot.
- Fails duplicated rail offsets: those class strings exist once, in
  `src/shared/constants/layout/mobileRails.ts`, and every consumer imports them.
- Wired into `npm run lint`; probe-tested both ways (fails on a deliberate violation, passes clean).

**P1 — partial conformance**

- **`vh` → `dvh`** in the mobile-critical heights (storefront layout, bottom sheet, not-found,
  error boundary, loading pages, maintenance, export tray, checkout summary panel, toast viewport):
  iOS' dynamic toolbars make `100vh` taller than the visible viewport.
- **Landscape (§3.5)** now complete: the sheet caps at 90dvh with internal scroll, and the PDP
  switches from stacked to side-by-side below `md` (skeleton kept in sync).
- **iOS PWA icons**: `apple-icon.png` (180) plus 192/512 + maskable-512 PNGs, generated
  reproducibly by `scripts/generate-app-icons.mjs`; the manifest now ships the raster set. iOS
  ignores SVG for home-screen icons, so the icon was previously a page screenshot.

**P2 — documentation**

- `MOBILE-DEVICE-CHECKLIST.md`: device matrix, per-area expectations, the Web Inspector snippets
  that prove the insets, and a sign-off table. Referenced from `AGENTS.md` (new rule 10).

**Tests added** (15): `ROOT_VIEWPORT` cover assertion, field-font contract (4 fields + the native
select), rail-offset module contract, and the admin dialog's field size.
**Remaining:** the manual device pass — emulation cannot verify insets, so the checklist is the
artifact and it needs a real iPhone/Android before release.

---

## WS-15 — Assistive-tech & input-purpose pass

Audit first, then fixes; every item below was verified in the code before being touched (two
"obvious" findings turned out to be false positives — Home _does_ have an `h1` via `motion.h1`,
and the auth cards already render one — so they were left alone).

**Verified gaps, fixed**

- **No skip link (WCAG 2.4.1).** `SkipToContentLink` now renders as the first focusable element in
  the root layout; all nine `<main>` landmarks (storefront, auth, three workspace shells, four
  workspace error boundaries) carry `id={MAIN_CONTENT_ID}` + `tabIndex={-1}` so the target is real
  and focusable everywhere, including the error pages.
- **Client-side navigation was silent for assistive tech.** The App Router neither announces route
  changes nor moves focus, so a screen-reader user got no confirmation and kept reading from the old
  position. `useRouteAnnouncement` + `RouteAnnouncer` now announce the new page's heading (document
  title as fallback) through a polite live region, and move focus into the page body — except when
  the user is typing (debounced filter navigation) or an overlay owns focus, and never for in-page
  anchors or the first render.
- **Address/checkout fields had no autofill.** Only auth forms set `autoComplete`. The shared
  `AddressFormFields` (used by both the account dialog and the checkout address step) now carries
  `address-line1`, `address-line2`, `address-level2`, `address-level1`, `postal-code`,
  `country-name` — the difference between a typed Indian address and an autofilled one on mobile.
- **The product listing's `<h1>` said "All Products" on every one of its URLs.** It now names the
  surface: the search term ("Results for “kurta”"), the category, or the generic label as fallback —
  still visually hidden, so nothing moves on screen.
- **Heading hierarchy:** the admin/vendor reports pages used `<h2>` as their page title, leaving
  those documents without an `h1`; both are now `<h1>`. The four workspace error boundaries also
  rendered their heading as `<h2>`—now `<h1>`.
- **Cart changes were silent.** `CartCountAnnouncer` (mounted once in the storefront header) writes
  to a polite live region when the count changes, with its own message for an emptied cart; it stays
  silent on mount and on unchanged counts.
- **Browser-locale dates inside an en-IN app.** 15 call sites used `toLocaleDateString()` /
  `toLocaleTimeString([], …)` / `toLocaleString()` with no locale, so an order placed on a US-locale
  browser rendered `3/14/2026` while the rest of the app showed `14 Mar 2026`. All now use the
  shared `formatDate` / `formatTime` / `formatDateTime` (two new formatters added), including two
  admin wallet tables that were pinned to en-IN but in a different date style.

**Guards added (both wired into `npm run lint`, both probe-tested to fail on a violation)**

- `scripts/check-page-structure.mjs` — every `<main>` must carry `id={MAIN_CONTENT_ID}`; every
  feature with a `pages/` directory must render an `<h1>`; every `src/app` route file that renders
  `<main>` must render one too. Stale allowlist entries fail the run.
- `scripts/check-date-locale.mjs` — a locale-sensitive call must pass a locale-looking argument.

**Tests added** (34): skip-link target/behaviour, route-announcement helpers and hook (silent first
render, announce + focus, no focus while typing, silent on anchors), cart announcement + component,
address autofill tokens, and the new date formatters.

**Not done in this pass** (deliberately, needs its own scope): standardising `mode: "onTouched"`
across the ~form hooks that omit it (validation timing), a storefront offline/stale banner, and the
destructive-action audit across 29 `useCancel*/useDelete*/useRemove*` hooks.
