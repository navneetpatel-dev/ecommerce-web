"use client";

import { Columns2, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

interface MobileActionBarProps {
  compareMode: boolean;
  onOpenFilters: () => void;
  onOpenSort: () => void;
  onToggleCompareMode: () => void;
}

export function MobileActionBar({
  compareMode,
  onOpenFilters,
  onOpenSort,
  onToggleCompareMode,
}: MobileActionBarProps) {
  return (
    <div className="sticky top-14 z-20 -mx-4 mb-6 border-y border-line bg-paper/95 px-4 py-3 backdrop-blur-sm xl:hidden lg:top-[72px]">
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={onOpenFilters}
        >
          <SlidersHorizontal size={14} strokeWidth={1.75} aria-hidden />
          {LABELS.filters}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={onOpenSort}
        >
          <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
          {LABELS.sort}
        </Button>
        <Button
          variant={compareMode ? "default" : "secondary"}
          size="sm"
          className="flex-1 gap-1.5"
          onClick={onToggleCompareMode}
          aria-pressed={compareMode}
        >
          <Columns2 size={14} strokeWidth={1.75} aria-hidden />
          {LABELS.compare}
        </Button>
      </div>
    </div>
  );
}
