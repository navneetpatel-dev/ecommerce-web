import { memo } from "react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { ProofOfDeliveryThumbnail } from "@/shared/components/ProofOfDeliveryThumbnail";
import { LABELS } from "@/shared/constants/labels";
import type { SubOrderRow } from "../../../types/orders/vendorOrders.types";
import { formatInr } from "../../../utils/orders/vendorOrderFormat";
import { VENDOR_ORDERS_TABLE_STYLES } from "../../../styles/orders/vendorOrdersTable.styles";

interface ShipmentCellProps {
  row: SubOrderRow;
}

export const ShipmentCell = memo(function ShipmentCell({
  row,
}: ShipmentCellProps) {
  const shipment = row.subOrder.shipment;
  if (!shipment) {
    return (
      <span className={VENDOR_ORDERS_TABLE_STYLES.mutedText}>
        {LABELS.notShippedYet}
      </span>
    );
  }

  const deliveryAgentName = shipment.deliveryAgent ? (
    <p className={VENDOR_ORDERS_TABLE_STYLES.mutedText}>
      {shipment.deliveryAgent.fullName}
    </p>
  ) : null;

  const hasCodAmount = shipment.codAmount != null;
  const codCollectedLabel = shipment.codCollected ? "(collected)" : "(due)";
  const codLine = hasCodAmount ? (
    <p className={VENDOR_ORDERS_TABLE_STYLES.mutedText}>
      COD: {formatInr(shipment.codAmount as number)} {codCollectedLabel}
    </p>
  ) : null;

  const proofLink = (
    <ProofOfDeliveryThumbnail url={shipment.proofOfDeliveryUrl} compact />
  );

  return (
    <div className={VENDOR_ORDERS_TABLE_STYLES.shipmentStack}>
      <StatusBadge status={shipment.status} />
      {deliveryAgentName}
      {codLine}
      {proofLink}
    </div>
  );
});
