"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  TableRowActions,
  TableRowAction,
} from "@/shared/components/DataTable/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import { AdminConfirmAction } from "@/features/admin-dashboard";
import { SUB_ORDER_STATUS_SHIPPED } from "../../../constants/orders/subOrderStatuses";
import { useSubOrderActions } from "../../../hooks/orders/useSubOrderActions.hook";
import { ShipTrackingNumberFields } from "./ShipTrackingNumberFields.component";
import { SubOrderStatusOptions } from "./SubOrderStatusOptions.component";
import { VENDOR_ORDERS_TABLE_STYLES } from "../../../styles/orders/vendorOrdersTable.styles";

interface SubOrderActionsProps {
  subOrderId: string;
  status: string;
  canDownloadInvoice?: boolean;
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

const DEFAULT_NEXT_STATUS = SUB_ORDER_STATUS_SHIPPED;

/**
 * Inline status editor for a vendor sub-order row. Only the moves the backend accepts
 * from the current status are offered, and cancelling (restock + refund, irreversible)
 * goes through a confirmation dialog.
 */
export function SubOrderActions(props: SubOrderActionsProps) {
  const { canDownloadInvoice = false } = props;
  const actions = useSubOrderActions(props);

  if (!actions.isEditing) {
    return (
      <div className={VENDOR_ORDERS_TABLE_STYLES.actionsRoot}>
        <TableRowActions>
          {canDownloadInvoice ? (
            <TableRowAction>
              <Button
                size="sm"
                variant="outline"
                className={tableMenuButtonClass("neutral")}
                loading={actions.invoicePending}
                onClick={actions.handleDownloadInvoice}
              >
                {LABELS.downloadTaxInvoice}
              </Button>
            </TableRowAction>
          ) : null}
          {actions.canEditStatus ? (
            <TableRowAction>
              <Button
                size="sm"
                variant="outline"
                className={tableMenuButtonClass("edit")}
                onClick={actions.startEditing}
              >
                {LABELS.updateStatus}
              </Button>
            </TableRowAction>
          ) : null}
          {actions.canCancel ? (
            <TableRowAction>
              <AdminConfirmAction
                label={LABELS.cancelSubOrder}
                tone="danger"
                dialogVariant="danger"
                title={LABELS.confirmCancelSubOrderTitle}
                description={LABELS.confirmCancelSubOrderBody}
                onConfirm={actions.confirmCancel}
              />
            </TableRowAction>
          ) : null}
        </TableRowActions>
        {actions.invoiceError ? (
          <p role="alert" className={VENDOR_ORDERS_TABLE_STYLES.actionsError}>
            {actions.invoiceError}
          </p>
        ) : null}
      </div>
    );
  }

  if (actions.pendingShipment) {
    return (
      <ShipTrackingNumberFields
        trackingId={actions.trackingId}
        onTrackingIdChange={actions.setTrackingId}
        onConfirm={actions.confirmShipment}
        onCancel={actions.cancelEditing}
      />
    );
  }

  return (
    <TableRowActions>
      <TableRowAction>
        <Select
          defaultValue={DEFAULT_NEXT_STATUS}
          onValueChange={actions.handleStatusSelect}
        >
          <SelectTrigger
            aria-label={LABELS.selectStatus}
            className={VENDOR_ORDERS_TABLE_STYLES.actionsSelect}
          >
            <SelectValue placeholder={LABELS.selectStatus} />
          </SelectTrigger>
          <SelectContent>
            <SubOrderStatusOptions statuses={actions.nextStatuses} />
          </SelectContent>
        </Select>
      </TableRowAction>
      <TableRowAction>
        <Button
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("neutral")}
          onClick={actions.cancelEditing}
        >
          {LABELS.close}
        </Button>
      </TableRowAction>
    </TableRowActions>
  );
}
