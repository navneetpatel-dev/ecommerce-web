export const accordionStyles = {
  item: "border-b border-line",
  header: "flex",
  trigger:
    "flex flex-1 cursor-pointer items-center justify-between gap-4 py-4 text-left font-medium text-body outline-none transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand [&[data-state=open]>svg]:rotate-180",
  chevron: "shrink-0 text-ink-muted transition-transform duration-200",
  content:
    "overflow-hidden text-body data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  contentBody: "pb-4 pt-0",
} as const;
