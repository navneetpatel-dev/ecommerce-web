import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { filterSidebarStyles } from "./filterSidebar.styles";

interface FilterSidebarHeaderProps {
  hasFilters: boolean;
  onClear: () => void;
}

export function FilterSidebarHeader({
  hasFilters,
  onClear,
}: FilterSidebarHeaderProps) {
  return (
    <div className={filterSidebarStyles.header}>
      <div>
        <TextEyebrow className="mb-1">{LABELS.refine}</TextEyebrow>
        <h2 className={filterSidebarStyles.headerTitle}>{LABELS.filters}</h2>
      </div>
      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          className={filterSidebarStyles.clearAllButton}
        >
          <X size={12} strokeWidth={2} aria-hidden />
          {LABELS.clearFacetFilters}
        </Button>
      ) : null}
    </div>
  );
}
