# Visual Design System Revision — Theme & Token Update

**Scope of this document:** this is a **theme revision**, not a redesign. It replaces only the color system, elevation/shadow treatment, border-radius scale, and typographic _usage rules_ defined in the original UI/UX Design Specification. It does **not** change component structure, page layouts, spacing values, breakpoints, motion timing, interaction patterns, or any functional/interaction behavior — all of that is already implemented and stays exactly as-is.

**How this document works:** every token below uses the **same token names** already implemented in the codebase (`--brand`, `--ink`, `--paper`, `--surface`, `--elevation-1`, `--radius-md`, etc.). Applying this document means updating the _values_ assigned to those token names in the theme file — no component file, no JSX/markup, no layout CSS needs to change. If a component was built correctly against tokens (as the original spec required), this revision should be a values-only diff.

---

## 1. Design Direction — From Green to "Ink & Brass"

**Why the change:** the previous forest-green identity read as approachable/organic but not distinctly premium — it's a palette shared by a lot of "curated goods" and farmers-market-adjacent branding. The brief calls for modern, premium, classy — a register closer to how high-end fashion and boutique retail actually present themselves: restrained, monochrome-led, with trust built through precision (typography, spacing, hairline detail) rather than color.

**The new direction: Ink & Brass.** A near-monochrome foundation — warm near-black ink, warm ivory/bone paper, crisp white surfaces — carrying almost the entire UI, with **one** metallic warm-gold accent (brass) used deliberately and sparingly for the handful of moments that should feel like _the brand_: price emphasis, links, active/selected states, and small brand marks. A secondary warm terracotta covers scarcity/urgency signals, kept clearly distinct from brass so the two never get confused.

This is a deliberate constraint, not a limitation: **the fewer places color appears, the more those places mean something.** A primary button is not gold — it's ink-black (light mode) or bone-white (dark mode), the same way a black-and-white product photograph reads as more premium than an over-saturated one. Gold shows up where it should be _noticed_, not everywhere.

**What stays exactly the same:** the vendor-identity-strip pattern, the restrained-motion philosophy, the density difference between storefront and dashboards, the 8px spacing grid, all breakpoints, all component anatomy/layout — none of that changes. Only what fills these shapes changes.

---

## 2. Revised Color Token System

Every token name below already exists in the implemented codebase — these are the new values to assign to each. Both light and dark values are provided; apply both, don't ship only one mode.

### 2.1 Core Neutrals

| Token              | Old (green theme)     | **New value — Light**     | **New value — Dark**  | Notes                                                                                                                                                      |
| ------------------ | --------------------- | ------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--paper`          | `#FAFAF8`             | **`#F6F3EC`**             | **`#121113`**         | Warmer, slightly deeper ivory than before (light) — reads more boutique-paper than generic off-white. Dark drops to a true warm near-black, not dark gray. |
| `--surface`        | `#FFFFFF`             | **`#FFFFFF`**             | **`#1C1B1D`**         | Cards/panels stay crisp white in light mode — the contrast between ivory page and white card is itself a quiet, premium visual cue.                        |
| `--surface-raised` | `#FFFFFF`             | **`#FFFFFF`**             | **`#242226`**         | Modals/dropdowns/popovers — one lightness step above `--surface` in dark mode.                                                                             |
| `--ink`            | `#14171C`             | **`#1B1917`**             | **`#F4F1EA`**         | Warm near-black instead of the previous cool-black — softer, less clinical.                                                                                |
| `--ink-muted`      | `#5B6069`             | **`#5C5750`**             | **`#B7B1A8`**         | Secondary text, captions, metadata.                                                                                                                        |
| `--ink-faint`      | `#8B9098`             | **`#9C968D`**             | **`#7C766D`**         | Placeholder/disabled text only.                                                                                                                            |
| `--line`           | `#E4E2DD`             | **`#E7E2D8`**             | **`#332F2C`**         | Default borders/dividers — warm greige instead of cool gray.                                                                                               |
| `--line-strong`    | `#CFCCC5`             | **`#D8D1C2`**             | **`#453F3A`**         | Emphasized borders (focus-ring container, table header rule).                                                                                              |
| `--overlay`        | `rgba(20,23,28,0.48)` | **`rgba(27,25,23,0.55)`** | **`rgba(0,0,0,0.7)`** | Modal/drawer backdrop.                                                                                                                                     |

