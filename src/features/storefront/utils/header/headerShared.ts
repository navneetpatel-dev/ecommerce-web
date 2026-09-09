export const HEADER_ICON_BTN =
  "relative !overflow-visible [&_svg]:!size-5 max-sm:h-9 max-sm:w-9 max-sm:min-h-9 max-sm:max-h-9";

/**
 * Box geometry of the account menu trigger, shared with its skeleton so the two
 * occupy identical space and the navbar does not shift when the session
 * resolves. Colour/hover variants stay with each caller.
 */
export const ACCOUNT_TRIGGER_BOX = [
  "shrink-0 overflow-visible rounded-full border",
  "flex size-8 items-center justify-center p-0",
  "sm:size-auto sm:gap-0.5 sm:py-0.5 sm:pl-0.5 sm:pr-1.5",
  "!h-8 !min-h-8 !max-h-8",
  "sm:!h-auto sm:!min-h-0 sm:!max-h-none sm:!w-auto",
].join(" ");

/** Named ink tone by chrome transparency (Rule 5: no inline class ternaries). */
export const HEADER_INK_TONE = {
  transparent: "text-paper",
  solid: "text-ink",
} as const;
