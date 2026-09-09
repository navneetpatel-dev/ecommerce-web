import type { SubOrder } from "@/shared/api/types";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { VendorGroupHeader } from "@/shared/components/VendorGroupHeader.component";
import { LABELS } from "@/shared/constants/labels";
import { SUB_ORDER_CARD_STYLES } from "../../../styles/sub-order/subOrderCard.styles";

interface SubOrderCardHeaderProps {
  vendorName: string;
  vendorId?: string | null;
  itemCount: number;
  status: SubOrder["status"];
  className?: string;
}

export function SubOrderCardHeader({
  vendorName,
  vendorId,
  itemCount,
  status,
  className,
}: SubOrderCardHeaderProps) {
  return (
    <VendorGroupHeader
      vendorName={vendorName}
      vendorId={vendorId}
      count={itemCount}
      as="h2"
      className={className}
      trailing={
        <div className={SUB_ORDER_CARD_STYLES.shipmentBadgeRow}>
          <span className={SUB_ORDER_CARD_STYLES.shipmentLabel}>
            {LABELS.shipment}
          </span>
          <StatusBadge status={status} />
        </div>
      }
    />
  );
}
