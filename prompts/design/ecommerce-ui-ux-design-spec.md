# E-Commerce UI/UX Design Specification

**Purpose:** this document is the single source of truth for the visual and interaction design of the storefront, vendor dashboard, and admin dashboard. It specifies _how the UI looks and behaves_ — component anatomy, states, spacing, motion, responsive rules, and page layouts — so that an AI coding assistant (or any engineer) can implement the frontend without making an unstated design decision. It does not cover business logic, API contracts, or data flow — those are the frontend/backend implementation docs already produced for this project.

**How to use this document:** every component and page section below is written to be sufficient on its own — sizing, spacing, states, and responsive behavior are stated explicitly rather than implied. Where a rule is global (spacing scale, motion timing, focus states), it's defined once in Sections 2–4 and referenced by name everywhere else, rather than restated per component. Nothing in this document should be interpreted as a suggestion; treat every stated value as a requirement unless marked "example."

---

## 0. Design Philosophy

**Premium, restrained, trustworthy.** This is a multi-vendor marketplace — the UI's job is to make browsing fast and buying feel safe, not to perform "boldness" for its own sake. Four operating principles govern every decision below:

1. **Clarity over decoration.** Every screen answers "what is this, what does it cost, can I trust it, what happens if I click this" before it does anything else visually. Decoration (motion, color, illustration) is allowed only where it doesn't compete with that.
2. **One signature, quiet everywhere else.** The product's single recurring visual signature is the **vendor-identity strip** (small vendor avatar + name + rating, in the brand color on a hairline pill) — it appears identically on every product touchpoint (card, PDP, cart, order history) so a shopper always knows who they're buying from. Everything else in the system is intentionally restrained so that signature keeps meaning something.
3. **Density matches intent.** The storefront (browsing, discovery) uses generous spacing and larger type. The vendor/admin dashboards (managing, deciding) use tighter density, tabular data, and monospace figures. Same tokens, different composition — this is the difference between a store window and a stockroom, and both are correct for their job.
4. **Motion explains, it doesn't decorate.** Every animation in this system exists to communicate a state change (something opened, something was added, something loaded) — never as embellishment. Section 3 enumerates every allowed animation; if a pattern isn't listed there, it doesn't get built.

---

## 1. Design System

### 1.1 Color Tokens

Color is defined as **semantic tokens**, never raw hex values in component specs — a component says "use `--surface`," not "use white." This is what makes dark mode a token-swap instead of a redesign.

**Brand & neutral scale (light mode base):**

| Token              | Light value           | Dark value         | Usage                                                                    |
| ------------------ | --------------------- | ------------------ | ------------------------------------------------------------------------ |
| `--brand`          | `#2A5C4B`             | `#4F9C82`          | Primary CTA, active nav state, price emphasis, links                     |
| `--brand-hover`    | `#1D4237`             | `#63B396`          | Hover/pressed state of brand-colored elements                            |
| `--brand-subtle`   | `#EAF2EE`             | `#16302A`          | Brand-tinted backgrounds (selected filter chip, active tab underline bg) |
| `--accent`         | `#C9722C`             | `#E08D46`          | Scarcity/urgency signals only ("2 left," sale badge) — never decorative  |
| `--ink`            | `#14171C`             | `#F2F1EC`          | Primary text                                                             |
| `--ink-muted`      | `#5B6069`             | `#A6ACB5`          | Secondary text, captions, metadata                                       |
| `--ink-faint`      | `#8B9098`             | `#6E747D`          | Disabled text, placeholder text                                          |
| `--paper`          | `#FAFAF8`             | `#121417`          | Page background                                                          |
| `--surface`        | `#FFFFFF`             | `#1B1E22`          | Card/panel background (one level above page bg)                          |
| `--surface-raised` | `#FFFFFF`             | `#23272C`          | Modals, dropdowns, popovers (two levels above page bg)                   |
| `--line`           | `#E4E2DD`             | `#2C3036`          | Default borders, dividers                                                |
| `--line-strong`    | `#CFCCC5`             | `#3A3F46`          | Emphasized borders (input focus ring container, table header rule)       |
| `--danger`         | `#B3261E`             | `#E5645B`          | Errors, destructive actions                                              |
| `--danger-subtle`  | `#FCEBEA`             | `#3A1E1C`          | Error banner/toast backgrounds                                           |
| `--success`        | `#1E6B45`             | `#4CAE83`          | Success states, in-stock indicators                                      |
| `--success-subtle` | `#E9F5EE`             | `#16302A`          | Success banner/toast backgrounds                                         |
| `--warning`        | `#946200`             | `#E0A828`          | Warnings (low stock, pending states)                                     |
| `--warning-subtle` | `#FBF1DC`             | `#3A2E10`          | Warning banner/toast backgrounds                                         |
| `--overlay`        | `rgba(20,23,28,0.48)` | `rgba(0,0,0,0.64)` | Modal/drawer backdrop                                                    |

**Rules:**

- Body text on `--paper`/`--surface` must resolve to at least WCAG AA contrast (4.5:1 for text under 18px, 3:1 for larger/bold) — `--ink` on both light and dark surfaces above is pre-verified to pass; do not introduce a new text color without checking contrast first.
- `--accent` is reserved exclusively for scarcity/urgency (stock count, sale badge, "ends soon"). It never appears as a generic highlight color — if it starts showing up on non-urgency UI, that's a spec violation.
- Dark mode is not "invert everything" — surfaces get _lighter_ as they rise (page → card → modal), same directional logic as light mode's shadow-based elevation, just achieved with lightness steps instead of shadow since shadows read poorly on dark backgrounds (see 1.5).

### 1.2 Typography System

**Families:**

- **Display** — `Fraunces` (variable serif). Large-size product-story moments only: homepage hero headline, PDP product name at ≥28px, vendor spotlight headings. Never used for UI chrome, buttons, or body copy.
- **Sans/UI** — `Inter`. Everything else: navigation, body copy, form labels, buttons, all dashboard content.
- **Mono** — `IBM Plex Mono`. Numeric/data contexts only: prices in dashboard tables, SKUs, order numbers, timestamps in logs. Not used for storefront prices (those use Inter at higher weight — mono is a dashboard-density signal, not a storefront one).

**Type scale** (all values in `rem`, base 16px):

| Token               | Size             | Line height | Weight | Family        | Usage                                                                                  |
| ------------------- | ---------------- | ----------- | ------ | ------------- | -------------------------------------------------------------------------------------- |
| `--text-display-lg` | 3.5rem / 56px    | 1.05        | 500    | Fraunces      | Homepage hero headline                                                                 |
| `--text-display-md` | 2.5rem / 40px    | 1.1         | 500    | Fraunces      | Section headings on marketing surfaces, PDP product name                               |
| `--text-display-sm` | 1.75rem / 28px   | 1.2         | 500    | Fraunces      | Vendor spotlight card headline                                                         |
| `--text-h1`         | 1.75rem / 28px   | 1.25        | 600    | Inter         | Page titles (PLP category name, dashboard page title)                                  |
| `--text-h2`         | 1.375rem / 22px  | 1.3         | 600    | Inter         | Section headings within a page                                                         |
| `--text-h3`         | 1.125rem / 18px  | 1.35        | 600    | Inter         | Card headings, sub-section headings                                                    |
| `--text-body-lg`    | 1.0625rem / 17px | 1.5         | 400    | Inter         | Lead paragraphs, PDP description                                                       |
| `--text-body`       | 0.9375rem / 15px | 1.5         | 400    | Inter         | Default body text, form inputs                                                         |
| `--text-body-sm`    | 0.8125rem / 13px | 1.45        | 400    | Inter         | Captions, metadata, helper text                                                        |
| `--text-label`      | 0.8125rem / 13px | 1.3         | 500    | Inter         | Form labels, table headers, nav items — uppercase tracking optional per component spec |
| `--text-mono`       | 0.8125rem / 13px | 1.4         | 500    | IBM Plex Mono | SKUs, order numbers, dashboard figures                                                 |

**Rules:**

- Never more than 3 font sizes on a single screen's primary content area (excluding nav/footer chrome).
- Heading hierarchy is strict: a page has exactly one `--text-h1`; `--text-h2` never appears before an `--text-h1` in DOM order.
- Line length for body text caps at ~72 characters (`max-width: 65ch` on paragraph containers) — applies to PDP descriptions, blog content, policy pages.

### 1.3 Spacing System (8px Grid)

All spacing — padding, margin, gap — uses this scale exclusively. No arbitrary pixel values in component specs.

