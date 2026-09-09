import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import type { CategoryFacet } from "@/shared/api/types";
import { FilterSidebarFacetOptionsList } from "./FilterSidebarFacetOptionsList.component";

export interface FilterSidebarFacetGroupProps {
  facet: CategoryFacet;
  idPrefix: string;
  selectedValues: string[];
  onToggle?: (filterKey: string, value: string) => void;
}

/** One collapsible facet (e.g. brand, size) with its checkbox option list. */
export function FilterSidebarFacetGroup({
  facet,
  idPrefix,
  selectedValues,
  onToggle,
}: FilterSidebarFacetGroupProps) {
  return (
    <AccordionItem value={facet.filterKey}>
      <AccordionTrigger>{facet.name}</AccordionTrigger>
      <AccordionContent>
        <FilterSidebarFacetOptionsList
          facet={facet}
          idPrefix={idPrefix}
          selectedValues={selectedValues}
          onToggle={onToggle}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
