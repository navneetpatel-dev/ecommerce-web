import type { SubOrder } from "@/shared/api/types";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { VendorGroupHeader } from "@/shared/components/orders/VendorGroupHeader.component";
import { LABELS } from "@/shared/constants/labels";
import { SUB_ORDER_CARD_STYLES } from "../../../styles/sub-order/subOrderCard.styles";

interface SubOrderCardHeaderProps {
  vendorName: string;
  vendorId?: string | null;
  itemCount: number;
  status: SubOrder["status"];
  cancellationReason?: string | null;
  cancelledByRole?: string | null;
  className?: string;
}

export function SubOrderCardHeader({
  vendorName,
  vendorId,
  itemCount,
  status,
  cancellationReason,
  cancelledByRole,
  className,
}: SubOrderCardHeaderProps) {
  const isCancelled = status === "CANCELLED";
  const actorLabel =
    cancelledByRole === "VENDOR"
      ? "Seller"
      : cancelledByRole === "ADMIN"
        ? "Support"
        : cancelledByRole === "CUSTOMER"
          ? "Customer"
          : null;

  return (
    <div>
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
      {isCancelled && (actorLabel || cancellationReason) && (
        <div className="mt-1 mb-2 rounded bg-amber-50 px-2.5 py-1.5 text-xs text-amber-900 border border-amber-200">
          <span className="font-semibold">
            {actorLabel ? `Cancelled by ${actorLabel}` : "Cancelled"}
          </span>
          {cancellationReason && (
            <span className="text-amber-800">
              {" "}
              · Reason: {cancellationReason}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
