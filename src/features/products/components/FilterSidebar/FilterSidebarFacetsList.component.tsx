import type { CategoryFacet } from "@/shared/api/types";
import { FilterSidebarFacetGroup } from "./FilterSidebarFacetGroup.component";

interface FilterSidebarFacetsListProps {
  facets: CategoryFacet[];
  idPrefix: string;
  facetSelections: Record<string, string[]>;
  onToggle?: (filterKey: string, value: string) => void;
}

export function FilterSidebarFacetsList({
  facets,
  idPrefix,
  facetSelections,
  onToggle,
}: FilterSidebarFacetsListProps) {
  return (
    <>
      {facets.map((facet) => (
        <FilterSidebarFacetGroup
          key={facet.id}
          facet={facet}
          idPrefix={idPrefix}
          selectedValues={facetSelections[facet.filterKey] ?? []}
          onToggle={onToggle}
        />
      ))}
    </>
  );
}
