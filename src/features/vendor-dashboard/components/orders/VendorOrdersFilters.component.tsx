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
import { ORDER_STATUS } from "@/shared/constants/statuses";
import { formatStatusLabel } from "@/shared/utils/formatting/formatStatus";
import { LABELS } from "@/shared/constants/labels";
import { CollapsibleTableFilters } from "@/shared/components/filters";

export interface VendorOrdersFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

const ALL_STATUSES = "__ALL__";

export function VendorOrdersFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: VendorOrdersFiltersProps) {
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
          htmlFor="vendor-orders-filter-search"
        >
          <SearchInput
            id="vendor-orders-filter-search"
            value={search}
            onChange={handleInputChange}
            onClear={() => onSearchChange("")}
            placeholder="Search by order ID, item name, SKU, tracking..."
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.orderStatus}
          htmlFor="vendor-orders-filter-status"
        >
          <Select
            value={status || ALL_STATUSES}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger id="vendor-orders-filter-status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>All Statuses</SelectItem>
              {Object.values(ORDER_STATUS).map((s) => (
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