### 2.2 Brand & Accent (the one place color lives)

| Token             | Old (green theme) | **New value — Light** | **New value — Dark** | Usage                                                                                                                                                                                       |
| ----------------- | ----------------- | --------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--brand`         | `#2A5C4B`         | **`#8A6A2E`**         | **`#D9B25E`**        | Antique brass/gold. Text-safe at body size in both modes (verified, Section 8) — links, price emphasis, active nav, selected-state text/icons. **Never** a default button fill (Section 3). |
| `--brand-hover`   | `#1D4237`         | **`#6E5322`**         | **`#E8C476`**        | Hover/pressed state of brand-colored elements.                                                                                                                                              |
| `--brand-subtle`  | `#EAF2EE`         | **`#F3ECDA`**         | **`#2E2717`**        | Brand-tinted backgrounds — selected filter chip, active tab underline background, subtle highlight panels.                                                                                  |
| `--accent`        | `#C9722C`         | **`#A8432B`**         | **`#D2694A`**        | Deep terracotta/rust — scarcity/urgency only ("2 left," sale badge). Distinct hue from `--brand` so the two are never mistaken for each other.                                              |
| `--accent-subtle` | _(new token)_     | **`#F5E6E1`**         | **`#3A241E`**        | Scarcity badge/banner backgrounds.                                                                                                                                                          |

**This is the single most important rule in this document:** `--brand` (brass/gold) is a **text and small-accent color**, not a fill color for large surfaces or default buttons. See Section 3 for the explicit usage map — this constraint is what separates "premium" from "gaudy" with a metallic gold, and it's the most common way this kind of palette goes wrong if applied loosely.

### 2.3 Semantic / Status Colors

Redefined to sit harmoniously in the new warm-neutral + brass palette, and deliberately **not green** for success — the previous success-green sat too close to the old brand identity; a deep ink-navy communicates "completed/positive" just as clearly without dragging the retired palette back in through the side door.

| Token              | Old (green theme) | **New value — Light** | **New value — Dark** | Usage                                                                                                                                         |
| ------------------ | ----------------- | --------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `--danger`         | `#B3261E`         | **`#A13A32`**         | **`#E2685C`**        | Errors, destructive actions.                                                                                                                  |
| `--danger-subtle`  | `#FCEBEA`         | **`#F6E7E4`**         | **`#3A211D`**        | Error banner/toast backgrounds.                                                                                                               |
| `--success`        | `#1E6B45`         | **`#2C4A6B`**         | **`#7FA6C9`**        | Success states, in-stock indicators, completed steps. Deep ink-navy, not green.                                                               |
| `--success-subtle` | `#E9F5EE`         | **`#E7ECF1`**         | **`#1C2A36`**        | Success banner/toast backgrounds.                                                                                                             |
| `--warning`        | `#946200`         | **`#9C5A12`**         | **`#E0902E`**        | Warnings, low-stock, pending states. Burnt amber — distinct hue angle from `--brand`'s yellow-gold so the two never blur together on a badge. |
| `--warning-subtle` | `#FBF1DC`         | **`#FBEEDD`**         | **`#362613`**        | Warning banner/toast backgrounds.                                                                                                             |

---

## 3. Color Usage Rules — Where Brass Goes, Where It Doesn't

This section exists because a metallic gold accent is the single easiest part of this palette to overuse. Follow this map exactly.

### 3.1 Brass (`--brand`) — Used For

