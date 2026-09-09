import { SelectItem } from "@/shared/components/ui/select";
import { VENDOR_ENTITY_TYPE_VALUES } from "@/shared/constants/statuses";
import { vendorEntityTypeLabel } from "@/shared/utils/formatting/vendorEntityTypeLabel";

export function VendorEntityTypeOptions() {
  return (
    <>
      {VENDOR_ENTITY_TYPE_VALUES.map((value) => (
        <SelectItem key={value} value={value}>
          {vendorEntityTypeLabel(value)}
        </SelectItem>
      ))}
    </>
  );
}
