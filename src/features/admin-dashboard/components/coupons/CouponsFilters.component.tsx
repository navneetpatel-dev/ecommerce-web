"use client";

import { type ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { CollapsibleTableFilters } from "@/shared/components/filters";

export interface CouponsFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

const ALL_STATUSES = "__ALL__";

export function CouponsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: CouponsFiltersProps) {
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
        <FormFieldFrame label={LABELS.search} htmlFor="coupons-filter-search">
          <Input
            id="coupons-filter-search"
            value={search}
            onChange={handleInputChange}
            placeholder="Search by coupon code or offer name..."
          />
        </FormFieldFrame>

        <FormFieldFrame label={LABELS.status} htmlFor="coupons-filter-status">
          <Select
            value={status || ALL_STATUSES}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger id="coupons-filter-status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
      </div>
    </CollapsibleTableFilters>
  );
}
