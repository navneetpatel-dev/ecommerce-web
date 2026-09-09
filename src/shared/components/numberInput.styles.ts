export const numberInputStyles = {
  container:
    "flex h-11 w-full items-stretch overflow-hidden rounded-sm border bg-surface-raised transition-colors focus-within:border-brand",
  borderError: "border-danger",
  borderDefault: "border-line-strong",
  disabled: "cursor-not-allowed opacity-50",
  prefix:
    "flex shrink-0 items-center border-r border-line-strong bg-paper/60 px-3 text-body-sm font-medium text-ink-muted",
  input:
    "min-w-0 flex-1 bg-transparent px-4 text-body tabular-nums text-ink outline-none placeholder:text-ink-faint [appearance:textfield]",
  suffix:
    "flex shrink-0 items-center px-3 text-body-sm font-medium text-ink-muted",
  stepperContainer: "flex w-9 shrink-0 flex-col border-l border-line-strong",
  stepperBtn:
    "flex flex-1 items-center justify-center text-ink-muted transition-colors hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-40",
  stepperBtnDown:
    "flex flex-1 items-center justify-center border-t border-line-strong text-ink-muted transition-colors hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-40",
} as const;
