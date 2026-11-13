import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The theme's font-size tokens (`--text-*` in globals.css). Without them
 * tailwind-merge reads `text-body-sm` as a colour, so `cn("text-body-sm",
 * "text-ink-muted")` silently dropped the size and the text grew to 16px.
 * (`text-eyebrow` is a component class — size + colour — and stays out.)
 */
const FONT_SIZE_TOKENS = [
  "display-lg",
  "display-md",
  "display-sm",
  "body-lg",
  "body",
  "body-sm",
  "label",
  "mono",
];

const twMerge = extendTailwindMerge({
  extend: { theme: { text: FONT_SIZE_TOKENS } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
