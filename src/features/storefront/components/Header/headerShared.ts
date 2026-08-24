export const HEADER_ICON_BTN =
  "relative !overflow-visible [&_svg]:!size-5 max-sm:h-9 max-sm:w-9 max-sm:min-h-9 max-sm:max-h-9";

/** Named ink tone by chrome transparency (Rule 5: no inline class ternaries). */
export const HEADER_INK_TONE = {
  transparent: "text-paper",
  solid: "text-ink",
} as const;
