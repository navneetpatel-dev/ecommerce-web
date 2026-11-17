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
import { VENDOR_STATUS } from "@/shared/constants/statuses";
import { formatStatusLabel } from "@/shared/utils/formatting/formatStatus";
import { LABELS } from "@/shared/constants/labels";
import { CollapsibleTableFilters } from "@/shared/components/filters";

export interface AdminVendorsFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

const ALL_STATUSES = "__ALL__";

export function AdminVendorsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: AdminVendorsFiltersProps) {
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
          htmlFor="admin-vendors-filter-search"
        >
          <SearchInput
            id="admin-vendors-filter-search"
            value={search}
            onChange={handleInputChange}
            onClear={() => onSearchChange("")}
            placeholder="Search by business name, slug, GSTIN, state..."
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.status}
          htmlFor="admin-vendors-filter-status"
        >
          <Select
            value={status || ALL_STATUSES}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger id="admin-vendors-filter-status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUSES}>All Statuses</SelectItem>
              {Object.values(VENDOR_STATUS).map((s) => (
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
