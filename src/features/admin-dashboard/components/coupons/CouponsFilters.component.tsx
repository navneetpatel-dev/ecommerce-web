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
import { COUPON_STATUS_VALUES } from "@/shared/constants/statuses";
import { formatStatusLabel } from "@/shared/utils/formatting/formatStatus";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { COUPON_TYPES } from "../../constants/coupons/constants";
import { AdminVendorFilterSelect } from "../vendors/AdminVendorFilterSelect.component";
import { couponsFiltersStyles } from "../../styles/coupons/couponsFilters.styles";

export interface CouponsFiltersProps {
  search: string;
  status: string;
  type: string;
  vendorId?: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onVendorChange?: (value: string) => void;
  onClear: () => void;
}

const ALL = "__ALL__";
const fromChoice = (value: string) => (value === ALL ? "" : value);

export function CouponsFilters({
  search,
  status,
  type,
  vendorId = "",
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onVendorChange,
  onClear,
}: CouponsFiltersProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };
  const handleStatusChange = (value: string) =>
    onStatusChange(fromChoice(value));
  const handleTypeChange = (value: string) => onTypeChange(fromChoice(value));

  const activeCount = [search.trim(), status, type, vendorId].filter(
    Boolean,
  ).length;

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
      <div className={couponsFiltersStyles.grid}>
        <FormFieldFrame label={LABELS.search} htmlFor="coupons-filter-search">
          <Input
            id="coupons-filter-search"
            value={search}
            onChange={handleInputChange}
            placeholder={LABELS.searchCouponCode}
          />
        </FormFieldFrame>

        <FormFieldFrame label={LABELS.status} htmlFor="coupons-filter-status">
          <Select value={status || ALL} onValueChange={handleStatusChange}>
            <SelectTrigger id="coupons-filter-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{LABELS.allStatuses}</SelectItem>
              {COUPON_STATUS_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {formatStatusLabel(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>

        <FormFieldFrame label={LABELS.couponType} htmlFor="coupons-filter-type">
          <Select value={type || ALL} onValueChange={handleTypeChange}>
            <SelectTrigger id="coupons-filter-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{LABELS.allTypes}</SelectItem>
              {COUPON_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>

        {onVendorChange ? (
          <AdminVendorFilterSelect value={vendorId} onChange={onVendorChange} />
        ) : null}
      </div>
    </CollapsibleTableFilters>
  );
}
