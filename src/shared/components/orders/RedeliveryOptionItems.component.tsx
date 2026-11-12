import { SelectItem } from "@/shared/components/ui/select";
import type { RedeliveryOption } from "@/shared/utils/orders/redeliveryOptions";

/** Select items for the redelivery day or window list. */
export function RedeliveryOptionItems({
  options,
}: {
  options: RedeliveryOption<string>[];
}) {
  return (
    <>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </>
  );
}