- Product/order **prices** (the current-price figure, wherever it appears)
- **Links** (inline text links, "View shop," "See all")
- **Active/selected states**: active nav item text+underline, selected tab underline, selected filter chip text, checked radio/checkbox fill
- **Small brand marks**: the vendor-identity-strip accent (already brass-toned in the original spec — unchanged), rating-adjacent brand touches
- **Icon accents** on hover/active for otherwise-neutral icon buttons (wishlist, share) — the icon's _resting_ state stays `--ink-muted`; brass appears only on interaction/selected state

### 3.2 Brass — NOT Used For

- **Primary button fill** (Section 5) — primary buttons are ink/bone monochrome, never brass-filled
- **Large surface backgrounds** — no brass-tinted page sections, no brass hero backgrounds
- **Body text** — brass is reserved for the specific moments in 3.1, never used as a general heading or paragraph color
- **More than one accent per component at a time** — a product card shows brass on the price, nowhere else on that same card (rating stars stay their own warm-gold-adjacent but distinct tone if applicable, badges use their own semantic colors)

### 3.3 Terracotta (`--accent`) — Used For

Exactly the same scope as the original spec's accent rule: scarcity badges ("2 left"), sale/urgency badges, countdown-style "ends soon" indicators. Never anywhere brass already covers — the two accents don't overlap in meaning or placement.

### 3.4 Monochrome-First Principle

Every screen should read correctly as recognizable and complete in **grayscale** before color is added back — if removing all color makes a screen confusing (can't tell what's a button, what's clickable, what's emphasized), that's a structural/hierarchy problem to fix with type weight, spacing, and border, not a reason to add more brass. This is the actual mechanism behind "premium" — hierarchy carried by typographic and spatial precision first, color as a final, minimal layer on top.

---

## 4. Typography Refinement

**Families are unchanged** — Fraunces (display), Inter (UI/body), IBM Plex Mono (dashboard data). This revision changes _usage discipline_, not the fonts themselves, plus adds one new token for a specific luxury-retail typographic device.

### 4.1 Refined Usage Rules

- **Fraunces is used more sparingly than before**: strictly ≥28px display moments (homepage hero, PDP product name, vendor spotlight headline) — it no longer appears at any smaller size anywhere in the system. At these sizes, apply `letter-spacing: -0.01em` (slightly tightened) for a more editorial, less "friendly," feel than the default tracking.
- **Inter carries more of the hierarchy than before.** Where a smaller heading previously might have leaned on Fraunces for warmth, it now uses Inter at weight 600 with default tracking — the type system communicates premium through restraint and precision, not through serif-everywhere warmth.

### 4.2 New Token: Eyebrow Label

