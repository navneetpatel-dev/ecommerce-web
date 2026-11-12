"use client";

import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { LABELS } from "@/shared/constants/labels";
import { filterSidebarStyles } from "../../../styles/filters/filterSidebar.styles";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import { usePriceRangeFilter } from "../../../hooks/filters/usePriceRangeFilter.hook";

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
  const price = usePriceRangeFilter({ minPrice, maxPrice, onUpdateFilter });

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
            prefix={CURRENCY_SYMBOL}
            value={price.min}
            onChange={price.handleMinChange}
            aria-invalid={price.error ? true : undefined}
            aria-describedby={price.error ? price.errorId : undefined}
          />
          <span className={filterSidebarStyles.priceSeparator}>—</span>
          <NumberInput
            showSteppers={false}
            min={0}
            placeholder={LABELS.maxPricePlaceholder}
            aria-label={LABELS.maximumPrice}
            prefix={CURRENCY_SYMBOL}
            value={price.max}
            onChange={price.handleMaxChange}
            aria-invalid={price.error ? true : undefined}
            aria-describedby={price.error ? price.errorId : undefined}
          />
        </div>
        {price.error ? (
          <p
            id={price.errorId}
            role="alert"
            className={filterSidebarStyles.priceError}
          >
            {price.error}
          </p>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}
