# UI/UX Spec Compliance Checklist

This checklist tracks implementation of `ecommerce-ui-ux-design-spec.md`.

## Verification command

Run:

`npm run spec:check`

## Core gates

- Shared tokens are used for color, spacing, radius, and typography.
- Focus-visible styles are present on all interactive elements.
- Reduced motion is respected globally.
- Home/PLP/PDP/Cart/Checkout/Orders/Auth routes render without placeholder blockers.
- Mobile filter/sort experiences exist where required.
- Dashboard surfaces keep consistent table/form density and status treatments.
- Static policy/help pages are reachable from footer links.

## Manual QA pass (desktop + mobile)

- Validate light and dark mode surfaces and text contrast.
- Validate cart and checkout from product add to order confirmation.
- Validate keyboard navigation in header, drawer, modal, tabs, and forms.
- Validate no layout shift in image-heavy grids and PDP.
