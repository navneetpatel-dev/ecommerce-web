export const blogListViewStyles = {
  container: "max-w-[1200px] mx-auto px-4 py-10",
  heading: "text-[1.75rem] font-semibold text-ink mb-6",
  grid: "grid grid-cols-1 lg:grid-cols-3 gap-6",
  card: "rounded-md border border-line bg-surface p-4",
  thumbnail: "aspect-[16/9] rounded-sm bg-brand-subtle mb-4",
  cardTitle: "text-[1.125rem] font-semibold text-ink",
  excerpt: "text-body text-ink-muted mt-2",
  readMoreLink: "inline-flex mt-3 text-body-sm text-brand hover:underline",
} as const;
