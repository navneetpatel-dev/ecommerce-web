import type { CategoryFacet } from "@/shared/api/types";
import { filterSidebarStyles } from "../../../styles/filters/filterSidebar.styles";
import { FilterSidebarFacetOption } from "./FilterSidebarFacetOption.component";

interface FilterSidebarFacetOptionsListProps {
  facet: CategoryFacet;
  idPrefix: string;
  selectedValues: string[];
  onToggle?: (filterKey: string, value: string) => void;
}

export function FilterSidebarFacetOptionsList({
  facet,
  idPrefix,
  selectedValues,
  onToggle,
}: FilterSidebarFacetOptionsListProps) {
  const selected = new Set(selectedValues);

  return (
    <ul className={filterSidebarStyles.facetList}>
      {facet.options.map((option) => (
        <FilterSidebarFacetOption
          key={option.value}
          filterKey={facet.filterKey}
          option={option}
          idPrefix={idPrefix}
          checked={selected.has(option.value)}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}
