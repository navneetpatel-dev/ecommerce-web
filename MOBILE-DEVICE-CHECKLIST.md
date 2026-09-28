# Mobile device checklist

Manual verification for the mobile shell: safe areas, field focus, landscape and
installed-PWA behaviour. Run it on a **real device** before any release that
touches layout, the viewport config or the bottom rails.

## Why a real device is mandatory

Chrome DevTools device emulation **injects** safe-area insets, so a page that has
them wrong still looks correct there. This is not hypothetical: until WS-14,
`ROOT_VIEWPORT` was missing `viewportFit: "cover"`, which makes every
`env(safe-area-inset-*)` resolve to `0` on iOS — the emulator showed the insets
working while a real iPhone rendered the tab bar under the home indicator.
Automated checks cover the class contracts; only this checklist proves the pixels.

## Automated coverage (already enforced by CI, don't re-check by hand)

| Concern                                           | Where                                                                                                                                              |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `viewportFit: "cover"` is set                     | `src/shared/seo/__tests__/rootMetadata.test.ts`                                                                                                    |
| Every text field is 16px on phones                | `src/shared/styles/ui/__tests__/fieldFontSizes.test.ts`, `src/features/admin-dashboard/styles/users/__tests__/changeUserRoleDialog.styles.test.ts` |
| Rail offsets come from one module                 | `src/shared/constants/layout/__tests__/mobileRails.test.ts` + `scripts/check-safe-area-offsets.mjs`                                                |
| Nothing pins to a viewport edge without its inset | `scripts/check-safe-area-offsets.mjs`                                                                                                              |

## Matrix

| Device                           | Browser       | Mode                                       | Required                          |
| -------------------------------- | ------------- | ------------------------------------------ | --------------------------------- |
| iPhone with notch/Dynamic Island | Safari        | browser                                    | yes                               |
| iPhone with notch/Dynamic Island | Safari        | **installed** (Share → Add to Home Screen) | yes                               |
| Android phone                    | Chrome        | browser                                    | yes                               |
| Android phone                    | Chrome        | installed                                  | yes                               |
| Any phone at 360×640             | Chrome/Safari | browser                                    | yes                               |
| Any phone                        | —             | **landscape**                              | yes                               |
| iPad, iOS 17+                    | Safari        | browser                                    | recommended (lg is touch-capable) |

Test builds: `npm run build && npm start`, then open the LAN URL on the device.
Keep DevTools open for the snippet checks below.

## A. Safe areas

Use **standalone** mode for the strictest case (no browser chrome).

| Where                                     | Expected                                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Storefront header (sticky, top)           | Logo/actions below the status bar; the bar's background still reaches the top edge                                        |
| Auth pages top bar, impersonation banner  | Brand/close control clear of the status bar                                                                               |
| Mobile nav / workspace nav / cart drawers | Panel background reaches the edges; header and close button clear of the status bar; bottom row clears the home indicator |
| Bottom tab bar                            | Labels/icons clear of the home indicator; background fills to the very bottom                                             |
| PDP sticky add-to-cart bar                | Sits directly above the tab bar, nothing clipped                                                                          |
| Checkout sticky "Place order" bar         | Same, above the tab bar                                                                                                   |
| Compare bar (`/compare`)                  | Floats above the tab bar with a visible gap                                                                               |
| Toasts                                    | Above the tab bar, none under the home indicator                                                                          |
| Bottom sheets (filters, pickers)          | Content clear of the home indicator; scrolling inside the sheet doesn't move the page behind it                           |
| Cookie banner (first visit)               | Text/buttons clear of the home indicator                                                                                  |

Quick check in Safari Web Inspector (non-zero on a notched device):

```js
getComputedStyle(document.querySelector("nav")).paddingBottom; // tab bar
getComputedStyle(document.querySelector("header")).paddingTop; // header
```

## B. Focus, keyboard and typing

1. Focus the search box, an address field, a review textarea, a quantity field and
   an OTP box: **the page must not zoom** (iOS zooms any field under 16px).
2. With the keyboard open on the checkout review step, the "Place order" bar must
   stay reachable (scroll if needed) and not hide behind the keyboard.
3. Open the filters sheet, focus a field, scroll the sheet: the page behind must
   not scroll (`overscroll-contain`).
4. Numeric fields raise the numeric keypad (`inputMode`).

## C. Landscape

1. Tab bar collapses to icons only (labels hidden) below `md`.
2. Bottom sheets cap at 90dvh and scroll internally instead of running off-screen.
3. PDP switches from stacked to **side-by-side** (gallery left, buy box right);
   the skeleton shows the same two-column shape while it loads.
4. Full-bleed bars (tab bar, PDP/checkout bars, compare bar, sheets, drawers) keep
   clear of the notch: no content clipped on either edge.

## D. Installed PWA

1. Home-screen icon shows the store mark on paper — **not** a screenshot of the page.
2. Launching from the icon opens standalone (no browser chrome) with the correct
   status-bar colour.
3. Nothing sits under the status bar or home indicator (repeat section A here).
4. Pulling down at the top does not accidentally reload the app.
5. Navigate deep (PDP → cart), then background and foreground the app: state survives.

## E. Layout and interaction

1. Orders/vendor/admin tables render as **card lists** on a phone; the important
   column is still visible (`hideOnMobile` only drops secondary columns).
2. PLP shows a 2-column grid; filters open in a bottom sheet; applied-filter chips
   are tappable and the clear affordance works.
3. Tap targets: bar tabs, quantity steppers, list-row actions and sheet buttons are
   all comfortable to hit one-handed (44×44 minimum, spec §3.3).
4. Sticky elements stack without covering each other: PDP CTA + tab bar + compare
   bar + toast, all visible at once when triggered together.
5. Horizontal table scroll (admin) doesn't drag the page sideways.

## F. Motion and theme

1. System "Reduce Motion" on → no slide/scale animation on drawers, sheets or toasts.
2. System dark mode → colours flip; re-check section A briefly (shadows and edges
   can disappear against the dark palette).

## Sign-off

| Device / OS | Browser + mode | Build (commit) | Result | Notes |
| ----------- | -------------- | -------------- | ------ | ----- |
|             |                |                |        |       |
|             |                |                |        |       |
|             |                |                |        |       |

Record every failure as: section, expected, actual, screenshot. Anything that
cannot be fixed here (for example a browser bug with `env()` on a particular iOS
version) goes in the notes column together with its workaround.
