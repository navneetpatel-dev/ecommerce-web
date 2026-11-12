"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/shared/utils/dom/cn";

interface CartCountBadgeProps {
  count: number;
  /** When set, shown instead of the numeric count (e.g. wallet ₹500). */
  label?: string;
  className?: string;
  /** Slightly smaller type for the mobile tab bar. */
  size?: "default" | "sm";
  /** Keep the pill visible when count is 0 (wallet balance). */
  alwaysShow?: boolean;
  /**
   * `header` — small count pill on the icon corner (cart, wishlist).
   * `header-wide` — wider labels (wallet K amounts) anchored outside the corner.
   * `tab` — sits in reserved padding inside the tab hit area (no clip).
   */
  placement?: "header" | "header-wide" | "tab";
}

interface IconBadgeAnchorProps {
  children: ReactNode;
  className?: string;
  /** Extra inset for tab-bar icons so the pill stays inside the hit area. */
  variant?: "header" | "header-wide" | "tab";
}

/**
 * Wraps an icon + count pill. Header: icon stays full size, pill overhangs.
 * Tab: reserves padding so the pill never clips under overflow/safe-area.
 */
export function IconBadgeAnchor({
  children,
  className,
  variant = "header",
}: IconBadgeAnchorProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-visible",
        variant === "tab"
          ? "min-h-6 min-w-6 pt-1.5 pr-4"
          : variant === "header-wide"
            ? // Phones: the amount sits beside the icon instead of over it.
              "size-5 mr-1.5 max-lg:w-auto max-lg:mr-0 max-lg:gap-1"
            : // Phones: leave room for the corner pill before the next icon.
              "size-5 max-lg:mr-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CartCountBadge({
  count,
  label,
  className,
  size = "default",
  alwaysShow = false,
  placement = "header",
}: CartCountBadgeProps) {
  const [prevCount, setPrevCount] = useState(count);
  const [pulseKey, setPulseKey] = useState(0);
  const visible = alwaysShow || count > 0;
  const display = label ?? (count > 99 ? "99+" : String(count));

  if (count !== prevCount) {
    setPrevCount(count);
    if (visible) {
      setPulseKey((k) => k + 1);
    }
  }

  const pulseAnimate = pulseKey === 0 ? { scale: 1 } : { scale: [1, 1.28, 1] };
  const badgeElement = visible && (
    <motion.span
      key="cart-badge"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 22 }}
      className={cn(
        "pointer-events-none absolute z-[1] leading-none",
        placement === "tab" && "right-0 top-0",
        // Phones: the pill hangs off the icon's top-right corner, not over it.
        placement === "header" &&
          "-right-2.5 -top-2 max-lg:right-auto max-lg:left-[calc(100%-4px)]",
        placement === "header-wide" &&
          "right-0 top-0 translate-x-[55%] -translate-y-[45%] max-lg:static max-lg:translate-x-0 max-lg:translate-y-0",
        className,
      )}
    >
      <motion.span
        key={pulseKey}
        initial={{ scale: 1 }}
        animate={pulseAnimate}
        transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
        className={cn(
          "flex items-center justify-center whitespace-nowrap rounded-full bg-brand font-mono font-medium leading-none text-paper tabular-nums",
          placement === "header" && "shadow-[0_0_0_1px_rgba(0,0,0,0.28)]",
          size === "sm"
            ? "h-4 min-w-4 px-0.5 text-[0.6875rem]"
            : placement === "header-wide"
              ? "h-[0.9375rem] min-w-[0.9375rem] px-1 text-[0.6875rem]"
              : "h-4 min-w-4 px-1 text-[0.6875rem]",
        )}
      >
        {display}
      </motion.span>
    </motion.span>
  );

  return (
    <AnimatePresence initial={!alwaysShow}>{badgeElement}</AnimatePresence>
  );
}