| Token        | Value | Typical use                                                                 |
| ------------ | ----- | --------------------------------------------------------------------------- |
| `--space-0`  | 0     | —                                                                           |
| `--space-1`  | 4px   | Icon-to-label gap, tight inline spacing                                     |
| `--space-2`  | 8px   | Base unit — default gap between related small elements                      |
| `--space-3`  | 12px  | Input internal padding (vertical), chip padding                             |
| `--space-4`  | 16px  | Default card padding, gap between form fields                               |
| `--space-5`  | 20px  | —                                                                           |
| `--space-6`  | 24px  | Card-to-card gap in a grid, section internal padding (mobile)               |
| `--space-8`  | 32px  | Section internal padding (desktop), gap between major page blocks           |
| `--space-10` | 40px  | —                                                                           |
| `--space-12` | 48px  | Gap between distinct page sections (e.g. PDP gallery block → reviews block) |
| `--space-16` | 64px  | Hero section padding, large section separation                              |
| `--space-20` | 80px  | Homepage section-to-section rhythm on desktop                               |

**Rule:** every component's padding/margin/gap value in this document is one of the tokens above. If a layout seems to need something between two steps, use the larger step — don't introduce a half-step token.

### 1.4 Layout, Grid & Breakpoints

**Breakpoints:**

| Token      | Min-width | Device class                                   |
| ---------- | --------- | ---------------------------------------------- |
| `--bp-xs`  | 0         | Small phones (iPhone SE class, 375px baseline) |
| `--bp-sm`  | 480px     | Large phones                                   |
| `--bp-md`  | 768px     | Tablets (portrait)                             |
| `--bp-lg`  | 1024px    | Small laptops, tablets landscape               |
| `--bp-xl`  | 1280px    | Large laptops, standard desktop                |
| `--bp-2xl` | 1536px    | Large desktop                                  |
| `--bp-3xl` | 1920px    | Ultra-wide monitors                            |

**Container widths** (max-width of the centered content area at each breakpoint):

| Breakpoint | Container max-width                                                             | Grid columns | Gutter |
| ---------- | ------------------------------------------------------------------------------- | ------------ | ------ |
| xs–sm      | 100% (16px side padding)                                                        | 4            | 16px   |
| md         | 100% (24px side padding)                                                        | 8            | 20px   |
| lg         | 960px                                                                           | 12           | 24px   |
| xl         | 1200px                                                                          | 12           | 24px   |
| 2xl        | 1400px                                                                          | 12           | 32px   |
| 3xl        | 1600px (content does not stretch beyond this — center with flanking whitespace) | 12           | 32px   |

**Rules:**

- Mobile-first: every component/page spec below states the mobile (xs) layout first, then lists what changes at each subsequent breakpoint — never the reverse.
- The storefront uses the full 12-column grid for PLP/PDP layouts; dashboards use a fixed `240px` left-nav + fluid content area instead of the marketing grid (density principle, Section 0).
- Ultra-wide (3xl): content never stretches edge-to-edge — the container caps at 1600px and centers, with the page background (`--paper`) filling the flanks. Product grids may add one additional column (5 instead of 4 on PLP) rather than stretching existing cards wider.

### 1.5 Elevation & Shadow System

Light mode uses shadow to express elevation; dark mode uses surface-lightness steps (shadows are barely visible on dark backgrounds and read as murky rather than elevated).

| Token           | Light mode (box-shadow)           | Dark mode equivalent                              | Usage                                      |
| --------------- | --------------------------------- | ------------------------------------------------- | ------------------------------------------ |
| `--elevation-0` | none                              | `--surface` (base, `#1B1E22`)                     | Page background, flat cards on their own   |
| `--elevation-1` | `0 1px 2px rgba(20,23,28,0.06)`   | `--surface` at `#1B1E22` with 1px `--line` border | Product cards, default panels              |
| `--elevation-2` | `0 4px 12px rgba(20,23,28,0.08)`  | `#23272C`                                         | Dropdowns, popovers, hover-raised cards    |
| `--elevation-3` | `0 12px 32px rgba(20,23,28,0.14)` | `#2A2F35`                                         | Modals, dialogs                            |
| `--elevation-4` | `0 24px 48px rgba(20,23,28,0.18)` | `#31373E`                                         | Drawers (cart drawer, filter bottom sheet) |

**Rule:** elevation only increases on interaction (hover/open), never decreases below a component's resting elevation. A card at rest is `--elevation-1`; on hover it may rise to `--elevation-2` — it never drops to `--elevation-0` on hover.

### 1.6 Border Radius System

| Token           | Value  | Usage                                                                 |
| --------------- | ------ | --------------------------------------------------------------------- |
| `--radius-sm`   | 6px    | Chips, badges, small buttons, input fields                            |
| `--radius-md`   | 10px   | Cards, standard buttons, dropdowns                                    |
| `--radius-lg`   | 16px   | Modals, drawers, large panels                                         |
| `--radius-full` | 9999px | Avatars, pill badges, toggle switches, the vendor-identity-strip pill |

**Rule:** exactly these four values, system-wide. No component introduces a fifth radius value. Nested elements use a radius one step smaller than their container (a button inside a `--radius-lg` modal uses `--radius-md`, not `--radius-lg`).

### 1.7 Iconography

- **Library:** Lucide (consistent 1.5px stroke weight, 24×24 default viewbox).
- **Sizes:** `16px` (inline with `--text-body-sm`/`--text-label`), `20px` (inline with `--text-body`, default for buttons/inputs), `24px` (standalone icon buttons, nav icons).
- **Color:** icons inherit `currentColor` — they never carry a hardcoded fill separate from the surrounding text/button color.
- **Never mix icon styles.** Every icon in the product comes from Lucide; no mixing in a second icon set for "one missing icon" — request/build a matching-style custom icon instead.

### 1.8 Illustration Guidelines

Illustration is used sparingly, only for: empty states (empty cart, empty wishlist, no search results, no orders yet) and system pages (404, 500, maintenance). Style: single-color line illustration using `--ink-muted`, no more than one accent color fill using `--brand-subtle`. Never photographic, never a stock-illustration-pack style with multiple saturated colors — illustration must look like it belongs to the same restrained system as everything else, not a bolted-on decoration.

### 1.9 Image Aspect Ratios

| Context                | Aspect ratio                 | Notes                                                            |
| ---------------------- | ---------------------------- | ---------------------------------------------------------------- |
| Product card thumbnail | 1:1                          | Cropped to square via `object-fit: cover`, centered              |
| PDP main gallery image | 1:1                          | Same ratio as card — consistent product photography grid         |
| PDP thumbnail rail     | 1:1                          | 64×64px                                                          |
| Category tile          | 4:3                          |                                                                  |
| Vendor logo            | 1:1                          | Circular mask (`--radius-full`) at all display sizes             |
| Vendor banner          | 21:9                         | Vendor storefront page header                                    |
| Homepage hero          | 16:9 (desktop), 4:5 (mobile) | Different crops served per breakpoint, not the same image scaled |
| Blog cover image       | 16:9                         |                                                                  |

**Rule:** every image container reserves its aspect ratio via CSS (`aspect-ratio` property) before the image loads — this is a hard requirement for CLS prevention (Section 9), not optional polish.

### 1.10 Theme Architecture

Tokens are CSS custom properties on `:root` (light, default) and overridden under a `[data-theme="dark"]` attribute on `<html>`, toggled by a persisted user preference (falls back to `prefers-color-scheme` on first visit, then respects an explicit user choice thereafter).

```css
:root {
  --brand: #2a5c4b;
  --ink: #14171c;
  --paper: #fafaf8;
  --surface: #ffffff;
  --line: #e4e2dd;
  /* ...full token set from 1.1, 1.2, 1.3, 1.5, 1.6 */
}

[data-theme="dark"] {
  --brand: #4f9c82;
  --ink: #f2f1ec;
  --paper: #121417;
  --surface: #1b1e22;
  --line: #2c3036;
  /* ...dark values from the same tables */
}
```

**Rule:** components are built against token names only — a component's spec never says "background: white," it says "background: `--surface`." This is what makes dark mode support automatic for every component built to this spec, rather than a second implementation pass.

---

## 2. Global Interaction & Motion System

Every component's state behavior and every animation in the product is drawn from this section — component specs in Section 4 reference these by name rather than redefining them.

### 2.1 Timing & Easing Tokens

| Token               | Duration | Easing                       | Usage                                                                      |
| ------------------- | -------- | ---------------------------- | -------------------------------------------------------------------------- |
| `--motion-instant`  | 100ms    | `ease-out`                   | Hover color/background changes, focus ring appearance                      |
| `--motion-fast`     | 150ms    | `ease-out`                   | Button press feedback, checkbox/toggle state change, tooltip appearance    |
| `--motion-base`     | 200ms    | `cubic-bezier(0.2, 0, 0, 1)` | Dropdown/popover open, tab switch, accordion expand                        |
| `--motion-moderate` | 300ms    | `cubic-bezier(0.2, 0, 0, 1)` | Modal/dialog open, drawer slide, page-section reveal                       |
| `--motion-slow`     | 400ms    | `cubic-bezier(0.2, 0, 0, 1)` | Hero reveal on page load only — the single slowest animation in the system |

