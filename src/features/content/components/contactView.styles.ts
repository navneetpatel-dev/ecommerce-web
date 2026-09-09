export const contactViewStyles = {
  container:
    "mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-2",
  formSection: "space-y-4",
  heading: "text-[1.75rem] font-semibold text-ink",
  intro: "text-body text-ink-muted",
  detailsCard: "space-y-3 rounded-md border border-line bg-surface p-5",
  cardTitle: "text-[1.125rem] font-semibold text-ink",
  detailText: "text-body text-ink-muted",
  selfServeNotice: "text-body-sm text-ink-muted",
  helpLink: "text-brand underline-offset-2 hover:underline",
} as const;
