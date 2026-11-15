"use client";

import type { ChangeEvent } from "react";
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
import { LABELS } from "@/shared/constants/labels";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { adminOrdersFiltersStyles } from "../../styles/orders/adminOrdersFilters.styles";

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

  return (
    <FormSection title={LABELS.returnsFiltersTitle} columns={3}>
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

      <div className={adminOrdersFiltersStyles.clearButtonWrapper}>
        <Button type="button" variant="outline" onClick={onClear}>
          {LABELS.clearFilters}
        </Button>
      </div>
    </FormSection>
  );
}