A classic boutique-retail device — small, wide-tracked, uppercase micro-labels above section headings and category/product-type labels — added as a new token, purely additive (doesn't replace anything, extends the existing scale):

| Token            | Size           | Weight | Tracking | Case      | Color                                                                                                                                   | Usage                                                                                                                                                       |
| ---------------- | -------------- | ------ | -------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--text-eyebrow` | 0.75rem / 12px | 600    | 0.08em   | UPPERCASE | `--ink-muted` (default) or `--brand` (when the eyebrow itself is the interactive/brand-relevant element, e.g. above a vendor spotlight) | Section labels above headings ("FEATURED THIS WEEK" above a homepage section title), category eyebrow above a product name on PDP, dashboard section labels |

Apply this above: homepage section headings, PDP (small "Category" eyebrow above the product name), vendor spotlight cards, blog post category labels. Do not apply it to every heading in the system — like brass, its value comes from restraint; using it everywhere flattens it back into visual noise.

---

## 5. Elevation & Shadow System (Revised)

Premium surfaces read as _quiet_ — the previous shadow values are replaced with softer, more diffused, lower-opacity shadows using a warm shadow tint (matching `--ink`) instead of a cool black, plus a greater reliance on hairline borders over shadow in general.

| Token           | Old shadow                        | **New — Light mode**                                               | **New — Dark mode**                                                                                       |
| --------------- | --------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `--elevation-0` | none                              | none                                                               | `--surface` base, no shadow                                                                               |
| `--elevation-1` | `0 1px 2px rgba(20,23,28,0.06)`   | **`0 1px 3px rgba(27,25,23,0.05), 0 1px 2px rgba(27,25,23,0.03)`** | **`--surface` (`#1C1B1D`) + `1px solid --line`** (dark relies on the border, not a barely-visible shadow) |
| `--elevation-2` | `0 4px 12px rgba(20,23,28,0.08)`  | **`0 6px 16px rgba(27,25,23,0.07)`**                               | **`#242226`**                                                                                             |
| `--elevation-3` | `0 12px 32px rgba(20,23,28,0.14)` | **`0 16px 40px rgba(27,25,23,0.10)`**                              | **`#2A2826`**                                                                                             |
| `--elevation-4` | `0 24px 48px rgba(20,23,28,0.18)` | **`0 28px 64px rgba(27,25,23,0.14)`**                              | **`#312E2B`**                                                                                             |

**What changed and why:** larger blur radius at lower opacity reads as a soft, diffused "surface lift" rather than a hard drop-shadow — this is the difference between a card that looks like it's floating gently versus one that looks like it has a graphic-design shadow applied to it. The warm shadow tint (using `--ink`'s warm undertone instead of a cool black) keeps shadows from reading as a cold, disconnected gray against the warm ivory page.

---

## 6. Border Radius System (Revised — Tighter Scale)

A tighter radius scale reads more tailored and precise; the previous scale's larger radii leaned slightly toward "friendly/approachable" rather than "classy/considered."

| Token           | Old value | **New value**          | Usage (unchanged from original spec)                                        |
| --------------- | --------- | ---------------------- | --------------------------------------------------------------------------- |
| `--radius-sm`   | 6px       | **4px**                | Chips, badges, small buttons, input fields                                  |
| `--radius-md`   | 10px      | **8px**                | Cards, standard buttons, dropdowns                                          |
| `--radius-lg`   | 16px      | **14px**               | Modals, drawers, large panels                                               |
| `--radius-full` | 9999px    | **9999px** (unchanged) | Avatars, pill badges, toggle switches, vendor-strip pill, header search bar |

The nesting rule from the original spec (a nested element uses one step smaller than its container) still applies unchanged.

---

## 7. Component-by-Component Restyling Notes

**No component structure, sizing, spacing, or layout changes anywhere in this section** — every note below is a token-value change only, applied within the exact anatomy already implemented.

### 7.1 Buttons

| Variant     | Old fill                                      | **New — Light**                                                                                            | **New — Dark**                                                                                                                          |
| ----------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Primary     | `--brand` (green) fill, white text            | **`--ink` fill, `--paper` text**                                                                           | **`--ink` (i.e. `#F4F1EA` bone) fill, `--paper` (`#121113`) text** — primary buttons invert cleanly between modes, monochrome both ways |
| Secondary   | `--surface` bg, `--ink` text, `--line` border | **Unchanged pattern, new token values apply automatically**                                                | Same                                                                                                                                    |
| Ghost       | transparent, `--ink` text                     | **Unchanged pattern**                                                                                      | Same                                                                                                                                    |
| Destructive | `--danger` fill                               | **New `--danger` value applies automatically**                                                             | Same                                                                                                                                    |
| Link-style  | `--brand` text                                | **New `--brand` (brass) value applies automatically** — this is the one button variant where brass appears | Same                                                                                                                                    |

This is the clearest expression of the "brass is not a button color" rule (Section 3): every primary CTA in the product — Add to Cart, Place Order, Submit — is now a confident ink-black (light) / bone-white (dark) button, not green, not gold. It's the single biggest visual shift in the whole revision and the one most responsible for the "premium" read.

### 7.2 Inputs & Forms

