"use client";

import { CheckboxField } from "@/shared/components/forms/CheckboxField.component";
import { LABELS } from "@/shared/constants/labels";
import { filterSidebarStyles } from "../../../styles/filters/filterSidebar.styles";

interface FilterSidebarStockToggleProps {
  inStock: boolean;
  idPrefix: string;
  onUpdateFilter: (key: string, value: unknown) => void;
}

/** Hide sold-out products from the results (B-23). */
export function FilterSidebarStockToggle({
  inStock,
  idPrefix,
  onUpdateFilter,
}: FilterSidebarStockToggleProps) {
  const handleCheckedChange = (checked: boolean) =>
    onUpdateFilter("inStock", checked ? true : undefined);

  return (
    <CheckboxField
      id={`${idPrefix}-in-stock`}
      className={filterSidebarStyles.stockToggle}
      checked={inStock}
      onCheckedChange={handleCheckedChange}
      label={LABELS.inStockOnly}
    />
  );
}
