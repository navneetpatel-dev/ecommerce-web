import { useCallback } from "react";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import type { CategoryFacetOption } from "@/shared/api/types";
import { filterSidebarStyles } from "./filterSidebar.styles";

interface FilterSidebarFacetOptionProps {
  filterKey: string;
  option: CategoryFacetOption;
  idPrefix: string;
  checked: boolean;
  onToggle?: (filterKey: string, value: string) => void;
}

export function FilterSidebarFacetOption({
  filterKey,
  option,
  idPrefix,
  checked,
  onToggle,
}: FilterSidebarFacetOptionProps) {
  const id = `${idPrefix}-${filterKey}-${option.value}`;
  const isDisabled = Boolean(option.disabled && !checked);

  const handleCheckedChange = useCallback(() => {
    onToggle?.(filterKey, option.value);
  }, [filterKey, onToggle, option.value]);

  return (
    <li>
      <CheckboxField
        id={id}
        checked={checked}
        disabled={isDisabled}
        onCheckedChange={handleCheckedChange}
        className={filterSidebarStyles.checkboxField(
          Boolean(option.disabled),
          checked,
        )}
        labelClassName={filterSidebarStyles.checkboxLabel}
        label={
          <>
            <span className={filterSidebarStyles.optionValue}>
              {option.value}
            </span>
            <span className={filterSidebarStyles.optionCount}>
              {option.count}
            </span>
          </>
        }
      />
    </li>
  );
}