**Rule:** nothing in this system animates slower than 400ms, and nothing that blocks user action (a modal opening, a drawer sliding in) exceeds 300ms — nothing should feel like it's making the user wait on a decoration. `prefers-reduced-motion: reduce` collapses every duration above to `0ms` (state changes happen instantly, no exceptions) system-wide via a single global media query — not opted into per component.

### 2.2 Universal Interactive States

Every interactive element (button, input, card, link, nav item) defines these five states; a component spec in Section 4 that doesn't explicitly override one of these inherits the default here.

| State                            | Default treatment                                                                                                                                                                                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Default**                      | Resting appearance per component spec                                                                                                                                                                                                                                          |
| **Hover** (pointer devices only) | Background shifts one step toward `--brand-subtle` (for brand-colored elements) or `--line` (for neutral elements); `--motion-instant`. Cards additionally rise one elevation step (Section 1.5). Never a hover state on touch-primary devices — no sticky `:hover` after tap. |
| **Focus-visible**                | 2px solid `--brand` outline, offset 2px from the element edge, applied via `:focus-visible` (never on mouse click, only keyboard/programmatic focus) — `--motion-instant`. This is non-negotiable per component, see Section 6.                                                |
| **Active/pressed**               | Scale to 0.98 (buttons only) or background one step darker than hover; `--motion-fast`.                                                                                                                                                                                        |
| **Disabled**                     | Opacity 0.5, `cursor: not-allowed`, all hover/active/focus behavior removed, `--ink-faint` for any text.                                                                                                                                                                       |
| **Loading**                      | Component-specific (see individual specs) but always retains the element's committed size (no layout shift when a button becomes a spinner) and disables interaction.                                                                                                          |

### 2.3 Named Animation Patterns

Every motion effect in the product is one of the following ten — nothing outside this list is built without a spec update first.