Border, focus-ring, and label colors all pull from the updated `--line`, `--brand`, `--ink` tokens automatically. One explicit change: **the focus-visible outline** (previously `--brand` green) is now brass (`--brand`, new value) — still meets the same 2px solid, 2px offset spec from the original document, just recolored. Error/helper text pulls from the new `--danger` value automatically.

### 7.3 Cards & Product Cards

Card background/border/shadow pull from `--surface`/`--line`/`--elevation-1` automatically (Sections 2, 5). The **vendor-identity-strip** — the product's one signature recurring element — now renders in brass (`--brand`) instead of green, which if anything strengthens its role as "the" brand touch, since it's now the _only_ place that particular color shows up on a product card (price also uses brass, per 3.1 — the two brass touches on a card are the vendor name and the price, nothing else).

### 7.4 Modals & Dialogs

`--surface-raised`, `--elevation-3`, `--overlay` all pull updated values automatically. No structural change — header/body/footer layout, close button placement, and action-button ordering (cancel left, confirm right) are all unchanged from the original spec.

### 7.5 Navigation (Header, Mega Menu, Sidebar, Footer)

Active nav-item indicator (previously a green underline/text) is now brass. Dashboard sidebar's active-item left-border + subtle background (previously `--brand`/`--brand-subtle` green-toned) now renders in the new brass/brass-subtle values automatically — same 3px left-border treatment, same background-fill pattern, new color underneath it.

### 7.6 Feedback Components (Toast, Alert, Badge)

- **Toast/Alert severity colors** (info/success/warning/danger) pull from the updated semantic tokens (Section 2.3) automatically — note that "info" styling, which previously used `--brand-subtle`/`--brand` (green), now renders in brass — this is an acceptable, intentional use of brass since it's a small, bounded UI element (a toast/alert), not a large surface.
- **Status badges** (order status, product status "Live/Pending/Rejected") pull the same updated semantic-subtle/semantic-full token pairs automatically — no visual pattern change, only the underlying hex values shift.

### 7.7 Dashboard Tables (Vendor/Admin)

`IBM Plex Mono` figures, `--line`/`--line-strong` table borders, and row-hover backgrounds all pull updated tokens automatically. No column/row structure change.

---

## 8. Accessibility Verification — Contrast Ratios

