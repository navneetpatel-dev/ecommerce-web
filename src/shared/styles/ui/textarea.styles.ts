export const textareaStyles = {
  /**
   * `text-[1rem]` on phones: iOS Safari zooms the whole page when a focused
   * field renders under 16px. Everything from `sm` up keeps the 15px body size.
   */
  base: "flex min-h-[132px] w-full rounded-sm border bg-surface-raised px-4 py-3 text-[1rem] sm:text-body text-ink placeholder:text-ink-faint outline-none focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50",
  error: "border-danger",
  normal: "border-line-strong",
} as const;