1. **Page-load hero reveal** (homepage only) — headline and hero image fade + translateY(12px→0) staggered 80ms apart, `--motion-slow`, runs once per page load, never on subsequent scroll.
2. **Modal/Dialog open** — backdrop fades to `--overlay` over `--motion-base`; dialog itself scales from 0.96→1 and fades in, `--motion-moderate`. Close is the reverse at `--motion-base` (closing is always faster than opening).
3. **Drawer slide** (cart drawer, filter bottom sheet, mobile nav) — slides in from the relevant edge (right for cart, bottom for mobile filter sheet) over `--motion-moderate`, spring-influenced easing (slight overshoot ≤2% permissible for a physical feel) — backdrop fades simultaneously.
4. **Toast/Snackbar** — slides up + fades in from the bottom (mobile) or bottom-right (desktop) over `--motion-fast`; auto-dismisses after 4s (informational) or stays until dismissed (error/action-required); exit reverses the entrance.
5. **Dropdown/Popover/Select open** — fades + scales from 0.98→1 anchored to its trigger, `--motion-base`.
6. **Accordion/Tab expand** — height animates via `grid-template-rows: 0fr → 1fr` (not `max-height` hacks), `--motion-base`; content fades in over the same duration.
7. **Add-to-cart feedback** — the cart icon in the header performs a single scale-pulse (1→1.15→1) over `--motion-fast`, and a small badge count increments with a scale-in; the cart drawer does NOT auto-open on add (avoid interrupting browsing) — a toast confirms instead, with a "View cart" action.
8. **Wishlist toggle** — the heart icon fills with a quick scale-pulse (1→1.2→1), `--motion-fast`; color transitions from `--ink-muted` outline to `--danger`-toned fill (wishlist uses a warm fill color distinct from the brand green, since it's an emotional/personal action, not a commerce action).
9. **Image gallery crossfade** (PDP) — selected thumbnail swaps the main image via a 200ms crossfade, `--motion-base`; no slide/zoom transition, crossfade only, to keep it calm at high-frequency interaction (users click through many thumbnails).
10. **Skeleton shimmer** — a single left-to-right gradient sweep, 1.2s duration, linear, infinitely looping while content is loading; replaced immediately (no cross-fade transition needed) the instant real content is ready.

**Explicitly not used anywhere in this system:** parallax scrolling, bounce/elastic easing beyond the ≤2% drawer overshoot noted above, auto-playing carousels without pause controls, confetti/celebration effects beyond the order-success page (Section 5.10 specifies that one exception), scroll-jacking of any kind.

### 2.4 Loading & Progress Patterns

| Pattern                        | When used                                                                                                                                                                                                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Skeleton screens**           | Any content that has a known shape before it loads — product grids, PDP, order lists, dashboard tables. Skeleton shapes match the real content's layout exactly (same card dimensions, same number of visible lines) so there's no reflow when content arrives. |
| **Spinner (small, inline)**    | Inside a button mid-action ("Add to cart" → spinner replaces label, button width stays fixed) or a small async check (coupon code validating).                                                                                                                  |
| **Progress bar (determinate)** | File uploads (product images, KYC docs) where percent-complete is knowable.                                                                                                                                                                                     |
| **Full-page loader**           | Never used for route transitions (skeleton screens handle that) — reserved only for the very first app load before any shell is painted.                                                                                                                        |

### 2.5 Scroll & Load Behavior

- **Infinite scroll** is used for PLP/search results (loads next page ~2 viewport-heights before the user reaches the current bottom, shows a skeleton row while fetching); always paired with a manually-reachable "Load more" fallback button after 3 auto-loaded pages, so power users/keyboard users aren't forced into endless auto-loading.
- **Pull-to-refresh** (mobile only, touch-detected) on: order list, notifications list. Standard iOS/Android-native pull gesture with a `--brand`-colored spinner indicator.
- **Scroll-triggered reveal** is used exactly once per page maximum (e.g. homepage's vendor-spotlight section fading up into view) — never stacked section-after-section, which reads as gimmicky rather than premium.
- **Smooth scroll** (`scroll-behavior: smooth`) applies to in-page anchor jumps only (e.g. PDP spec-tab jump-to-reviews link), never to route changes.

---

## 3. Responsive Design Rules

This section defines cross-cutting responsive behavior; Section 5's page specs reference these rules rather than restating them per page.

### 3.1 Breakpoint Behavior Summary

| Breakpoint       | Nav pattern                                                                | Grid columns (PLP)   | Filter UI                    | Checkout steps                             |
| ---------------- | -------------------------------------------------------------------------- | -------------------- | ---------------------------- | ------------------------------------------ |
| xs (0–479px)     | Hamburger menu, bottom tab bar for core actions (Home/Search/Cart/Account) | 2                    | Full-screen bottom sheet     | One step per screen                        |
| sm (480–767px)   | Hamburger menu, bottom tab bar                                             | 2                    | Full-screen bottom sheet     | One step per screen                        |
| md (768–1023px)  | Hamburger menu, header search visible                                      | 3                    | Bottom sheet (60% height)    | One step per screen                        |
| lg (1024–1279px) | Full horizontal nav, mega menu on hover                                    | 3                    | Left sidebar, collapsible    | Multi-column (form + summary side-by-side) |
| xl (1280–1535px) | Full horizontal nav, mega menu                                             | 4                    | Left sidebar, always visible | Multi-column                               |
| 2xl+ (1536px+)   | Full horizontal nav, mega menu                                             | 4 (5 at 3xl per 1.4) | Left sidebar, always visible | Multi-column, wider summary column         |

### 3.2 Typography Scaling

Display and heading tokens (Section 1.2) scale down at xs/sm via `clamp()`, never a hard breakpoint jump that causes reflow jank:

```css
--text-display-lg: clamp(2rem, 5vw + 1rem, 3.5rem);
--text-h1: clamp(1.375rem, 3vw + 0.5rem, 1.75rem);
```

Body text (`--text-body` and smaller) does not scale across breakpoints — 15px body text is the floor on every device, never shrunk further for "fitting more on screen."

### 3.3 Touch Targets & Safe Areas

- **Minimum touch target: 44×44px** on any device with touch input (applies at xs through lg; lg is touch-capable on convertible devices so the rule doesn't cut off at md). Below 44px visually (e.g. a 24px icon), the tap area is expanded via padding, not the icon itself enlarged.
- **Safe area insets** (`env(safe-area-inset-*)`) are respected on the bottom tab bar and any full-bleed bottom sheet/drawer on iOS — content never sits under the home indicator.
- **Thumb-reach zones on mobile:** primary actions (Add to Cart, Place Order, Apply Filter) are positioned in the bottom third of the viewport on xs/sm wherever the page allows it (sticky bottom bar pattern — see PDP and Checkout in Section 5), not top-of-screen where they require a hand-shift to reach on large phones.

### 3.4 Image Behavior Across Breakpoints

- Product images use `srcset`/`sizes` to serve appropriately sized crops per breakpoint — never a desktop-resolution image downscaled by CSS on mobile.
- The homepage hero swaps to a distinctly different crop (4:5 portrait-leaning) below `md`, not the same 16:9 image with `object-fit: cover` cutting off the sides — the mobile crop is art-directed separately per Section 1.9.

### 3.5 Landscape Behavior (Mobile)

- Below `md` in landscape orientation: the bottom tab bar collapses to icons-only (labels hidden) to reclaim vertical space; any full-screen modal/bottom-sheet caps its height at 90vh with internal scroll rather than extending off-screen.
- PDP gallery in landscape on mobile switches from a stacked (image-above-details) to a side-by-side layout matching the `md` breakpoint's treatment, since landscape phone width approximates tablet-portrait width.

---

## 4. Component Library

Every component below states: anatomy, sizing, spacing (by token), states (inherits Section 2.2 unless overridden), and responsive notes. Colors/spacing/motion referenced by token name from Sections 1–2.

### 4.1 Form Controls

#### Button

| Variant     | Background  | Text      | Border                   | Height                          | Usage                                                                                |
| ----------- | ----------- | --------- | ------------------------ | ------------------------------- | ------------------------------------------------------------------------------------ |
| Primary     | `--brand`   | white     | none                     | 44px (lg), 36px (md), 32px (sm) | Main CTA per screen — exactly one primary button visible at a time in any given view |
| Secondary   | `--surface` | `--ink`   | 1px `--line`             | same as primary                 | Secondary actions alongside a primary                                                |
| Ghost       | transparent | `--ink`   | none                     | same as primary                 | Tertiary actions, toolbar buttons                                                    |
| Destructive | `--danger`  | white     | none                     | same as primary                 | Delete/remove/cancel-order actions                                                   |
| Link-style  | transparent | `--brand` | none, underline on hover | auto                            | Inline text-level actions                                                            |

- Padding: `0 --space-6` (lg/md), `0 --space-4` (sm). Icon+label buttons: `--space-2` gap between icon (20px) and label.
- Radius: `--radius-md`. Full-width variant available for mobile primary CTAs (checkout, add-to-cart on PDP sticky bar).
- Loading state: label replaced by a 16px spinner centered, button width unchanged, `aria-busy="true"`.
- Disabled: per Section 2.2 default.

#### Input (text/email/password/number)

- Height: 44px. Padding: `0 --space-4`. Radius: `--radius-sm`. Border: 1px `--line`, background `--surface`.
- Label: `--text-label`, positioned above the field with `--space-2` gap, always visible (no placeholder-as-label pattern — accessibility requirement, Section 6).
- Placeholder text: `--ink-faint`, only used for format hints ("MM/YY"), never as the only label.
- Focus: border becomes `--brand` 1.5px + the standard focus-visible outline (Section 2.2).
- Error state: border `--danger`, helper text below in `--danger` with an inline error icon (16px), `role="alert"` on the helper text so screen readers announce it.
- Helper/error text: `--text-body-sm`, `--space-2` gap below the field.
- Password inputs include a show/hide toggle (eye icon, 20px, inside the field's right padding).

#### Textarea

Same visual treatment as Input; default height accommodates 3 lines (auto-grows up to 8 lines, then internal scroll), resize handle disabled (layout is controlled by the design, not user-draggable).

#### Dropdown / Select

- Closed state: identical sizing to Input, with a 16px chevron-down icon at the right edge.
- Open state: `--motion-base` fade+scale (Section 2.3.5), options list in `--surface-raised` at `--elevation-2`, `--radius-md`, max-height 320px with internal scroll beyond ~8 visible options.
- Option row: 40px height, `--space-4` horizontal padding, hover background `--brand-subtle`, selected option shows a 16px checkmark at the right edge and `--brand` text color.
- Native `<select>` used on mobile (xs/sm) to get the OS-native picker UX; custom-styled listbox used at `md`+.

#### Search Bar

- Height: 44px (header, standalone) / 36px (embedded in a filter panel). Full pill radius (`--radius-full`) for the header search bar specifically — the one deliberate exception to the 4-value radius rule in 1.6, since a pill search bar is a strong, recognizable e-commerce convention.
- Leading 20px search icon, trailing clear (×) icon appears only once text is entered.
- Autocomplete dropdown: `--surface-raised`, `--elevation-2`, opens `--motion-base`, each suggestion row shows a 32×32px product thumbnail + name, 48px row height.

#### Checkbox

- 20×20px box, `--radius-sm` (4px effectively, scaled down), 1.5px `--line` border, `--surface` background.
- Checked: `--brand` fill, white checkmark icon, `--motion-fast` scale-in on the checkmark.
- Label sits to the right, `--space-2` gap, entire row (box + label) is one click target minimum 44px tall on touch devices even though the visual box is 20px.

#### Radio

Same sizing/spacing logic as checkbox; circular, checked state shows a `--brand` filled inner dot (10px) inside the 20px outer ring.

#### Toggle/Switch

- Track: 44×24px, `--radius-full`, `--line` background (off) / `--brand` background (on).
- Thumb: 20px circle, white, `--motion-fast` slide transition between states.
- Used for binary settings only (notification preferences, dark mode toggle) — never used for anything with a "loading/pending" third state (use a proper multi-state control for that instead).

#### Quantity Selector

- Horizontal group: minus button (32×32px, ghost variant) — numeric input/display (44px wide, centered text, `--text-body`, editable via direct keyboard entry as well as the buttons) — plus button (32×32px, ghost variant). Whole group has a 1px `--line` border, `--radius-sm`, no internal dividers.
- Minus button disables (Section 2.2 disabled state) at quantity 1. Plus button disables at the item's available stock.

### 4.2 Content Display

#### Card (generic base)

`--surface` background, `--elevation-1` at rest, `--radius-md`, `--space-4` internal padding (`--space-6` for larger feature cards). Hover: `--elevation-2` only if the card is itself interactive/clickable (static info cards don't get a hover elevation change).

#### Product Card

Anatomy top to bottom: 1:1 image (Section 1.9) with `object-fit: cover` → scarcity badge (top-left, absolute, `--accent` background, only if stock ≤5) or out-of-stock overlay (full-image semi-transparent `--overlay` scrim with "Out of stock" label centered) → `--space-3` gap → vendor-identity strip (20px avatar + name, `--text-body-sm`, `--brand` text) → `--space-1` gap → product name (`--text-body`, `--ink`, 2-line clamp with ellipsis) → `--space-1` gap → price row (current price `--text-body` weight 600 `--brand`; if discounted, compare-at price `--text-body-sm` `--ink-faint` strikethrough alongside) → `--space-1` gap → rating (14px star icons + review count in `--text-body-sm` `--ink-muted`).

- A "Quick add" button appears on image hover (desktop) as an overlay pill at the image's bottom edge; on mobile it's always visible below the price row instead of a hover reveal (no hover on touch, Section 2.2).
- Entire card is a single link to the PDP except the quick-add button and wishlist icon (top-right of image, 32px tap target), which stop propagation.
- Grid gap between cards: `--space-6` (lg+), `--space-4` (below lg).

#### Category Card

4:3 image, overlaid with a bottom gradient scrim (`linear-gradient(transparent, rgba(20,23,28,0.6))`) and the category name (`--text-h3`, white) positioned bottom-left over the scrim — no separate text-below-image treatment, category cards are always image-forward.

#### Price Display

Current price is always the visually dominant element in any price cluster (largest size, `--brand` or `--ink` depending on context, weight 600). Compare-at/original price is always smaller, `--ink-faint`, strikethrough, and positioned after (never before) the current price. Discount percentage (if shown) renders as a small `--accent`-background badge, never as part of the price text itself.

#### Discount Badge

`--accent` background, white text, `--text-body-sm` weight 600, `--radius-sm`, `--space-1` vertical / `--space-2` horizontal padding. Format: "-20%" or "Save ₹200" — never both simultaneously on one badge (pick the more compelling framing per product, but don't stack).

#### Rating / Stars

5-star row, 16px stars (filled `--warning`-toned gold, not `--brand` — rating stars use a conventional gold so they're instantly recognizable, brand color is reserved for actions/price). Half-star rendering via a clipped fill, not a separate half-star icon asset. Review count in parentheses immediately follows, `--text-body-sm` `--ink-muted`.

#### Review Component (list item)

Avatar (32px) + reviewer first-name-and-initial → star rating row → "Verified Purchase" badge (small, `--success-subtle` background, `--success` text, only if applicable) → review title (`--text-h3`) → review body (`--text-body`) → helpful/unhelpful vote buttons (ghost button style, thumbs-up/down 16px icons + count) at the bottom. `--space-4` between reviews, `--line` divider between each.

#### Avatar

Circular (`--radius-full`), sizes: 24px / 32px / 40px / 64px / 96px (profile page) depending on context. Fallback (no image): initials on a `--brand-subtle` background, `--brand` text.

#### Badge / Chip / Tag

- **Status badge** (order status, product status): `--radius-sm`, `--space-1`/`--space-2` padding, `--text-body-sm` weight 500, color-coded via the subtle background tokens (`--success-subtle`+`--success` text for "Delivered/Live," `--warning-subtle`+`--warning` for "Pending," `--danger-subtle`+`--danger` for "Cancelled/Rejected").
- **Filter chip** (applied filter, removable): `--radius-full`, `--brand-subtle` background, `--brand` text, includes a small × (12px) to remove, `--space-2` gap between label and ×.
- **Tag** (category/attribute label, non-removable): `--radius-sm`, `--line` background, `--ink-muted` text, no icon.

#### Timeline (order tracking, return status)

Vertical line (2px, `--line`) connecting circular step markers (12px, `--line` fill for incomplete steps, `--brand` fill + white checkmark for completed steps, `--brand` with a pulsing ring animation for the current in-progress step). Each step: label (`--text-body`), timestamp (`--text-body-sm` `--ink-muted`) if completed, `--space-4` vertical gap between steps.

### 4.3 Navigation

#### Header

- Height: 72px (lg+), 56px (below lg). Sticky on scroll, `--surface` background, `--elevation-1` appears only once the page has scrolled past the hero (transparent-over-hero on the homepage specifically, solid immediately on every other page).
- Layout (lg+, left to right): logo → primary nav links → search bar (flexible width, centered-ish) → cart icon + wishlist icon + account menu (role-driven per Section 6.5 of the frontend implementation doc — same conditional-render logic, this document only specifies the visual treatment).
- Layout (below lg): hamburger (left) → logo (center) → search icon + cart icon (right); tapping the hamburger opens a full-screen nav drawer (`--motion-moderate` slide from left).

#### Mega Menu

Triggered on hover (lg+) after a 150ms intent delay (prevents accidental trigger on mouse-transit), or on click (md and touch devices). Full-width panel below the header, `--surface-raised`, `--elevation-2`, columns for category groups with a curated image tile on the far right (featured collection). Closes on mouse-leave after a 200ms delay (same intent-buffering logic) or on outside click/Escape.

#### Sidebar (filter panel / dashboard nav)

- **Filter sidebar** (PLP, lg+): 240px fixed width, `--surface` background, sticky positioned below the header, each filter group is an accordion (Section 4.4) collapsed by default except the first two.
- **Dashboard nav** (vendor/admin): 240px fixed width, `--paper`-toned (one step darker than main content `--surface`) for visual separation, nav items 44px height, active item shows a `--brand` left-border (3px) + `--brand-subtle` background + `--brand` text/icon.

#### Footer

Four-to-five column layout (lg+, collapsing to accordion-per-section on mobile): company/about, customer service links, vendor/seller links ("Sell on [platform]"), legal links, newsletter signup (Section 4.6). Bottom bar: copyright + payment method icons + social icons, `--line` top border separating it from the column content above.

#### Breadcrumbs

`--text-body-sm`, `--ink-muted`, `/` separator (not `>`, per the restrained-typography principle — a plain slash reads quieter). Current page (last item) is `--ink`, not a link. Truncates middle segments to "…" on mobile if the full path exceeds ~40 characters, keeping first and last two segments visible.

#### Tabs

Underline style: `--text-label` weight 500, `--ink-muted` inactive / `--ink` active, active tab gets a 2px `--brand` underline that slides (`--motion-base`) between tabs rather than appearing/disappearing abruptly. Used for PDP (Description/Specs/Reviews) and account sections.

#### Pagination

Numbered page buttons (32×32px, `--radius-sm`, ghost variant, active page filled `--brand`) + prev/next chevron buttons. Collapses to "Page X of Y" with just prev/next arrows below `md`. Used for dashboard tables and any listing where infinite scroll (Section 2.5) isn't the pattern (e.g. admin/vendor order tables — dashboards use pagination, not infinite scroll, matching the density principle).

### 4.4 Feedback & Overlays

#### Alert (inline banner)

Full-width within its container, `--radius-md`, `--space-4` padding, left-aligned icon (20px) + message, color per severity using the `-subtle` background + full-tone text/icon/border-left (3px) tokens from Section 1.1 (info uses `--brand-subtle`/`--brand`).

#### Toast / Snackbar

Fixed position bottom-center (mobile) / bottom-right (desktop), `--surface-raised`, `--elevation-3`, `--radius-md`, max-width 360px, icon + message + optional single action link + dismiss ×. Stacks vertically with `--space-2` gap if multiple are triggered in quick succession, max 3 visible at once (older ones auto-dismiss early if a 4th arrives). Animation per Section 2.3.4.

#### Dialog / Modal

Centered, `--surface-raised`, `--elevation-3`, `--radius-lg`, max-width 480px (confirmation dialogs) or 640px (forms like address add/edit). Header (`--text-h2` + close × at top-right) → `--space-6` padding body → footer with right-aligned action buttons (secondary then primary, in that left-to-right order — cancel is always visually secondary and to the left of the confirming action). Backdrop click and Escape both close it unless it's a destructive-confirmation dialog specifically requiring explicit button choice (no backdrop-dismiss on "Delete this product?").

#### Drawer

Full-height, slides from an edge (Section 2.3.3). Cart drawer: 400px wide (desktop) / full-width (mobile), from the right. Mobile filter drawer: full-width, from the bottom, capped at 85vh with a drag handle (4px pill, `--line`) at the top for swipe-to-dismiss.

#### Bottom Sheet

Mobile-specific pattern, same visual treatment as Drawer-from-bottom; used for: filter panel (mobile), sort options, quick actions on a long-press/menu trigger.

#### Tooltip

`--ink` background, white text, `--text-body-sm`, `--radius-sm`, `--space-2` padding, small triangle pointer toward the trigger. Appears on hover after a 400ms delay (prevents flicker on incidental mouse movement) or immediately on keyboard focus. Never contains interactive content (that's a Popover's job).

#### Popover

Same positioning/elevation logic as Dropdown (4.1), but contains richer content (e.g. a mini cart preview, a "share" panel with multiple icon buttons) rather than a simple option list.

#### Loader / Skeleton / Progress

Covered in Section 2.4 — this entry exists only to confirm placement: skeletons match the exact grid/card dimensions of the content they're replacing (see Product Card spacing above — a product-grid skeleton uses the identical card dimensions, image aspect ratio, and text-line placeholders).

### 4.5 State Patterns

#### Empty State

Centered within its container: illustration (Section 1.8, ~120px) → `--space-4` → heading (`--text-h3`) → `--space-2` → supporting text (`--text-body`, `--ink-muted`, max 2 lines) → `--space-6` → a single primary action button ("Browse products," "Start shopping"). Never just an illustration with no path forward.

#### Error State

Same layout as Empty State but illustration/icon uses `--danger` tones, heading states what went wrong in plain language ("Something went wrong loading this page" — never a raw error code as the heading), action button offers retry or a safe fallback ("Go to homepage").

#### Success State

Used for full-page confirmations (order success) — see Section 5.10 for the specific, richer treatment; inline success (e.g. "Address saved") uses the Toast/Alert pattern instead of a dedicated full state.

### 4.6 Commerce-Specific Components

#### Wishlist Button

32px circular ghost button, heart icon (20px), positioned top-right of product images (card and PDP). Animation per Section 2.3.8.

#### Compare Button

Checkbox-style toggle on product cards (opt-in via a "Compare" mode toggled from the PLP toolbar) — when active, a persistent bottom bar shows selected items (max 4) with a "Compare now" primary button, `--surface-raised` bar at `--elevation-3`, slides up from the bottom when the first item is selected.

#### Share Button

Ghost icon button (share icon, 20px) opening a Popover with platform icons (copy link as the first, most-used option, then social icons) — never a native OS share sheet override on desktop; on mobile, triggers the native share sheet directly instead of the popover.

#### Filters Panel

Section 4.3's Sidebar entry covers layout; each filter group is an Accordion (Tabs section pattern reused: header row with label + chevron, `--motion-base` expand). Filter types: checkbox list (category, vendor), range slider (price — dual-handle, `--brand` filled track between handles), star-rating selector (radio-style, "4 stars & up").

#### Sort Control

Dropdown (4.1 pattern), positioned top-right of the product grid, options: Relevance (default for search), Newest, Price Low-High, Price High-Low, Rating.

#### Faceted Search Result Summary

A `--text-body-sm` `--ink-muted` line above the grid: "128 results for 'wireless mouse'" — updates instantly (no loading flicker) using the `placeholderData` pattern from the frontend doc so the number doesn't blank out between filter changes.

#### Carousel

Used only for: homepage hero (Section 5.1), PDP image gallery (not a true carousel, see 4.2's crossfade pattern instead), "related products" horizontal scroll. Navigation via visible prev/next arrow buttons (36px circular, `--surface-raised`, `--elevation-2`, appear on container hover for desktop / always visible on mobile) plus native touch-swipe on mobile. Dot indicators only for the hero carousel (≤5 slides); horizontal product-scroll carousels don't use dots (too many items to represent that way) — a subtle edge-fade gradient hints at more content instead.

#### Banner (promotional)

Full-width strip, `--brand` or `--accent` background per campaign, white text, dismissible (× on the right) with the dismissal persisted (localStorage-equivalent) so it doesn't reappear every page load in the same session.

### 4.7 Utility & Floating Elements

#### Sticky Elements

- PDP: on mobile, the Add-to-Cart button becomes a sticky bottom bar once the user scrolls past the initial purchase panel (thumb-reach principle, Section 3.3).
- PLP filter sidebar: sticky below the header at lg+ (scrolls independently once its content exceeds viewport height).

#### Floating Action Button (FAB)

Reserved for exactly one use in this system: a "Back to top" scroll-to-top button (see below) — this product does not use FABs for primary actions (those live in-flow or in the sticky bottom bar), avoiding FAB overuse/ambiguity.

#### Scroll-to-Top Button

56px circular, `--surface-raised`, `--elevation-2`, up-chevron icon, appears (`--motion-base` fade+scale in) once the user has scrolled past 1.5 viewport heights, fixed bottom-right with `--space-6` inset from the viewport edge, `--space-4` above any sticky bottom bar if one is present simultaneously.

#### Cookie Banner

Bottom-fixed full-width strip (not a modal — doesn't block interaction), `--surface-raised`, `--elevation-3`, brief message + "Accept" (primary, small) + "Manage preferences" (link-style) — appears once per session until a choice is made, slides up `--motion-moderate` on first load after a 500ms delay (let the page paint first).

#### Newsletter Section

Footer-embedded (4.3) — single email input + submit button inline (not stacked) at md+, stacked at xs/sm, brief one-line value prop above the input, no illustration (this is a low-emphasis, secondary conversion point, doesn't compete visually with primary CTAs elsewhere on the page).

#### Chat Widget Placement

Bottom-right, 56px circular trigger matching the Scroll-to-Top button's size/elevation treatment but positioned so the two never overlap — chat widget sits at `--space-6` from the corner, scroll-to-top stacks `--space-4` above it when both are visible simultaneously (chat widget takes visual priority in the corner position since it's the more persistent element).

---

## 5. Page Specifications

Each page spec lists section order, layout at lg+ vs. below lg (per Section 3's breakpoint table), and key interactions. Components referenced by name from Section 4.

### 5.1 Home

**Order:** Hero (full-bleed, 16:9 desktop/4:5 mobile per 1.9, headline in `--text-display-lg`, single primary CTA, page-load reveal per 2.3.1) → Category rail (horizontal scroll of Category Cards, 4.2) → "Trending now" Product Card grid (Section 4.2, 4 cols lg+/2 cols mobile) → Vendor spotlight (3–4 cards, `--surface` panels with vendor banner+logo+rating+CTA) → Recently viewed (Product Card row, renders only if non-empty — no empty-state placeholder here) → Newsletter (4.7).

**Responsive:** hero crop swaps per 3.4; category rail is a horizontal-scroll carousel below `lg`, a static row above it if it fits without scrolling; section vertical rhythm uses `--space-20` (desktop) / `--space-12` (mobile) between major blocks.

### 5.2 Product Listing (PLP) / Category / Brand / Collection

Same template serves category pages, brand pages, and curated collections — only the header content and the pre-applied filter differ.

**Layout (lg+):** Breadcrumbs → Page heading (`--text-h1`, category/brand/collection name + result count) → two-column: Filter Sidebar (4.3, 240px) + main column (Sort control top-right, Product Card grid 4 cols, Pagination or infinite-scroll per 2.5).

**Layout (below lg):** Breadcrumbs → heading → sticky filter/sort toolbar (two buttons: "Filters" opens bottom sheet, "Sort" opens bottom sheet) → 2-col grid → infinite scroll.

**Empty state:** "No products match these filters" (4.5 pattern) + explicit "Clear all filters" primary action.

### 5.3 Product Details (PDP)

**Layout (lg+):** Breadcrumbs → asymmetric 7/5 split: left = image gallery (main image 1:1 + thumbnail rail below), right = sticky purchase panel (vendor strip → product name `--text-display-sm` → rating row → price display → variant selector (attribute groups, unavailable combinations shown disabled per the frontend doc's Section 7.4) → quantity selector → Add to Cart (primary, full-width within panel) + Wishlist button → delivery estimate line (icon + text) → return policy line). Below the split, full-width: Tabs (Description / Specifications / Reviews) → Related products carousel.

**Layout (below lg):** gallery full-width above, purchase panel follows in normal flow (not sticky-side, since there's no side column) — Add to Cart becomes the sticky bottom bar (4.7) once scrolled past.

**Key interaction:** gallery crossfade (2.3.9), variant selection updates price/stock without page reload, out-of-stock variant options render visibly disabled not hidden (per the frontend doc's explicit rule, restated here as a UI requirement).

### 5.4 Search Results

Identical template to PLP (5.2) with the page heading replaced by 'Results for "{query}"' and an autocomplete-driven entry point (4.1). Zero-results state includes a "Did you mean" suggestion line above the standard Empty State pattern if a close match exists.

### 5.5 Categories / Brands / Collections (index pages, not filtered listings)

A single grid of Category Cards (4.2), 4:3 tiles, 3 cols mobile → 4 cols lg → 6 cols 2xl, no sidebar, no filters — this is the browsing entry point that leads into 5.2.

### 5.6 Wishlist

Product Card grid (4.2) with "Move to cart" replacing "Quick add," and a price-drop badge (small `--success`-toned pill: "Price dropped") shown if current price is below the price at the time it was wishlisted. Empty state (4.5): "Your wishlist is empty" + "Browse products" CTA.

### 5.7 Cart

**Drawer (default entry, 4.4):** grouped by vendor (VendorItemGroup: vendor strip header → line items → vendor subtotal), coupon input row, order summary (subtotal/shipping-estimate/total), full-width primary "Checkout" button.

**Full cart page** (reached via "View full cart" link in the drawer, or directly navigated to): same content, wider layout — line items in a left column (each row: 80px thumbnail, name+vendor+variant, quantity selector, price, remove ×) + sticky order-summary card in a right column (lg+) / below the list (mobile).

Empty state (4.5): "Your cart is empty" + "Continue shopping" CTA.

### 5.8 Checkout (Multi-Step)

**Step indicator:** horizontal stepper at the top (4 steps: Address / Shipping / Payment / Review), current step `--brand`-filled circle, completed steps show a checkmark, upcoming steps `--line`-toned — collapses to "Step X of 4" text-only on mobile (no room for a full horizontal stepper below `md`).

**Layout (lg+):** two-column — left column is the active step's form content, right column is a persistent order-summary card (per-vendor breakdown per the frontend doc's Section 8.5, sticky-positioned).

**Layout (below lg):** single column, one step per screen (per 3.1's rule), order summary collapses into an expandable "Order summary" accordion above the step content rather than a persistent column.

- **Address step:** radio-card list of saved addresses (each a bordered card, selected state = `--brand` border + subtle fill) + "Add new address" ghost button opening a Dialog (4.4) with the address form.
- **Shipping step:** one card per vendor (per frontend doc 8.4) with a radio group of shipping methods (Standard/Express), price + estimated days shown per option.
- **Payment step:** radio-card selection between Razorpay/Wallet/COD (if available), wallet option shows current balance inline, Razorpay option embeds the checkout script per the frontend doc.
- **Review step:** full per-vendor breakdown (line items, subtotal, shipping, tax, discount, vendor total) stacked as cards, grand total emphasized at the bottom, single full-width primary "Place Order" button.

### 5.9 Payment

Not a separate page in this flow — payment method selection lives inside Checkout Step 3 (5.8) and the actual charge happens via the Razorpay overlay/redirect, which is provider-controlled UI outside this spec's scope. This page entry exists to confirm there's no separate "Payment" route beyond the checkout step and any provider redirect-back landing (which routes straight to Order Success on success, or back to Step 3 with an inline Alert on failure).

### 5.10 Order Success

Centered, celebratory-but-restrained layout: a single success checkmark animation (the one explicit exception to "no celebration effects" in 2.3 — a simple `--success`-colored circle-draw + checkmark, ≤600ms, not confetti) → "Order confirmed" heading → order number (mono token) → per-vendor summary cards (reused from 5.8's review step, read-only) → estimated delivery per vendor → explicit "what happens next" copy line (per the frontend doc's note about multi-vendor shipment expectations) → two actions: "View order" (primary) and "Continue shopping" (secondary).

### 5.11 Orders (List) & Order Detail

**List:** Table-like list (not a grid — orders are scannable rows, not visual products) — each row: order number (mono) + date + total + status badge (4.2) + thumbnail preview of up to 3 items. Pagination (4.3), not infinite scroll (matches dashboard-density convention even though this is a customer-facing page, since it's a data list).

**Detail:** grouped by SubOrder (per the frontend doc) — each vendor's portion is its own card: vendor strip → status badge → Timeline component (4.2) if shipped → line items → conditional actions ("Write a review" / "Request return," shown per-item only when eligible).

### 5.12 Returns

**Request form** (reached from Order Detail): Dialog or dedicated page (Dialog on desktop, full page on mobile per the general "complex forms get their own screen on mobile" rule) — reason-code Select (4.1), free-text Textarea, optional photo upload (drag-drop zone + thumbnail previews with remove ×).

**Status view:** Timeline component (4.2) with the return-specific step set (Requested → Approved → Pickup Scheduled → Received → Refunded), same visual pattern as shipment tracking.

### 5.13 Profile, Addresses, Saved Payments, Notifications, Reviews, Settings

All share one **Account layout template**: left-nav (Sidebar pattern, but lighter-weight than the dashboard nav — no `--paper`-toned background shift, just `--line` dividers between nav items) at lg+, collapsing to a horizontal scrollable Tabs row below lg. Content area per sub-page:

- **Profile:** avatar (96px, editable via a hover-overlay camera icon) + form fields (name, email, phone) in a single-column form, `max-width: 480px`.
- **Addresses:** card grid of saved addresses (2 cols lg+), each with Edit/Delete ghost buttons and a "Default" badge on the primary one; "Add address" as a dashed-border placeholder card matching the others' dimensions.
- **Saved Payments:** list of saved payment method cards (masked card number, brand icon) — only if the payment provider supports tokenized saved methods; otherwise this section is omitted rather than shown empty.
- **Notifications:** two-column preference list (notification type label + Toggle per channel: Email/SMS) — matches the backend's notification trigger matrix categories.
- **Reviews:** list of the user's own submitted reviews (Review component, 4.2, with an Edit action since these are self-authored).
- **Settings:** account-level toggles (dark mode, marketing consent) + destructive zone at the bottom (Delete account) visually separated by a `--danger`-toned bordered section, requiring the Dialog confirmation pattern (4.4) before proceeding.

### 5.14 Authentication (Login, Register, Forgot Password, OTP, Reset Password)

Centered card (`max-width: 400px`), `--surface` panel, `--elevation-1`, on a plain `--paper` background (no marketing imagery competing with the form — auth screens are utilitarian by design). Logo above the card. Form per Section 4.1's Input spec. Social OAuth buttons (Google/Facebook) as full-width Secondary-variant buttons with the provider's icon, positioned below a "or" divider beneath the email/password fields.

- **OTP entry:** 6 individual single-digit input boxes (44×44px each, auto-advance focus on entry, paste-to-fill supported), countdown timer + "Resend code" link (disabled until countdown reaches 0).
- **Forgot/Reset Password:** single-field-at-a-time flow matching the mobile-first "one step per screen" principle even on desktop, since this is inherently a linear, focused task.

### 5.15 Static / Content Pages (About, Contact, FAQ, Privacy, Terms, Blog, Blog Detail)

- **About/Privacy/Terms:** single-column prose layout, `max-width: 65ch` (Section 1.2's line-length rule), `--text-h2` section headings with anchor-linkable IDs, a sticky in-page table-of-contents sidebar at lg+ for long legal documents specifically (Privacy/Terms).
- **Contact:** two-column (lg+) — contact form (left) + contact details/map or store-hours info (right); single column stacked on mobile.
- **FAQ:** Accordion list (4.3 pattern), optionally grouped under category Tabs if the FAQ set is large (>15 items).
- **Blog (index):** card grid (16:9 cover image per 1.9, title, excerpt, date, 3 cols lg+/1 col mobile).
- **Blog Detail:** single-column prose (`max-width: 65ch`) matching the legal-page treatment, cover image full-width above the title, author/date metadata row below the title.

### 5.16 System Pages (404, Maintenance, Server Error)

Centered, full-viewport-height layout: illustration (1.8, larger than the empty-state size — ~200px, this is the one context illustration is the visual lead rather than a supporting element) → heading (`--text-display-sm`) → one-line explanation → single primary action ("Go to homepage" for 404/500, no action needed for Maintenance beyond an estimated-return-time line if known). No header/footer chrome on Maintenance/500 specifically (nothing to navigate to); 404 keeps the standard header so users can still search/navigate away.

---

## 6. Accessibility Specification (WCAG 2.2 AA)

### 6.1 Keyboard Navigation

Every interactive element reachable via `Tab`, in visual DOM order (no positive `tabindex` values anywhere — if focus order needs to differ from visual order, the DOM order is restructured instead). `Escape` closes any open Dialog/Drawer/Popover/Dropdown and returns focus to the trigger element that opened it. Arrow keys navigate within composite widgets (Tabs, Radio groups, the OTP input boxes in 5.14) per standard ARIA authoring patterns.

### 6.2 Focus Visibility

The `--motion-instant` focus-visible outline from Section 2.2 is never suppressed (`outline: none` without a replacement is a spec violation anywhere in this system) and never relies on color alone — the 2px outline's shape/offset is itself the indicator, so it remains visible in high-contrast mode regardless of color rendering.

### 6.3 Screen Reader Support & Semantic HTML

- Landmark regions used correctly: one `<header>`, one `<nav>` per distinct navigation area (primary nav vs. breadcrumbs get distinguishing `aria-label`s), one `<main>`, one `<footer>`.
- Product cards are `<article>` elements with an accessible name derived from the product title (not a generic "product card" label).
- Price changes on variant selection (5.3) are announced via an `aria-live="polite"` region wrapping the price display, so a screen reader user hears the update without needing to re-navigate to it.
- Toasts (4.4) use `role="status"` (informational) or `role="alert"` (errors) so they're announced without stealing focus.
- Icon-only buttons (wishlist heart, close ×, scroll-to-top) always carry an `aria-label` describing the action, never relying on the icon alone.

### 6.4 ARIA Usage

ARIA is used to fill genuine gaps in native semantics (custom Select/Dropdown get `role="listbox"`/`role="option"`, the Accordion gets `aria-expanded` on its trigger), never as a substitute for a native element that would work directly — a real `<button>` is always used instead of a `<div role="button">` unless there's a specific reason a native element can't be styled to fit.

### 6.5 Color Contrast

All token pairs in Section 1.1 are pre-verified to WCAG AA (4.5:1 body text, 3:1 large text/UI components) in both light and dark mode. Any new color introduced during implementation must be checked against its actual background before use — this is a gate, not a suggestion, since a component built with a non-compliant color combination fails this spec regardless of how it looks.

### 6.6 Accessible Forms & Error Messaging

Every input has a visible, persistent `<label>` (Section 4.1 — no placeholder-only labels). Error messages are programmatically associated via `aria-describedby`, announced via `role="alert"` on the message itself (not just visually red text), and error messages describe _what to do_, not just what's wrong ("Enter a valid email address," not "Invalid input").

### 6.7 Reduced Motion Support

`prefers-reduced-motion: reduce` collapses every animation duration in Section 2.1 to `0ms` globally — this is implemented once, at the token/CSS level, not opted into per component (per 2.1's rule, restated here as an accessibility requirement rather than just a motion-system detail).

### 6.8 Touch Accessibility

44×44px minimum touch targets (3.3) apply universally, including within dense contexts like dashboard tables — a table row's edit/delete icon buttons still get their tap area expanded via padding even though the visual icon is smaller, matching Section 3.3's stated approach.

---

## 7. UX Guidelines

### 7.1 Visual Hierarchy & Information Architecture

Every screen has exactly one primary action (Section 4.1's Button rule) — if a screen seems to need two equally-weighted CTAs, that's a signal the screen is trying to do two jobs and should be split, not a signal to add a second primary button.

### 7.2 Conversion Optimization & Trust Signals

- Trust signals (vendor identity, rating, delivery estimate, return policy) appear at the point of decision, not buried in a separate policy page — the PDP purchase panel (5.3) surfaces delivery estimate and return policy directly, not just a link to read them elsewhere.
- Price transparency: no hidden fees revealed only at the final checkout step — shipping estimates appear as early as the cart (5.7), refined (not newly introduced) at checkout.
- Social proof (rating + review count) is visible on every product touchpoint (card, PDP) per the vendor-identity-strip principle in Section 0 — trust signals repeat everywhere, they're not a one-time PDP-only detail.

### 7.3 Product Discoverability & Search Experience

Search is never more than one interaction away (persistent header search bar at md+, one tap from the mobile nav below md). Autocomplete (4.1) surfaces visual results (thumbnails), not just text matches, since recognition is faster than reading for return shoppers who know what they're looking for.

### 7.4 Filtering

Filters apply progressively (each selection immediately narrows results, per the frontend doc's `placeholderData` pattern preventing flash-to-empty) rather than requiring an "Apply" button — the one exception is the mobile filter bottom sheet (5.2), which does use an explicit "Show N results" apply button, since committing to a filter set before dismissing the sheet avoids a jarring background-grid update the user can't see happening behind the sheet.

### 7.5 Checkout Flow

The stepped checkout (5.8) never lets a user reach a later step with invalid data from an earlier one — validation happens per-step on "Continue," not deferred to a final submit that then bounces the user backward. Guest checkout is never gated behind a forced account-creation prompt (per the frontend doc's guest-checkout flow) — account creation is offered as a convenience after order confirmation, not a precondition.

### 7.6 Error Prevention & Confirmation Dialogs

Destructive actions (delete address, cancel order, remove product) always confirm via Dialog (4.4) before executing — but non-destructive, easily-reversible actions (remove item from wishlist, remove item from cart) do NOT get a confirmation dialog, instead offering an "Undo" action in the resulting Toast. This distinction matters: over-confirming reversible actions trains users to reflexively click through dialogs, which defeats the purpose for the genuinely destructive ones.

### 7.7 Progressive Disclosure

Complex forms (product creation in the vendor dashboard, the admin coupon builder) are broken into steps/sections rather than one long scroll, per the frontend doc's multi-step/multi-section form patterns — a form reveals its next layer of decisions only once the current layer is resolved (e.g. coupon type selection determines which value-configuration fields appear next, per the frontend doc's Section 11.3).

### 7.8 User Feedback

Every user-initiated action that takes >300ms gets a loading indicator (Section 2.4) appropriate to its scale (inline spinner for a button action, skeleton for a page/section load) — nothing is allowed to leave the user looking at a static screen wondering if their click registered.

### 7.9 Performance Perception

Perceived performance is treated as a UX requirement, not just an engineering metric — skeleton screens matching real content dimensions (2.4), optimistic UI updates where safe (e.g. a wishlist toggle updates its icon instantly, before the server confirms, since the failure case is rare and easily reversed), and the `placeholderData` filter pattern (7.4) all exist specifically to make the product _feel_ fast even when a network round-trip is happening underneath.

---

## 8. Design Consistency & Naming Conventions Rulebook

These are hard rules — a component or page that violates one of these is not a valid implementation of this spec, regardless of how it looks in isolation.

| Rule area               | Rule                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Component reuse**     | Before building a new component, check Section 4 for an existing one that fits. A "vendor card" on the homepage and a "vendor card" in search results are the same component with different data, never two separately-built components.                                                                                                                      |
| **Naming convention**   | Component names in code match this document's section names exactly (`ProductCard`, `VendorStrip`, `ReturnRequestForm`) — no renaming during implementation that would make this document harder to cross-reference against the codebase.                                                                                                                     |
| **Spacing**             | Only the tokens in Section 1.3 are used. A value like `18px` or `10px` appearing anywhere in the implementation is a spec violation — round to the nearest defined token and flag the discrepancy rather than introducing a new one silently.                                                                                                                 |
| **Alignment**           | Text and interactive elements within a component align to a consistent baseline/edge — e.g. every Product Card's price sits at the same vertical offset from the card's bottom edge across an entire grid, regardless of whether that card's title wrapped to one or two lines (achieved via consistent flex/grid structure, not manual per-card adjustment). |
| **Padding/margin**      | Padding is always defined on the component itself (internal spacing); margin/gap between components is always defined by the parent layout (grid `gap`, flex `gap`) — never both a component's own margin AND a parent's gap contributing to the same visual space, which causes inconsistent spacing that's hard to trace.                                   |
| **Border radius**       | Only the four values in Section 1.6, with the single documented exception (header search bar pill, 4.1). Any other pill-shaped element is a spec deviation.                                                                                                                                                                                                   |
| **Shadows**             | Only the five elevation steps in Section 1.5. No component defines a one-off custom shadow value.                                                                                                                                                                                                                                                             |
| **Colors**              | Only semantic tokens (Section 1.1), never raw hex values in component implementation — this is what makes dark mode automatic (1.10) and is non-negotiable.                                                                                                                                                                                                   |
| **Icons**               | Lucide only (1.7). No SVG icons from any other source, no emoji-as-icon anywhere in the product UI.                                                                                                                                                                                                                                                           |
| **Typography**          | Only the tokens in Section 1.2. No inline `font-size`/`font-weight` overrides outside the defined scale.                                                                                                                                                                                                                                                      |
| **Responsive behavior** | A component's responsive behavior is defined once in this document (Section 4/5) and applied identically everywhere it's used — a Product Card behaves the same way on the Home page, PLP, Search, and Wishlist; it does not get a page-specific responsive variant.                                                                                          |
| **Animation**           | Only the ten named patterns in Section 2.3. If an implementation needs an animation not on that list, that's a signal to update this document first, not to add an eleventh pattern ad hoc during coding.                                                                                                                                                     |

---

## 9. Performance Guidelines (UI-Level)

- **Image optimization:** every image uses responsive `srcset`/`sizes` (3.4), lazy-loads via native `loading="lazy"` except above-the-fold hero/first-row PLP images (which load eagerly since they're immediately visible), and is served in a modern format (AVIF/WebP with fallback) through the CDN layer specified in the frontend implementation doc.
- **Avoiding layout shift (CLS):** every image container reserves its aspect ratio before load (1.9), skeleton screens match real content dimensions exactly (2.4), and no content is ever inserted above existing content after initial paint (e.g. a promotional banner never pushes the header/nav down after the page has already rendered — it either reserves its space upfront or appears below the fold).
- **Font loading strategy:** `font-display: swap` for all three type families (1.2), with a matched fallback font stack (system sans for Inter, a generic serif for Fraunces) sized to minimize reflow when the web font swaps in; Fraunces (used sparingly, per 1.2) is subset to only the weights/characters actually used to keep its load cost proportional to its limited usage.
- **Code splitting:** route-level splitting per the frontend implementation doc's Section 12 — this document's dashboard-density components (Section 4.3's dashboard nav, data tables) are never part of a customer-facing bundle.
- **Virtual scrolling:** applied to any list realistically exceeding ~200 rendered rows at once — specifically dashboard order/product tables at high volume; standard PLP grids use pagination/infinite-scroll (2.5) instead, since 20–40 product cards per page doesn't warrant virtualization's added complexity.
- **Smooth scrolling & high-FPS animation:** all Section 2.3 animations use `transform`/`opacity` exclusively (GPU-accelerated properties), never animating `width`/`height`/`top`/`left` directly — the one stated exception is the Accordion's `grid-template-rows` technique (4.3), which is itself chosen specifically because it avoids the `max-height` anti-pattern's jank.

---

## 10. Appendix: Full Token Reference

This is a consolidated index — every value below is fully specified with its usage context in the section indicated. Use this table to locate a token quickly; treat the linked section as the authoritative definition, not this summary row.

| Token category   | Defined in  | Example tokens                                                                                                   |
| ---------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| Color            | Section 1.1 | `--brand`, `--ink`, `--paper`, `--surface`, `--danger`, `--success`, `--warning` (+ `-subtle`/`-hover` variants) |
| Typography       | Section 1.2 | `--text-display-lg` → `--text-mono`                                                                              |
| Spacing          | Section 1.3 | `--space-0` → `--space-20`                                                                                       |
| Breakpoints      | Section 1.4 | `--bp-xs` → `--bp-3xl`                                                                                           |
| Elevation        | Section 1.5 | `--elevation-0` → `--elevation-4`                                                                                |
| Radius           | Section 1.6 | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`                                                     |
| Motion timing    | Section 2.1 | `--motion-instant` → `--motion-slow`                                                                             |
| Named animations | Section 2.3 | 10 patterns, e.g. hero reveal, drawer slide, add-to-cart pulse                                                   |

**Implementation note:** this document assumes the Next.js/React frontend already specified in the project's frontend implementation doc — this spec defines the _design layer_ (tokens, components, pages, motion, accessibility, UX rules) that sits on top of that architecture. Where the two documents describe the same page (e.g. Checkout, PDP), this document is authoritative for visual/interaction detail and the frontend doc is authoritative for data flow, state management, and API integration — they are not in conflict, they cover different layers of the same screens.
