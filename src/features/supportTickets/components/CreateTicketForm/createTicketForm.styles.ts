export const createTicketFormStyles = {
  form: "w-full min-w-0",
  stack: "space-y-8",

  header:
    "flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
  headerTitleWrap: "min-w-0 space-y-1.5",
  headerTitle:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  headerDesc: "max-w-3xl text-body leading-relaxed text-ink-muted",
  headerSubmitBtn: "hidden shrink-0 sm:inline-flex",

  counterText: "mt-1 text-[0.75rem] tabular-nums text-ink-muted",
} as const;
