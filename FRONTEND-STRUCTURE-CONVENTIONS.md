# Frontend structure conventions — authoritative reference

**Purpose:** every frontend file touched anywhere in this plan must strictly follow the rules below. This is a direct synthesis of `web/AGENTS.md`'s numbered rules (loaded automatically as this repo's frontend `CLAUDE.md`), scoped to the much wider set of frontend areas this plan touches: `vendor-dashboard`, `admin-dashboard`, `orders`, `categories`, `products` (variants/filters), `auth`, `delivery-dashboard`, `supportTickets`, `wallet`, plus `shared/` (session adapter, badges, breadcrumbs), following the same method as `../calculation-audit-remediation-plan/FRONTEND-STRUCTURE-CONVENTIONS.md`.

**Compliance status of this plan:** every FE file this plan specifies was checked against every rule below — see "Compliance audit" at the bottom.

---

## 1. The governing hierarchy (`web/AGENTS.md`)

```
Application → Feature / Domain → Responsibility → Specific Functionality → Implementation Files
```

Concretely, inside any feature or inside `shared/`:

```
<feature-or-shared>/
  api/<functionality>/<file>.api.ts
  components/<functionality>/<file>.component.tsx
  hooks/<functionality>/<file>.hook.ts
  styles/<functionality>/<file>.styles.ts
  types/<functionality>/<file>.types.ts
  pages/<functionality>/<file>.page.tsx   — vendor-dashboard / admin-dashboard pattern
  utils/<functionality>/<file>.ts
```

