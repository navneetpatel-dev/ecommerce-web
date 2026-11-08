"use client";

import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { COUPON_STATUS_VALUES } from "@/shared/constants/statuses";
import { COUPON_TYPES } from "../../../constants/coupons/constants";
import type { CouponFilters } from "../../../hooks/coupons/useCouponFilters.hook";
import { couponDialogStyles as styles } from "../../../styles/coupons/couponDialogs.styles";

export function CouponTableFilters({ filters }: { filters: CouponFilters }) {
  return (
    <div className={styles.filters}>
      <Input
        value={filters.search}
        onChange={filters.onSearchChange}
        placeholder={LABELS.searchCouponCode}
        aria-label={LABELS.searchCouponCode}
        className={styles.searchInput}
      />
      <Select value={filters.status} onValueChange={filters.onStatusChange}>
        <SelectTrigger
          aria-label={LABELS.status}
          className={styles.filterSelect}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{LABELS.allStatuses}</SelectItem>
          {COUPON_STATUS_VALUES.map((value) => (
            <SelectItem key={value} value={value}>
              {value.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.type} onValueChange={filters.onTypeChange}>
        <SelectTrigger
          aria-label={LABELS.couponType}
          className={styles.filterSelect}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{LABELS.allTypes}</SelectItem>
          {COUPON_TYPES.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
