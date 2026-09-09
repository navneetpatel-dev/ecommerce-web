import { useCallback } from "react";
import { NumberInput } from "@/shared/components/NumberInput.component";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { LABELS } from "@/shared/constants/labels";
import { filterSidebarStyles } from "../../../styles/filters/filterSidebar.styles";

interface FilterSidebarPriceFilterProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onUpdateFilter: (key: string, value: unknown) => void;
}

export function FilterSidebarPriceFilter({
  minPrice,
  maxPrice,
  onUpdateFilter,
}: FilterSidebarPriceFilterProps) {
  const handleMinPriceChange = useCallback(
    (value: number | undefined) => {
      onUpdateFilter("minPrice", value);
    },
    [onUpdateFilter],
  );

  const handleMaxPriceChange = useCallback(
    (value: number | undefined) => {
      onUpdateFilter("maxPrice", value);
    },
    [onUpdateFilter],
  );

  return (
    <AccordionItem value="price">
      <AccordionTrigger>{LABELS.price}</AccordionTrigger>
      <AccordionContent>
        <div className={filterSidebarStyles.priceRow}>
          <NumberInput
            showSteppers={false}
            min={0}
            placeholder={LABELS.minPricePlaceholder}
            aria-label={LABELS.minimumPrice}
            prefix="₹"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
          <span className={filterSidebarStyles.priceSeparator}>—</span>
          <NumberInput
            showSteppers={false}
            min={0}
            placeholder={LABELS.maxPricePlaceholder}
            aria-label={LABELS.maximumPrice}
            prefix="₹"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
