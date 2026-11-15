"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { useAdminVendorsList } from "@/features/admin-dashboard";

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
  const { data: vendorsData } = useAdminVendorsList();
  const vendors = vendorsData?.items ?? [];

  const handleSelect = (nextValue: string) => {
    onChange(nextValue === "all" ? "" : nextValue);
  };

  return (
    <FormFieldFrame label={LABELS.reportVendor} htmlFor="report-vendor">
      <Select
        value={value || "all"}
        onValueChange={handleSelect}
        disabled={disabled}
      >
        <SelectTrigger id="report-vendor">
          <SelectValue placeholder={LABELS.allVendors} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{LABELS.allVendors}</SelectItem>
          {vendors.map((vendor) => (
            <SelectItem key={vendor.id} value={vendor.id}>
              {vendor.businessName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