Every new file this plan creates (F-05's vendor returns tab, F-21's structured CSV-error types) lands at this depth — grouped by responsibility then functionality — matching existing siblings exactly (e.g. F-05's new files mirror `vendor-dashboard/{pages,hooks,components}/orders/*` one-for-one, just under a new `returns/` functionality folder).

## 2. Layer boundaries — what each suffix is allowed to contain (`web/AGENTS.md` rules 1, 5, 7)

| Suffix                                   | Allowed to contain                                                                              | Forbidden                                                                                               |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `.component.tsx`                         | Presentation, composition, prop destructuring, conditional rendering of already-computed values | `useState`/`useEffect`, API calls, data transformation, inline `.map()`, inline arrow-function handlers |
| `.hook.ts`                               | State, side effects, API orchestration, event handler definitions, derived state                | JSX                                                                                                     |
| `.api.ts`                                | Network calls only                                                                              | Business logic, React state, JSX                                                                        |
| `.page.tsx` (route wrapper under `app/`) | Thin re-export of a feature's page component + metadata                                         | Any logic at all — confirmed pattern: every `app/**/page.tsx` in this codebase is 5-9 lines             |

**Zero business/state logic in JSX components** (`web/AGENTS.md` rule 1) — every fix in this plan that touches a `.component.tsx` file (F-12's PoD thumbnail, F-24's badge unification, F-27's ARIA labels) confines its change to markup/props/attributes; any new derived value goes in the paired `.hook.ts`.

## 3. Money-math guardrail — `web/scripts/check-no-client-money-math.mjs`

Wired into `npm run lint`, fails the build on arithmetic involving a money-named identifier under `src/features`/`src/shared`. **No file this plan touches performs money arithmetic** — F-15's fix (admin-dashboard invoice download error handling), F-18's server-side proportional-discount fix, and every other frontend change in this plan is either display-only or non-monetary logic (coupon UI, CSV parsing, status badges, ARIA labels). Confirm this remains true for any new code added: if a diff ever needs to sum/derive a money value client-side, that is itself a new violation of this guardrail and a signal the value should come from the backend instead — do not add an allowlist entry to route around it without the same scrutiny `12-impl-frontend-earnings-hook-fix.md` in the calculation-audit-remediation-plan already gave the two existing allowlist entries.

## 4. Cross-feature imports — the barrel pattern

Confirmed live pattern (`useVendorOrderManagement.hook.ts` importing `subOrdersApi` from `@/features/orders`, not a local `vendor-dashboard/api/orders`): a feature's own domain API/hooks are re-exported through that feature's `index.ts` barrel, and _other_ features import through the barrel rather than reaching into another feature's internal `api/`/`hooks/` folders directly. `web/eslint.config.mjs`'s `FEATURES` array + `no-restricted-imports` rules (Rule 15, feature-boundary enforcement) enforce this at lint time. F-05's new vendor-dashboard returns tab imports `returnsApi` from `@/features/returns` (the barrel), exactly mirroring how the existing orders tab imports `subOrdersApi` from `@/features/orders` — **never** add a local `vendor-dashboard/api/returns/` duplicate of logic that already exists in `features/returns/`.

## 5. Styling & JSX cleanliness (`web/AGENTS.md` rules 1, 2, 7, 8)

No hardcoded Tailwind/class-name strings directly in JSX — every component has a companion `*.styles.ts` exporting `as const` style dictionaries. Every new/edited component in this plan (F-05, F-12, F-21, F-24, F-27, F-28) follows this: new class strings go into that functionality's existing `.styles.ts` file (or a new one, named identically to its component, if the functionality folder doesn't have one yet), never inline in the `.tsx`.

## 6. Deduplication discipline (`web/AGENTS.md` rule 3)

Before adding new logic, search for and reuse an existing implementation. Confirmed cases this plan must respect:

- F-24's fix must **not** create a third status→color mapping — it consolidates the two that already exist (`StatusBadge.component.tsx`'s `getVariant()` and `orderStatusDisplay.utils.ts`'s `orderTone()`/`paymentTone()`) onto one source of truth, reusing `StatusBadge`'s classification.
- F-10's stock-clamp fix (backend, but the frontend convention applies to the equivalent principle) must reuse `MAX_CART_LINE_QUANTITY` from `cart.constants.ts` rather than hardcoding a new magic number.
- F-15's admin-dashboard fix reuses the existing `notifyError()` global toast utility (`web/src/shared/stores/notifications/errorToast.store.ts`) — the exact same utility `vendor-dashboard/hooks/commission/useCommissionInvoices.hook.ts` already uses for the identical `commissionsApi.downloadInvoice` call — rather than introducing a second error-surfacing mechanism.

## 7. Accessibility conventions

No repo-wide ARIA/a11y lint gate exists (confirmed — `web/eslint.config.mjs` has no `eslint-plugin-jsx-a11y` block), so accessibility correctness in this codebase is a matter of following existing hand-written patterns, not an enforced gate. F-27's fix should match the existing `aria-pressed={active}` pattern already present on `VariantOptionButton.component.tsx` (i.e. extend what's already there — add `aria-label`, don't replace the existing `aria-pressed`) and use a semantic grouping element (`role="radiogroup"` + `aria-labelledby`, or `<fieldset>`/`<legend>`) for `VariantAttributeGroup.component.tsx`, which currently uses a bare `<div>`.

## 8. Route-level Next.js conventions (`web/src/app/`)

- Every dynamic/static route segment that can throw during render has an `error.tsx` sibling (`"use client"`, receives `{ error, reset }`, calls `reportError(error, { boundary: "<segment-name>" })` in a `useEffect`, renders via shared `errorBoundaryStyles`). Confirmed template: `web/src/app/admin/error.tsx`. F-28's new `web/src/app/vendor/error.tsx` is a structural copy of this template with `boundary: "vendor"`.
- A route segment gets its own `loading.tsx` when inheriting a parent segment's `loading.tsx` would render the wrong skeleton shape (confirmed precedent + rationale comment: `web/src/app/(storefront)/orders/[orderId]/loading.tsx`, which exists specifically to override the inherited orders-list skeleton with an `OrderDetailSkeleton`). Do not add a redundant `loading.tsx` where the inherited one is already correct.

---

## Compliance audit — the FE files this plan specifies, checked against the rules above

| Rule                                                     | File(s) checked                                                      | Result                                                  |
| -------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------- |
| Feature/responsibility/functionality depth for new files | F-05's `vendor-dashboard/{pages,hooks,components}/returns/*`         | ✅ Mirrors `orders/*` sibling exactly                   |
| Cross-feature imports go through the barrel              | F-05 (`@/features/returns` → `returnsApi`)                           | ✅ No local API duplication                             |
| Hook owns state/derived values, not the component        | F-12, F-24, F-27                                                     | ✅                                                      |
| No money-math added to any touched file                  | All FE changes                                                       | ✅ Every touched file is display/UI/error-handling only |
| Reuse existing implementation before adding new logic    | F-24 (`StatusBadge`/`orderTone` consolidation), F-15 (`notifyError`) | ✅                                                      |
| `error.tsx`/`loading.tsx` match existing template        | F-28 (`vendor/error.tsx`)                                            | ✅ Copies `admin/error.tsx`'s exact shape               |
| No hardcoded class strings                               | All new/edited components                                            | ✅ Routed through `*.styles.ts`                         |

The one item this audit flags rather than claims: F-20's exact fix location depends on which of two independent filter systems (`ProductListingPage`'s `parseFilters`/`filtersToParams`, vs. `CategoryPlpPage`'s `useCategoryPlpParams`/`useCategoryPlpData`) the finding is actually about — both have real, distinct defects (see `05-impl-phase4-low-priority-polish.md`), and the audit's single file reference (`ProductListingPage.page.tsx`) only clearly matches one of them. This plan fixes both rather than guessing which one the audit meant, since both are real and both are cheap.
