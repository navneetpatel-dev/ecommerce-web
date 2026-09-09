import { useCallback } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { RadioGroup } from "@/shared/components/ui/radio-group";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { filterSidebarStyles } from "./filterSidebar.styles";
import { FilterSidebarRatingOptionsList } from "./FilterSidebarRatingOptionsList.component";

interface FilterSidebarRatingFilterProps {
  rating: number | undefined;
  idPrefix: string;
  onUpdateFilter: (key: string, value: unknown) => void;
}

export function FilterSidebarRatingFilter({
  rating,
  idPrefix,
  onUpdateFilter,
}: FilterSidebarRatingFilterProps) {
  const ratingValue = rating != null ? String(rating) : "";

  const handleRatingChange = useCallback(
    (v: string) => {
      onUpdateFilter("rating", v ? Number(v) : undefined);
    },
    [onUpdateFilter],
  );

  const handleClearRating = useCallback(() => {
    onUpdateFilter("rating", undefined);
  }, [onUpdateFilter]);

  return (
    <AccordionItem value="rating">
      <AccordionTrigger>{LABELS.rating}</AccordionTrigger>
      <AccordionContent>
        <RadioGroup
          key={`${idPrefix}-rating-${ratingValue || "none"}`}
          value={ratingValue}
          onValueChange={handleRatingChange}
          className={filterSidebarStyles.ratingGroup}
        >
          <FilterSidebarRatingOptionsList idPrefix={idPrefix} />
        </RadioGroup>
        {rating != null ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={filterSidebarStyles.clearRatingButton}
            onClick={handleClearRating}
          >
            {LABELS.clearRating}
          </Button>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}
