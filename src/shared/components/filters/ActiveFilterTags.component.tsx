"use client";

import { IconCloseButton } from "@/shared/components/ui/icon-close-button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";

export interface ActiveFilterTag {
  id: string;
  label: string;
  valueLabel: string;
  onRemove: () => void;
}

export interface ActiveFilterTagsProps {
  tags: ActiveFilterTag[];
  onClearAll?: () => void;
  className?: string;
}

export function ActiveFilterTags({
  tags,
  onClearAll,
  className,
}: ActiveFilterTagsProps) {
  if (!tags.length) return null;

  return (
    <div
      role="region"
      aria-label="Active filters"
      className={cn(
        "flex flex-wrap items-center gap-1.5 py-1 text-caption text-ink-muted animate-in fade-in-50 duration-150",
        className,
      )}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted/70 mr-0.5 select-none">
        Filtered by:
      </span>

      {tags.map((tag) => (
        <span
          key={tag.id}
          className="group inline-flex h-6.5 items-center gap-1.5 rounded-full border border-line/70 bg-surface-raised/80 backdrop-blur-xs pl-2.5 pr-1 text-[12px] font-medium text-ink shadow-2xs transition-all hover:border-line-strong hover:bg-surface-raised"
        >
          <span className="text-ink-muted/80 font-normal">{tag.label}:</span>
          <span className="font-semibold text-ink">{tag.valueLabel}</span>
          <IconCloseButton
            variant="inline"
            label={`Remove filter ${tag.label} ${tag.valueLabel}`}
            className="size-5 hover:bg-danger/15 hover:text-danger"
            onClick={tag.onRemove}
          />
        </span>
      ))}

      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-brand hover:text-brand-strong hover:underline underline-offset-2 ml-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="size-3" aria-hidden />
          <span>Clear all</span>
        </button>
      )}
    </div>
  );
}
