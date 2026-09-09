import { SelectItem } from "@/shared/components/ui/select";
import { ROLE_VALUES, ROLE_LABELS } from "@/shared/constants/labels";

export function BroadcastRoleOptions() {
  return (
    <>
      {ROLE_VALUES.map((value) => (
        <SelectItem key={value} value={value}>
          {ROLE_LABELS[value]}
        </SelectItem>
      ))}
    </>
  );
}
