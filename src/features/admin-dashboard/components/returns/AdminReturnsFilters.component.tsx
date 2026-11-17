"use client";

import type { ChangeEvent } from "react";
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
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { CollapsibleTableFilters } from "@/shared/components/filters";

export interface AdminReturnsFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

const RETURN_STATUS_LIST = Object.values(RETURN_STATUS);

export function AdminReturnsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: AdminReturnsFiltersProps) {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleStatusChange = (val: string) => {
    onStatusChange(val === "ALL" ? "" : val);
  };

  const activeCount =
    (search.trim() ? 1 : 0) + (status && status !== "ALL" ? 1 : 0);

  return (
    <CollapsibleTableFilters
      title={LABELS.returnsFiltersTitle}
      activeCount={activeCount}
      onClear={onClear}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-end">
        <FormFieldFrame
          label={LABELS.searchReturnsLabel}
          htmlFor="admin-returns-filter-search"
        >
          <Input
            id="admin-returns-filter-search"
            value={search}
            onChange={handleSearchChange}
            placeholder={LABELS.searchReturnsPlaceholder}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.returnStatus}
          htmlFor="admin-returns-filter-status"
        >
          <Select value={status || "ALL"} onValueChange={handleStatusChange}>
            <SelectTrigger id="admin-returns-filter-status">
              <SelectValue placeholder={LABELS.allReturnStatuses} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{LABELS.allReturnStatuses}</SelectItem>
              {RETURN_STATUS_LIST.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>
      </div>
    </CollapsibleTableFilters>
  );
}
