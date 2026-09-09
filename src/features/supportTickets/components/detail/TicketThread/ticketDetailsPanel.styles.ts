export const ticketDetailsPanelStyles = {
  header: "border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5",
  content: "space-y-4 px-4 py-4 sm:px-5 sm:py-5",
  list: "grid gap-3 text-body-sm",
  row: "flex items-center justify-between gap-3",
  rowDivided:
    "flex items-center justify-between gap-3 border-t border-line/60 pt-3",
  label: "text-ink-muted",
  valBold: "font-medium text-ink",
  valText: "text-ink",
  valTruncated: "truncate text-ink",
  valMono: "font-mono text-[0.75rem] text-ink",
  sectionDivided: "border-t border-line/60 pt-4",
  requestText:
    "mt-2 whitespace-pre-wrap text-body-sm leading-relaxed text-ink-muted",
  actionsRow: "flex flex-wrap gap-2 border-t border-line/60 pt-4",
} as const;
