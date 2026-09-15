"use client";

import { Accordion } from "@/shared/components/ui/accordion";
import { LABELS } from "@/shared/constants/labels";
import type { CategoryFacet } from "@/shared/api/types";
import { filterSidebarStyles } from "../../../styles/filters/filterSidebar.styles";
import { useFilterSidebarPresentation } from "../../../hooks/filters/useFilterSidebarPresentation.hook";
import { FilterSidebarHeader } from "./FilterSidebarHeader.component";
import { FilterSidebarPriceFilter } from "./FilterSidebarPriceFilter.component";
import { FilterSidebarFacetsList } from "./FilterSidebarFacetsList.component";
import { FilterSidebarRatingFilter } from "./FilterSidebarRatingFilter.component";

export interface FilterSidebarProps {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  rating: number | undefined;
  onUpdateFilter: (key: string, value: unknown) => void;
  onClear: () => void;
  className?: string;
  /** Unique prefix so desktop + mobile instances don't share radio/input ids */
  idPrefix?: string;
  facets?: CategoryFacet[];
  facetSelections?: Record<string, string[]>;
  onToggleFacet?: (filterKey: string, value: string) => void;
  /** Search results ignore the rating filter param entirely — hide it rather than let it look
   * interactive while doing nothing. */
  hideRatingFilter?: boolean;
}

export function FilterSidebar({
  minPrice,
  maxPrice,
  rating,
  onUpdateFilter,
  onClear,
  className,
  idPrefix = "filters",
  facets = [],
  facetSelections = {},
  onToggleFacet,
  hideRatingFilter = false,
}: FilterSidebarProps) {
  const { hasFilters, defaultOpen, accordionKey } =
    useFilterSidebarPresentation({
      minPrice,
      maxPrice,
      rating,
      facets,
      facetSelections,
    });

  return (
    <aside className={filterSidebarStyles.aside(className)}>
      <div className={filterSidebarStyles.container}>
        <FilterSidebarHeader hasFilters={hasFilters} onClear={onClear} />

        {hideRatingFilter ? (
          <p className={filterSidebarStyles.searchModeNote}>
            {LABELS.ratingFilterUnavailableDuringSearch}
          </p>
        ) : null}

        <Accordion
          key={accordionKey}
          type="multiple"
          defaultValue={defaultOpen}
        >
          <FilterSidebarPriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onUpdateFilter={onUpdateFilter}
          />

          <FilterSidebarFacetsList
            facets={facets}
            idPrefix={idPrefix}
            facetSelections={facetSelections}
            onToggle={onToggleFacet}
          />

          {hideRatingFilter ? null : (
            <FilterSidebarRatingFilter
              rating={rating}
              idPrefix={idPrefix}
              onUpdateFilter={onUpdateFilter}
            />
          )}
        </Accordion>
      </div>
    </aside>
  );
}
