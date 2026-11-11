export const CARD_DETAILS_STYLES = {
  // min-w-0 lets the column shrink to the card on phones instead of widening the page.
  root: "mt-3 min-w-0 space-y-1",
  title:
    "font-sans text-body font-medium text-ink line-clamp-2 group-hover:text-brand transition-colors",
  // Wraps on narrow cards: "From ₹2,189 ₹2,907 −25%" no longer pushes past the card.
  priceRow: "flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5",
  priceFrom: "font-sans text-body-sm text-ink-muted",
  basePrice: "whitespace-nowrap font-sans text-body font-semibold text-brand",
  compareAtPrice:
    "whitespace-nowrap font-sans text-body-sm text-ink-faint line-through",
} as const;
