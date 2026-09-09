"use client";

import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import type { SubOrderRow } from "../../types/vendorOrders.types";
import { formatInr, shortOrderId } from "./vendorOrderFormat";
import { VENDOR_ORDERS_TABLE_STYLES } from "./vendorOrdersTable.styles";

interface VendorSubOrderCardsProps {
  rows: SubOrderRow[];
  updatingId: string | null;
  renderActions: (
    subOrderId: string,
    canDownloadInvoice: boolean,
  ) => React.ReactNode;
}

/** Below-lg card list for vendor sub-orders (Rule 3 split). */
export function VendorSubOrderCards(props: VendorSubOrderCardsProps) {
  const { rows, renderActions } = props;

  const renderCard = (row: SubOrderRow) => (
    <li key={row.subOrder.id} className={VENDOR_ORDERS_TABLE_STYLES.cardItem}>
      <div className={VENDOR_ORDERS_TABLE_STYLES.cardHeader}>
        <div className={VENDOR_ORDERS_TABLE_STYLES.cardHeaderLeft}>
          <p className={VENDOR_ORDERS_TABLE_STYLES.cardOrderNum}>
            #{shortOrderId(row.orderId)}
          </p>
          <div className={VENDOR_ORDERS_TABLE_STYLES.cardBadgeWrap}>
            <VendorStrip vendor={row.subOrder.vendor} size="sm" />
          </div>
        </div>
        <StatusBadge status={row.subOrder.status} />
      </div>
      <p className={VENDOR_ORDERS_TABLE_STYLES.cardSubtotal}>
        {formatInr(row.subOrder.subtotal)}
      </p>
      {row.subOrder.shipment && (
        <div className={VENDOR_ORDERS_TABLE_STYLES.cardShipmentWrap}>
          <StatusBadge status={row.subOrder.shipment.status} />
          {row.subOrder.shipment.deliveryAgent && (
            <p className={VENDOR_ORDERS_TABLE_STYLES.mutedText}>
              {row.subOrder.shipment.deliveryAgent.fullName}
            </p>
          )}
          {row.subOrder.shipment.codAmount != null && (
            <p className={VENDOR_ORDERS_TABLE_STYLES.mutedText}>
              COD: {formatInr(row.subOrder.shipment.codAmount)}{" "}
              {row.subOrder.shipment.codCollected ? "(collected)" : "(due)"}
            </p>
          )}
          {row.subOrder.shipment.proofOfDeliveryUrl && (
            <a
              href={row.subOrder.shipment.proofOfDeliveryUrl}
              target="_blank"
              rel="noreferrer"
              className={VENDOR_ORDERS_TABLE_STYLES.proofLink}
            >
              View proof photo
            </a>
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
              {returnRequest.deliveryAgent && (
                <p className={VENDOR_ORDERS_TABLE_STYLES.mutedText}>
                  {returnRequest.deliveryAgent.fullName}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null}
      <div className={VENDOR_ORDERS_TABLE_STYLES.cardActionsWrap}>
        {renderActions(row.subOrder.id, Boolean(row.subOrder.taxInvoiceNumber))}
      </div>
    </li>
  );

  return (
    <ul className={VENDOR_ORDERS_TABLE_STYLES.cardList}>
      {rows.map(renderCard)}
    </ul>
  );
}
