"use client";

import type { ComponentType } from "react";
import { cn } from "@/shared/utils/dom/cn";

export type QuickFilterTone =
  "default" | "success" | "warning" | "danger" | "info";

export interface QuickFilterChip<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  tone?: QuickFilterTone;
  icon?: ComponentType<{ className?: string }>;
}

export interface QuickFilterChipsProps {
  chips: QuickFilterChip[];
  className?: string;
  ariaLabel?: string;
}

const activeToneStyles: Record<QuickFilterTone, string> = {
  default:
    "border-brand/40 bg-brand/10 text-brand font-semibold shadow-2xs ring-1 ring-brand/20",
  success:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold shadow-2xs ring-1 ring-emerald-500/20",
  warning:
    "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold shadow-2xs ring-1 ring-amber-500/20",
  danger:
    "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold shadow-2xs ring-1 ring-rose-500/20",
  info: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold shadow-2xs ring-1 ring-sky-500/20",
};

const activeBadgeStyles: Record<QuickFilterTone, string> = {
  default: "bg-brand text-paper",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-600 text-white",
  danger: "bg-rose-600 text-white",
  info: "bg-sky-600 text-white",
};

const toneIndicatorDot: Record<QuickFilterTone, string | null> = {
  default: null,
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
};

/**
 * One-click preset filter chips displayed directly above tables for frequent,
 * fast triage with semantic color toning (e.g. Danger for Critical, Success for Live).
 */
export function QuickFilterChips({
  chips,
  className,
  ariaLabel = "Quick filter presets",
}: QuickFilterChipsProps) {
  if (!chips.length) return null;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5",
        className,
      )}
    >
      {chips.map((chip) => {
        const tone = chip.tone ?? "default";
        const Icon = chip.icon;
        const dotColor = toneIndicatorDot[tone];

        return (
          <button
            key={chip.id}
            type="button"
            aria-pressed={chip.isActive}
            onClick={chip.onClick}
            className={cn(
              "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[12px] font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand active:scale-95",
              chip.isActive
                ? activeToneStyles[tone]
                : "border-line/70 bg-surface-muted/40 text-ink-muted hover:border-line hover:bg-surface-muted hover:text-ink",
            )}
          >
            {dotColor && (
              <span
                className={cn(
                  "size-1.5 rounded-full shrink-0 transition-transform",
                  dotColor,
                  chip.isActive ? "scale-125" : "opacity-80",
                )}
                aria-hidden
              />
            )}
            {Icon && <Icon className="size-3" />}
            <span className="truncate">{chip.label}</span>
            {chip.count != null && chip.count > 0 && (
              <span
                className={cn(
                  "ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none",
                  chip.isActive
                    ? activeBadgeStyles[tone]
                    : "bg-surface-muted text-ink-muted",
                )}
              >
                {chip.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
