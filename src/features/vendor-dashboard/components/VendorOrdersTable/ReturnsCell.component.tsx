import { memo } from "react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import type { SubOrderRow } from "../../types/vendorOrders.types";
import { VENDOR_ORDERS_TABLE_STYLES } from "./vendorOrdersTable.styles";

interface ReturnsCellProps {
  row: SubOrderRow;
}

export const ReturnsCell = memo(function ReturnsCell({
  row,
}: ReturnsCellProps) {
  const returnRequests = row.subOrder.returnRequests ?? [];
  if (returnRequests.length === 0) {
    return (
      <span className={VENDOR_ORDERS_TABLE_STYLES.mutedText}>
        {LABELS.noReturnOrExchange}
      </span>
    );
  }

  return (
    <div className={VENDOR_ORDERS_TABLE_STYLES.returnsStack}>
      {returnRequests.map((returnRequest) => {
        const agentName = returnRequest.deliveryAgent ? (
          <p className={VENDOR_ORDERS_TABLE_STYLES.mutedText}>
            {returnRequest.deliveryAgent.fullName}
          </p>
        ) : null;

        return (
          <div
            key={returnRequest.id}
            className={VENDOR_ORDERS_TABLE_STYLES.returnRow}
          >
            <StatusBadge status={returnRequest.status} />
            {agentName}
          </div>
        );
      })}
    </div>
  );
});
