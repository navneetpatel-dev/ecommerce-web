export const walletPageStyles = {
  container:
    "storefront-container py-8 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:py-10 lg:pb-10",
  header: "mb-8",
  title: "mt-1.5 font-display text-ink leading-[1.1] tracking-tight",
  description: "mt-2 max-w-2xl text-body text-ink-muted",
  cardsGrid: "grid gap-6 md:grid-cols-2 lg:gap-8",
  fullHeight: "h-full",
  statementWrapper: "mt-6 lg:mt-8",
  transactionsSection: "mt-8 lg:mt-10",
} as const;
