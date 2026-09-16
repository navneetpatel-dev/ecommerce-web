export const inputStyles = {
  base: "flex h-11 w-full rounded-sm border bg-surface-raised px-4 text-[1rem] sm:text-body text-ink transition-colors file:border-0 file:bg-transparent file:text-body-sm file:font-medium placeholder:text-ink-faint outline-none focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50",
  number:
    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
  dateTime:
    "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:ml-2 [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
  error: "border-danger",
  normal: "border-line-strong",
  passwordWrapper: "relative",
  passwordInput: "pr-11",
  passwordToggle:
    "absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-ink-muted transition-colors hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
} as const;
