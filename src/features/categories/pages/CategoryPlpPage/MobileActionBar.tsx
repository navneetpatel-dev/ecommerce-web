import { ArrowUpDown, Columns2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

interface MobileActionBarProps {
  onOpenFilters: () => void;
  onOpenSort: () => void;
  compareMode: boolean;
  onToggleCompareMode: () => void;
}

export function MobileActionBar({
  onOpenFilters,
  onOpenSort,
  compareMode,
  onToggleCompareMode,
}: MobileActionBarProps) {
  return (
    <div className="sticky top-14 z-20 -mx-4 mb-3 border-y border-line bg-paper/95 px-4 py-2 backdrop-blur-sm xl:hidden lg:top-[72px]">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="min-w-0 flex-1 gap-1 px-2 sm:gap-1.5 sm:px-4"
          onClick={onOpenFilters}
        >
          <SlidersHorizontal size={14} strokeWidth={1.75} aria-hidden />
          <span className="truncate">{LABELS.filters}</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="min-w-0 flex-1 gap-1 px-2 sm:gap-1.5 sm:px-4"
          onClick={onOpenSort}
        >
          <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
          <span className="truncate">{LABELS.sort}</span>
        </Button>
        <Button
          variant={compareMode ? "default" : "secondary"}
          size="sm"
          className="min-w-0 flex-1 gap-1 px-2 sm:gap-1.5 sm:px-4"
          onClick={onToggleCompareMode}
          aria-pressed={compareMode}
        >
          <Columns2 size={14} strokeWidth={1.75} aria-hidden />
          <span className="truncate">{LABELS.compare}</span>
        </Button>
      </div>
    </div>
  );
}
