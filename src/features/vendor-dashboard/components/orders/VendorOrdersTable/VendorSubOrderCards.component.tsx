"use client";

import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import type { SubOrderRow } from "../../../types/orders/vendorOrders.types";
import { formatInr } from "../../../utils/orders/vendorOrderFormat";
import { VendorPackingSlipDialog } from "./VendorPackingSlipDialog.component";
import { VENDOR_ORDERS_TABLE_STYLES } from "../../../styles/orders/vendorOrdersTable.styles";

interface VendorSubOrderCardsProps {
  rows: SubOrderRow[];
  updatingId: string | null;
  renderActions: (
    subOrderId: string,
    status: string,
    canDownloadInvoice: boolean,
  ) => React.ReactNode;
}

/** Below-lg card list for vendor sub-orders (Rule 3 split). */
export function VendorSubOrderCards(props: VendorSubOrderCardsProps) {
  const { rows, renderActions } = props;

  const renderCard = (row: SubOrderRow) => {
    const refCode = (
      row.subOrder.orderReference ?? row.subOrder.orderId.slice(0, 8)
    )
      .replace(/^#/, "")
      .toUpperCase();
    return (
      <li key={row.subOrder.id} className={VENDOR_ORDERS_TABLE_STYLES.cardItem}>
        <div className={VENDOR_ORDERS_TABLE_STYLES.cardHeader}>
          <div className={VENDOR_ORDERS_TABLE_STYLES.cardHeaderLeft}>
            <p className={VENDOR_ORDERS_TABLE_STYLES.cardOrderNum}>
              {`Order #${refCode}`}
            </p>
            <p className="text-[11px] text-ink-muted">
              {row.subOrder.taxInvoiceNumber ??
                LABELS.taxInvoiceAwaitingDispatch}
            </p>
          </div>
          <StatusBadge status={row.subOrder.status} />
        </div>
        <div className="my-2">
          <VendorPackingSlipDialog subOrder={row.subOrder} />
        </div>
        <p className={VENDOR_ORDERS_TABLE_STYLES.cardSubtotal}>
          {formatInr(row.subOrder.subtotal)}
        </p>
        {row.subOrder.shipment && (
          <div className={VENDOR_ORDERS_TABLE_STYLES.cardShipmentWrap}>
            <StatusBadge status={row.subOrder.shipment.status} />
            {row.subOrder.shipment.codAmount != null && (
              <p className={VENDOR_ORDERS_TABLE_STYLES.mutedText}>
                COD: {formatInr(row.subOrder.shipment.codAmount)}{" "}
                {row.subOrder.shipment.codCollected ? "(collected)" : "(due)"}
              </p>
            )}
          </div>
        )}
        {row.subOrder.returnRequests?.length ? (
          <div className={VENDOR_ORDERS_TABLE_STYLES.cardReturnsWrap}>
            {row.subOrder.returnRequests.map((returnRequest) => (
              <div
                key={returnRequest.id}
                className={VENDOR_ORDERS_TABLE_STYLES.returnRow}
              >
                <StatusBadge status={returnRequest.status} />
              </div>
            ))}
          </div>
        ) : null}
        <div className={VENDOR_ORDERS_TABLE_STYLES.cardActionsWrap}>
          {renderActions(
            row.subOrder.id,
            row.subOrder.status,
            Boolean(row.subOrder.taxInvoiceNumber),
          )}
        </div>
      </li>
    );
  };

  return (
    <ul className={VENDOR_ORDERS_TABLE_STYLES.cardList}>
      {rows.map(renderCard)}
    </ul>
  );
}