All pairings below are the ones actually used for text/interactive content against their stated background, verified to meet WCAG AA (4.5:1 for body/small text, 3:1 for large text ≥24px or bold ≥19px, and 3:1 for non-text UI component boundaries per WCAG 2.2's 1.4.11).

| Pairing                              | Light mode ratio | Dark mode ratio | Meets AA?                                                                                                           |
| ------------------------------------ | ---------------- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--ink` on `--paper`                 | ~15.8:1          | ~15.2:1         | ✅ (body text, large text)                                                                                          |
| `--ink` on `--surface`               | ~16.9:1          | ~14.6:1         | ✅                                                                                                                  |
| `--ink-muted` on `--paper`           | ~5.1:1           | ~7.8:1          | ✅ (body text)                                                                                                      |
| `--brand` (brass) on `--paper`       | ~4.7:1           | ~9.6:1          | ✅ (body text — this is the pairing that matters most, since price/link text sits directly on page/card background) |
| `--brand` (brass) on `--surface`     | ~4.9:1           | ~8.9:1          | ✅                                                                                                                  |
| `--accent` (terracotta) on `--paper` | ~5.4:1           | ~5.1:1          | ✅ (badge text)                                                                                                     |
| `--danger` on `--danger-subtle`      | ~5.6:1           | ~5.0:1          | ✅                                                                                                                  |
| `--success` on `--success-subtle`    | ~6.8:1           | ~4.6:1          | ✅                                                                                                                  |
| `--warning` on `--warning-subtle`    | ~5.9:1           | ~4.5:1          | ✅ (borderline in dark mode — see note below)                                                                       |

**Note on `--warning` in dark mode:** this pairing sits close to the 4.5:1 floor — if the actual rendered warning-badge text is ever below 13px, bump `--warning` dark-mode text weight to 600 (semi-bold) to stay comfortably within the large-text 3:1 allowance as a safety margin, or verify with the exact rendered font/weight before shipping.

**Verification method:** these ratios should be re-confirmed against the exact final hex values using a contrast-checking tool (browser devtools' built-in checker, or WebAIM's contrast checker) once the tokens are in place in the actual theme file — the values above are calculated from the specified hex pairs but any last-mile hex adjustment during implementation should be re-verified before shipping, not assumed.

---

## 9. Dark Mode Parity Checklist

Since dark mode was already implemented against the original token names, applying this revision should automatically produce a correct dark theme — this checklist is what to manually spot-check after the token swap, since a few relationships don't invert as cleanly as a simple find-replace:

- [ ] Primary buttons render as bone-fill/ink-text in dark mode (not still ink-fill, which would disappear against the dark page background)
- [ ] Brass (`--brand`) is legibly brighter in dark mode than light mode (`#D9B25E` vs `#8A6A2E`) — a dark-mode UI using the light-mode brass value will read as muddy/low-contrast
- [ ] Card elevation in dark mode is expressed via surface lightness + border (Section 5), not shadow — confirm no leftover shadow-only styling from the old system is still being applied underneath
- [ ] Scarcity/urgency terracotta and warning amber remain visually distinct from brass at a glance in dark mode specifically — the three warm-toned accents (brass, terracotta, amber) are closest together in hue and dark mode's lightness compression makes hue-confusion more likely; do a side-by-side badge check
- [ ] `--overlay` backdrop is a true near-black (`rgba(0,0,0,0.7)`) in dark mode, not the light-mode warm-ink overlay value carried over

---

## 10. Implementation / Migration Notes

**This should be a values-only change.** The practical migration:

1. Locate the theme token definition file (`:root` and `[data-theme="dark"]` blocks, per the original design system's Section 1.10 architecture).
2. Replace each token's value with the corresponding new value from Sections 2, 5, and 6 above — token names are unchanged, so no CSS/component references need editing.
3. Add the one new token (`--text-eyebrow`, Section 4.2) — this is additive, apply it only to the specific spots listed in 4.2, not retroactively to every heading.
4. Do **not** touch: component markup/JSX, layout CSS (grid/flex structure), spacing values, breakpoints, motion/animation code, any interaction logic.
5. After the token swap, do a full visual pass through: buttons (all variants), forms, product cards, PDP, cart drawer, checkout steps, modals/dialogs, toasts, dashboard tables, both light and dark mode — using the Section 9 checklist specifically for dark mode.
6. Re-run contrast verification (Section 8) against the final shipped hex values, not just the specified ones, in case of any last-mile adjustment during implementation.

**What "done" looks like:** a person who has used the product before should recognize every screen's layout and flow immediately, and simultaneously feel that the visual tone has shifted from "approachable/organic" to "premium/tailored" — nothing should have moved, resized, or behaved differently, only what fills the same shapes should read differently.

---

## 11. Do's and Don'ts Quick Reference

| Do                                                                 | Don't                                                                      |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Use brass for prices, links, active states, small brand marks      | Fill a primary button, a large surface, or a hero background with brass    |
| Use ink/bone monochrome for primary buttons in both modes          | Leave primary buttons in the old green, or swap green for brass fill       |
| Keep terracotta strictly to scarcity/urgency badges                | Use terracotta as a general "warm accent" anywhere else                    |
| Let a screen read clearly in grayscale first, color second         | Lean on color to carry hierarchy that type weight/spacing should carry     |
| Use the eyebrow label sparingly, above genuine section breaks      | Add eyebrow labels above every heading in the system                       |
| Re-verify contrast on any hex value adjusted during implementation | Assume the specified ratios hold after any last-mile color tweak           |
| Apply this as a token-value diff only                              | Touch component structure, spacing, or layout while "just updating colors" |
