"use client";

import { SelectItem } from "@/shared/components/ui/select";
import { SUB_ORDER_STATUS_OPTION_LABELS } from "../../../constants/orders/subOrderStatuses";

interface SubOrderStatusOptionsProps {
  statuses: readonly string[];
}

/** The status menu items a vendor may pick for one sub-order. */
export function SubOrderStatusOptions({
  statuses,
}: SubOrderStatusOptionsProps) {
  const renderOption = (status: string) => (
    <SelectItem key={status} value={status}>
      {SUB_ORDER_STATUS_OPTION_LABELS[status] ?? status}
    </SelectItem>
  );

  return <>{statuses.map(renderOption)}</>;
}
