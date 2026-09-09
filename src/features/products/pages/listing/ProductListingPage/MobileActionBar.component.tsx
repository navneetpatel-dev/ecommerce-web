"use client";

import { Columns2, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { productListingPageStyles } from "./productListingPage.styles";

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
    <div className={productListingPageStyles.mobileBarRoot}>
      <div className={productListingPageStyles.mobileBarRow}>
        <Button
          variant="secondary"
          size="sm"
          className={productListingPageStyles.mobileBarButton}
          onClick={onOpenFilters}
        >
          <SlidersHorizontal size={14} strokeWidth={1.75} aria-hidden />
          {LABELS.filters}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={productListingPageStyles.mobileBarButton}
          onClick={onOpenSort}
        >
          <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
          {LABELS.sort}
        </Button>
        <Button
          variant={compareMode ? "default" : "secondary"}
          size="sm"
          className={productListingPageStyles.mobileBarButton}
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
