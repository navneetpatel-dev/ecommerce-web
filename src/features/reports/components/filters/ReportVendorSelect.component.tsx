"use client";

import { LABELS } from "@/shared/constants/labels";
import { AdminVendorFilterSelect } from "@/features/admin-dashboard";

interface ReportVendorSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ReportVendorSelect({
  value,
  onChange,
  disabled = false,
}: ReportVendorSelectProps) {
  return (
    <AdminVendorFilterSelect
      value={value}
      onChange={disabled ? undefined : onChange}
      label={LABELS.reportVendor}
      placeholder={LABELS.allVendors}
    />
  );
}
