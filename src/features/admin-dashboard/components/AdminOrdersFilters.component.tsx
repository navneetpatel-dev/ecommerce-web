"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { ORDER_STATUS } from "@/shared/constants/statuses";

const ALL_STATUSES_VALUE = "__all_statuses__";
const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUS);

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
  return (
    <FormSection title="Order Filters" columns={3}>
      <FormFieldFrame
        label="Search Orders"
        htmlFor="admin-orders-filter-search"
      >
        <Input
          id="admin-orders-filter-search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Order ID, customer name or email..."
        />
      </FormFieldFrame>

      <FormFieldFrame label="Order Status" htmlFor="admin-orders-filter-status">
        <Select
          value={status || ALL_STATUSES_VALUE}
          onValueChange={(value) =>
            onStatusChange(value === ALL_STATUSES_VALUE ? "" : value)
          }
        >
          <SelectTrigger id="admin-orders-filter-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES_VALUE}>All Statuses</SelectItem>
            {ORDER_STATUS_OPTIONS.map((val) => (
              <SelectItem key={val} value={val}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>

      <div className="flex items-end">
        <Button type="button" variant="outline" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </FormSection>
  );
}
