import { CheckboxField } from "@/shared/components/CheckboxField.component";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { cn } from "@/shared/utils/cn";
import type { CategoryFacet } from "@/shared/api/types";

interface FilterSidebarFacetGroupProps {
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
  const selected = new Set(selectedValues);

  return (
    <AccordionItem value={facet.filterKey}>
      <AccordionTrigger>{facet.name}</AccordionTrigger>
      <AccordionContent>
        <ul className="space-y-2">
          {facet.options.map((option) => {
            const id = `${idPrefix}-${facet.filterKey}-${option.value}`;
            const checked = selected.has(option.value);
            return (
              <li key={option.value}>
                <CheckboxField
                  id={id}
                  checked={checked}
                  disabled={option.disabled && !checked}
                  onCheckedChange={() =>
                    onToggle?.(facet.filterKey, option.value)
                  }
                  className={cn(
                    "w-full gap-2.5 text-body-sm",
                    option.disabled && !checked && "text-ink-faint",
                  )}
                  labelClassName="flex items-center justify-between gap-2"
                  label={
                    <>
                      <span className="min-w-0 truncate capitalize">
                        {option.value}
                      </span>
                      <span className="shrink-0 tabular-nums text-ink-faint">
                        {option.count}
                      </span>
                    </>
                  }
                />
              </li>
            );
          })}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
