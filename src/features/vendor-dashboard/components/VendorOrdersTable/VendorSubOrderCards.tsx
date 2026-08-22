"use client";

import { StatusBadge } from "@/shared/components/StatusBadge";
import { VendorStrip } from "@/shared/components/VendorStrip";
import type { SubOrderRow } from "../../types/vendorOrders.types";
import { formatInr, shortOrderId } from "./vendorOrderFormat";

interface VendorSubOrderCardsProps {
  rows: SubOrderRow[];
  updatingId: string | null;
  renderActions: (subOrderId: string) => React.ReactNode;
}

/** Below-lg card list for vendor sub-orders (Rule 3 split). */
export function VendorSubOrderCards(props: VendorSubOrderCardsProps) {
  const { rows, renderActions } = props;

  const renderCard = (row: SubOrderRow) => (
    <li
      key={row.subOrder.id}
      className="rounded-md border border-line bg-surface p-4 shadow-[0_1px_0_rgba(15,23,42,0.03)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[0.8125rem] text-ink">
            #{shortOrderId(row.orderId)}
          </p>
          <div className="mt-2">
            <VendorStrip vendor={row.subOrder.vendor} size="sm" />
          </div>
        </div>
        <StatusBadge status={row.subOrder.status} />
      </div>
      <p className="mt-3 font-mono text-[0.9375rem] text-ink">
        {formatInr(row.subOrder.subtotal)}
      </p>
      <div className="mt-4 border-t border-line/80 pt-3">
        {renderActions(row.subOrder.id)}
      </div>
    </li>
  );

  return <ul className="space-y-3 lg:hidden">{rows.map(renderCard)}</ul>;
}
