"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { LABELS } from "@/shared/constants/labels";
import { iconCloseButtonStyles as styles } from "../../styles/ui/iconCloseButton.styles";

export type IconCloseButtonVariant =
  "dialog" | "floating" | "overlay" | "inline";

const ICON_CLASS: Record<IconCloseButtonVariant, string> = {
  dialog: styles.iconDialog,
  floating: styles.iconDialog,
  overlay: styles.iconOverlay,
  inline: styles.iconInline,
};

export interface IconCloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconCloseButtonVariant;
  /** Accessible name; defaults to "Close". Use `LABELS.remove` for removing an item. */
  label?: string;
}

/**
 * The one "×" button of the app. It is a plain button (not `Button`, whose locked 44px height is
 * wrong for a corner control) so every dialog, tile, chip and drawer closes or removes the same way.
 */
const IconCloseButton = React.forwardRef<
  HTMLButtonElement,
  IconCloseButtonProps
>(({ variant = "inline", label = LABELS.close, className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    className={cn(styles[variant], className)}
    {...props}
  >
    <X className={ICON_CLASS[variant]} strokeWidth={2.25} aria-hidden />
  </button>
));
IconCloseButton.displayName = "IconCloseButton";

export { IconCloseButton };
