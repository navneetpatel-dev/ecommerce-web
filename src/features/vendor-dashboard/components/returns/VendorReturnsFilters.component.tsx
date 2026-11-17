"use client";

import { type ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { formatStatusLabel } from "@/shared/utils/formatting/formatStatus";
import { LABELS } from "@/shared/constants/labels";
import { CollapsibleTableFilters } from "@/shared/components/filters";

export interface VendorReturnsFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

const ALL_STATUSES = "__ALL__";

export function VendorReturnsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: VendorReturnsFiltersProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleSelectChange = (value: string) => {
    onStatusChange(value === ALL_STATUSES ? "" : value);
  };

  const hasFilters = Boolean(search || status);
  const activeCount = (search.trim() ? 1 : 0) + (status ? 1 : 0);

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
        <FormFieldFrame
          label={LABELS.search}
          htmlFor="vendor-returns-filter-search"
        >
          <Input
            id="vendor-returns-filter-search"
            value={search}
            onChange={handleInputChange}
            placeholder="Search by return ID, product, reason..."
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.returnStatus}
          htmlFor="vendor-returns-filter-status"
        >
          <Select
            value={status || ALL_STATUSES}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger id="vendor-returns-filter-status">
              <SelectValue placeholder="All Return Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>All Return Statuses</SelectItem>
              {Object.values(RETURN_STATUS).map((s) => (
                <SelectItem key={s} value={s}>
                  {formatStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>

        {hasFilters && (
          <div className="flex items-end">
            <Button type="button" variant="outline" onClick={onClear}>
              {LABELS.clearFilters}
            </Button>
          </div>
        )}
      </div>
    </CollapsibleTableFilters>
  );
}
