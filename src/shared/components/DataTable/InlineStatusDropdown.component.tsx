"use client";

import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/utils/dom/cn";

export interface InlineStatusOption {
  value: string;
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  description?: string;
}

export interface InlineStatusDropdownProps {
  currentStatus: string;
  options: InlineStatusOption[];
  onStatusChange: (newStatus: string) => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

const TONE_CLASSES: Record<
  NonNullable<InlineStatusOption["tone"]>,
  { dot: string; badge: string }
> = {
  default: {
    dot: "bg-ink-muted",
    badge: "border-line bg-surface-muted text-ink",
  },
  success: {
    dot: "bg-emerald-500",
    badge:
      "border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300",
  },
  warning: {
    dot: "bg-amber-500",
    badge:
      "border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300",
  },
  danger: {
    dot: "bg-rose-500",
    badge:
      "border-rose-200 dark:border-rose-800/60 bg-rose-50/80 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300",
  },
  info: {
    dot: "bg-sky-500",
    badge:
      "border-sky-200 dark:border-sky-800/60 bg-sky-50/80 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300",
  },
};

export function InlineStatusDropdown({
  currentStatus,
  options,
  onStatusChange,
  disabled = false,
  className,
  ariaLabel = "Change status",
}: InlineStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentOption = options.find((opt) => opt.value === currentStatus) ?? {
    value: currentStatus,
    label: currentStatus,
    tone: "default" as const,
  };

  const currentTone = currentOption.tone || "default";
  const toneStyle = TONE_CLASSES[currentTone] ?? TONE_CLASSES.default;

  const handleSelect = async (newValue: string) => {
    if (newValue === currentStatus || loading) {
      setOpen(false);
      return;
    }

    try {
      setLoading(true);
      await Promise.resolve(onStatusChange(newValue));
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled || loading}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-medium transition-all shadow-2xs",
            "hover:ring-2 hover:ring-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
            disabled && "cursor-not-allowed opacity-60",
            toneStyle.badge,
            className,
          )}
          aria-label={`${ariaLabel}: currently ${currentOption.label}`}
        >
          {loading ? (
            <Loader2 className="size-2.5 animate-spin" aria-hidden />
          ) : (
            <span
              className={cn("size-1.5 rounded-full shrink-0", toneStyle.dot)}
              aria-hidden
            />
          )}
          <span className="truncate">{currentOption.label}</span>
          {!disabled && (
            <ChevronDown
              className={cn(
                "size-3 opacity-60 group-hover:opacity-100 transition-transform duration-150",
                open && "rotate-180",
              )}
              aria-hidden
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        onClick={(e) => e.stopPropagation()}
        className="w-48 p-1.5 space-y-0.5 z-50 bg-surface-raised border-line shadow-elevation-2"
      >
        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
          Update status
        </p>
        {options.map((opt) => {
          const isSelected = opt.value === currentStatus;
          const optTone = opt.tone || "default";
          const optToneStyle = TONE_CLASSES[optTone] ?? TONE_CLASSES.default;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded px-2 py-1.5 text-caption text-ink transition-colors text-left",
                isSelected
                  ? "bg-brand/10 text-brand font-semibold"
                  : "hover:bg-surface-muted",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full shrink-0",
                  optToneStyle.dot,
                )}
                aria-hidden
              />
              <span className="flex-1 truncate">{opt.label}</span>
              {isSelected ? (
                <span className="text-[10px] font-mono text-brand">✓</span>
              ) : null}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
