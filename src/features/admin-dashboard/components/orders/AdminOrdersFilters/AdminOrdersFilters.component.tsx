"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { adminOrdersFiltersStyles } from "../../../styles/orders/adminOrdersFilters.styles";
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

  return (
    <FormSection title="Order Filters" columns={3}>
      <FormFieldFrame
        label="Search Orders"
        htmlFor="admin-orders-filter-search"
      >
        <Input
          id="admin-orders-filter-search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by Order ID, customer name or email..."
        />
      </FormFieldFrame>

      <FormFieldFrame label="Order Status" htmlFor="admin-orders-filter-status">
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

      <div className={adminOrdersFiltersStyles.clearButtonWrapper}>
        <Button type="button" variant="outline" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </FormSection>
  );
}
