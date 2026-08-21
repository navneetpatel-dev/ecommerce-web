"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { VendorStrip } from "@/shared/components/VendorStrip";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  TableRowActions,
  TableRowAction,
} from "@/shared/components/TableRowActions";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { TableScrollShell } from "@/shared/components/TableScrollShell";
import { LABELS } from "@/shared/constants/labels";
import {
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_DATA_CELL_CLASS,
  TABLE_PINNED_LAYOUT_CLASS,
} from "@/shared/constants/table";
import { cn } from "@/shared/utils/cn";
import type { VendorInfo } from "@/shared/api/types";

export interface VendorOrder {
  id: string;
  subOrders?: Array<{
    id: string;
    vendor: VendorInfo;
    subtotal: number;
    status: string;
  }>;
}

interface SubOrderRow {
  orderId: string;
  subOrder: {
    id: string;
    vendor: VendorInfo;
    subtotal: number;
    status: string;
  };
}

interface VendorOrdersTableProps {
  orders: VendorOrder[];
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string) => void;
}

function flattenSubOrders(orders: VendorOrder[]): SubOrderRow[] {
  const rows: SubOrderRow[] = [];
  for (const order of orders) {
    for (const subOrder of order.subOrders ?? []) {
      rows.push({ orderId: order.id, subOrder });
    }
  }
  return rows;
}

function SubOrderActions({
  subOrderId,
  updatingId,
  onSetUpdatingId,
  onStatusChange,
}: {
  subOrderId: string;
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  return (
    <TableRowActions>
      {updatingId === subOrderId ? (
        <>
          <TableRowAction>
            <Select
              defaultValue="SHIPPED"
              onValueChange={(value) => onStatusChange(subOrderId, value)}
            >
              <SelectTrigger
                aria-label={LABELS.selectStatus}
                className="w-full min-w-[8.5rem] rounded-sm px-2 text-[0.8125rem]"
              >
                <SelectValue placeholder={LABELS.selectStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONFIRMED">{LABELS.confirm}</SelectItem>
                <SelectItem value="SHIPPED">
                  {LABELS.orderActionShip}
                </SelectItem>
                <SelectItem value="DELIVERED">
                  {LABELS.orderActionDeliver}
                </SelectItem>
                <SelectItem value="CANCELLED">{LABELS.cancel}</SelectItem>
              </SelectContent>
            </Select>
          </TableRowAction>
          <TableRowAction>
            <Button
              size="sm"
              variant="outline"
              className={tableMenuButtonClass("neutral")}
              onClick={() => onSetUpdatingId(null)}
            >
              {LABELS.cancel}
            </Button>
          </TableRowAction>
        </>
      ) : (
        <TableRowAction>
          <Button
            size="sm"
            variant="outline"
            className={tableMenuButtonClass("edit")}
            onClick={() => onSetUpdatingId(subOrderId)}
          >
            {LABELS.updateStatus}
          </Button>
        </TableRowAction>
      )}
    </TableRowActions>
  );
}

export function VendorOrdersTable({
  orders,
  updatingId,
  onSetUpdatingId,
  onStatusChange,
}: VendorOrdersTableProps) {
  const rows = flattenSubOrders(orders);

  return (
    <div className="space-y-4">
      <h2 className="text-[1.375rem] font-semibold text-ink">
        Order Management
      </h2>

      {rows.length === 0 ? (
        <div className="rounded-md border border-line bg-surface px-4 py-14 text-center text-ink-muted">
          No orders found
        </div>
      ) : (
        <>
          {/* Below lg: card list */}
          <ul className="space-y-3 lg:hidden">
            {rows.map(({ orderId, subOrder }) => (
              <li
                key={subOrder.id}
                className="rounded-md border border-line bg-surface p-4 shadow-[0_1px_0_rgba(15,23,42,0.03)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[0.8125rem] text-ink">
                      #{orderId.slice(0, 8)}
                    </p>
                    <div className="mt-2">
                      <VendorStrip vendor={subOrder.vendor} size="sm" />
                    </div>
                  </div>
                  <StatusBadge status={subOrder.status} />
                </div>
                <p className="mt-3 font-mono text-[0.9375rem] text-ink">
                  ₹{subOrder.subtotal}
                </p>
                <div className="mt-4 border-t border-line/80 pt-3">
                  <SubOrderActions
                    subOrderId={subOrder.id}
                    updatingId={updatingId}
                    onSetUpdatingId={onSetUpdatingId}
                    onStatusChange={onStatusChange}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* lg+: scroll + pinned actions */}
          <TableScrollShell desktopOnly>
            <Table
              scrollContainer={false}
              className={TABLE_PINNED_LAYOUT_CLASS}
            >
              <TableHeader>
                <TableRow>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    Order ID
                  </TableHead>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    Vendor
                  </TableHead>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    Subtotal
                  </TableHead>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    Status
                  </TableHead>
                  <TableHead className={TABLE_ACTIONS_HEAD_CLASS}>
                    {LABELS.actions}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ orderId, subOrder }) => (
                  <TableRow key={subOrder.id}>
                    <TableCell
                      className={cn(
                        TABLE_DATA_CELL_CLASS,
                        "font-mono text-[0.8125rem]",
                      )}
                    >
                      {orderId.slice(0, 8)}
                    </TableCell>
                    <TableCell className={TABLE_DATA_CELL_CLASS}>
                      <VendorStrip vendor={subOrder.vendor} size="sm" />
                    </TableCell>
                    <TableCell
                      className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}
                    >
                      ₹{subOrder.subtotal}
                    </TableCell>
                    <TableCell className={TABLE_DATA_CELL_CLASS}>
                      <StatusBadge status={subOrder.status} />
                    </TableCell>
                    <TableCell className={TABLE_ACTIONS_CELL_CLASS}>
                      <SubOrderActions
                        subOrderId={subOrder.id}
                        updatingId={updatingId}
                        onSetUpdatingId={onSetUpdatingId}
                        onStatusChange={onStatusChange}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScrollShell>
        </>
      )}
    </div>
  );
}
