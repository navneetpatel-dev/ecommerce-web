export const categoriesPageHeaderStyles = {
  root: "flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
  headingWrapper: "min-w-0 space-y-1",
  title:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  hint: "max-w-xl text-[0.875rem] text-ink-muted",
  buttonGroup: "sm:shrink-0",
  dialogContent: "max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto",
  form: "space-y-1",
} as const;
