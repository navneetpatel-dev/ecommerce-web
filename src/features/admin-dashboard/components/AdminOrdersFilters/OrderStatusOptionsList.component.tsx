import { SelectItem } from "@/shared/components/ui/select";
import { ORDER_STATUS } from "@/shared/constants/statuses";

const ALL_STATUSES_VALUE = "__all_statuses__";
const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUS);

export function OrderStatusOptionsList() {
  return (
    <>
      <SelectItem value={ALL_STATUSES_VALUE}>All Statuses</SelectItem>
      {ORDER_STATUS_OPTIONS.map((val) => (
        <SelectItem key={val} value={val}>
          {val}
        </SelectItem>
      ))}
    </>
  );
}

export { ALL_STATUSES_VALUE };
