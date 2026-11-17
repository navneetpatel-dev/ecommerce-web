"use client";

import { type ChangeEvent } from "react";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { formatStatusLabel } from "@/shared/utils/formatting/formatStatus";
import { LABELS } from "@/shared/constants/labels";
import { CollapsibleTableFilters } from "@/shared/components/filters";

export interface AdminProductsFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

const ALL_STATUSES = "__ALL__";

export function AdminProductsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: AdminProductsFiltersProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleSelectChange = (value: string) => {
    onStatusChange(value === ALL_STATUSES ? "" : value);
  };

  const activeCount = (search.trim() ? 1 : 0) + (status ? 1 : 0);

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
        <FormFieldFrame
          label={LABELS.search}
          htmlFor="admin-products-filter-search"
        >
          <SearchInput
            id="admin-products-filter-search"
            value={search}
            onChange={handleInputChange}
            onClear={() => onSearchChange("")}
            placeholder="Search by product name, SKU, slug..."
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.status}
          htmlFor="admin-products-filter-status"
        >
          <Select
            value={status || ALL_STATUSES}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger id="admin-products-filter-status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>All Statuses</SelectItem>
              {Object.values(PRODUCT_STATUS).map((s) => (
                <SelectItem key={s} value={s}>
                  {formatStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>
      </div>
    </CollapsibleTableFilters>
  );
}
