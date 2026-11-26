"use client";

import { InfiniteSingleSelect } from "@/shared/components/InfiniteSingleSelect";
import { FormFieldFrame } from "@/shared/components/forms";
import { useAdminVendorFilterSelect } from "../../hooks/vendors/useAdminVendorFilterSelect.hook";

interface AdminVendorFilterSelectProps {
  value: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  status?: string;
}

export function AdminVendorFilterSelect({
  value,
  onChange,
  label = "Vendor",
  placeholder = "All Vendors",
  status,
}: AdminVendorFilterSelectProps) {
  const { fetchPage, pinnedOption, handleChange, resetKey } =
    useAdminVendorFilterSelect({ value, onChange, status });

  return (
    <FormFieldFrame label={label}>
      <InfiniteSingleSelect
        value={value}
        onChange={handleChange}
        fetchPage={fetchPage}
        pinnedOption={pinnedOption}
        resetKey={resetKey}
        allowNone
        searchable
        noneLabel={placeholder}
        placeholder={placeholder}
        searchPlaceholder="Search vendor name or slug..."
        emptyMessage="No vendors found"
        pageSize={25}
      />
    </FormFieldFrame>
  );
}
