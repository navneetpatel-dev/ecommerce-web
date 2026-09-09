export const DEFAULT_CELL =
  "h-8 w-8 min-h-8 max-h-8 sm:h-9 sm:w-9 sm:min-h-9 sm:max-h-9 lg:h-11 lg:w-11 lg:min-h-11 lg:max-h-11 [&_svg]:size-3 sm:[&_svg]:size-3.5 lg:[&_svg]:size-4" as const;

export const DEFAULT_VALUE =
  "h-4 w-5 text-[0.75rem] sm:h-5 sm:w-6 sm:text-body-sm lg:w-8 lg:text-body" as const;

export const QUANTITY_SELECTOR_CONTAINER =
  "relative z-[1] inline-flex shrink-0 items-center rounded-sm border border-line" as const;

export const QUANTITY_CONTROL_BUTTON_BASE =
  "relative z-[1] inline-flex shrink-0 items-center justify-center text-ink touch-manipulation transition-colors hover:bg-paper outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0" as const;

export const QUANTITY_INPUT_BASE =
  "relative z-[1] shrink-0 border-x border-line bg-transparent text-center font-mono font-medium tabular-nums text-ink outline-none [appearance:textfield] focus-visible:shadow-[inset_0_0_0_1px_var(--brand)] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" as const;

export const QUANTITY_VALUE_DIGIT =
  "font-mono font-medium tabular-nums text-ink" as const;

export const QUANTITY_SELECTOR_EXTRA = {
  borderX: "border-x border-line",
  hintContainer: "relative z-[1] max-w-none shrink-0",
  disabledShrink: "shrink-0",
} as const;
