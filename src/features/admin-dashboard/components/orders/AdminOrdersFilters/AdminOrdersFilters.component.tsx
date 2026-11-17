"use client";

import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import {
  OrderStatusOptionsList,
  ALL_STATUSES_VALUE,
} from "./OrderStatusOptionsList.component";
import { useAdminOrdersFiltersHandlers } from "../../../hooks/orders/useAdminOrdersFiltersHandlers.hook";

export type AdminOrdersFiltersProps = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
};

export function AdminOrdersFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: AdminOrdersFiltersProps) {
  const { handleSearchChange, handleStatusChange } =
    useAdminOrdersFiltersHandlers({ onSearchChange, onStatusChange });

  const activeCount =
    (search.trim() ? 1 : 0) + (status && status !== ALL_STATUSES_VALUE ? 1 : 0);

  return (
    <CollapsibleTableFilters
      title={LABELS.orderFiltersTitle}
      activeCount={activeCount}
      onClear={onClear}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
        <FormFieldFrame
          label={LABELS.searchOrdersLabel}
          htmlFor="admin-orders-filter-search"
        >
          <SearchInput
            id="admin-orders-filter-search"
            value={search}
            onChange={handleSearchChange}
            onClear={() => onSearchChange("")}
            placeholder={LABELS.searchOrdersPlaceholder}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.orderStatus}
          htmlFor="admin-orders-filter-status"
        >
          <Select
            value={status || ALL_STATUSES_VALUE}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger id="admin-orders-filter-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <OrderStatusOptionsList />
            </SelectContent>
          </Select>
        </FormFieldFrame>
      </div>
    </CollapsibleTableFilters>
  );
}
