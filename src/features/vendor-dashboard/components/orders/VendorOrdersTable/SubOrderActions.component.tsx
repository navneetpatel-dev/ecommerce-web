"use client";

import { CircleX, Download, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";
import { AdminConfirmAction } from "@/features/admin-dashboard";
import { SUB_ORDER_STATUS_OPTION_LABELS } from "../../../constants/orders/subOrderStatuses";
import { useSubOrderActions } from "../../../hooks/orders/useSubOrderActions.hook";
import { useSubOrderEditorFocus } from "../../../hooks/orders/useSubOrderEditorFocus.hook";
import { ShipTrackingNumberFields } from "./ShipTrackingNumberFields.component";
import { SubOrderStatusOptions } from "./SubOrderStatusOptions.component";
import { VENDOR_ORDERS_TABLE_STYLES } from "../../../styles/orders/vendorOrdersTable.styles";

interface SubOrderActionsProps {
  subOrderId: string;
  status: string;
  canDownloadInvoice?: boolean;
  updatingId: string | null;
  statusError?: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

/**
 * Inline status editor for a vendor sub-order row. Only the moves the backend accepts
 * from the current status are offered, and cancelling (restock + refund, irreversible)
 * goes through a confirmation dialog. Ship always opens the tracking fields on the row:
 * a select whose current value is already Ship would not fire a change.
 */
export function SubOrderActions(props: SubOrderActionsProps) {
  const { canDownloadInvoice = false, statusError = null } = props;
  const actions = useSubOrderActions(props);
  const rootRef = useSubOrderEditorFocus(actions.isEditing);
  const showTracking = actions.pendingShipment || actions.shipOnly;

  const error = statusError ? (
    <p role="alert" className={VENDOR_ORDERS_TABLE_STYLES.actionsError}>
      {statusError}
    </p>
  ) : null;

  if (!actions.isEditing) {
    return (
      <div ref={rootRef} className={VENDOR_ORDERS_TABLE_STYLES.actionsRoot}>
        <TableRowActions>
          {canDownloadInvoice ? (
            <RowActionButton
              icon={Download}
              label={LABELS.downloadTaxInvoice}
              loading={actions.invoicePending}
              onClick={actions.handleDownloadInvoice}
            />
          ) : null}
          {actions.canEditStatus ? (
            <RowActionButton
              kind="edit"
              icon={Pencil}
              label={LABELS.updateStatus}
              onClick={actions.startEditing}
            />
          ) : null}
          {actions.canCancel ? (
            <AdminConfirmAction
              label={LABELS.cancelSubOrder}
              icon={CircleX}
              tone="danger"
              dialogVariant="danger"
              title={LABELS.confirmCancelSubOrderTitle}
              description={LABELS.confirmCancelSubOrderBody}
              onConfirm={actions.confirmCancel}
            />
          ) : null}
        </TableRowActions>
        {actions.invoiceError ? (
          <p role="alert" className={VENDOR_ORDERS_TABLE_STYLES.actionsError}>
            {actions.invoiceError}
          </p>
        ) : null}
        {error}
      </div>
    );
  }

  if (showTracking) {
    return (
      <div ref={rootRef} className={VENDOR_ORDERS_TABLE_STYLES.actionsRoot}>
        <ShipTrackingNumberFields
          trackingId={actions.trackingId}
          onTrackingIdChange={actions.setTrackingId}
          onConfirm={actions.confirmShipment}
          onCancel={actions.cancelEditing}
        />
        {error}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={VENDOR_ORDERS_TABLE_STYLES.editorRoot}>
      <div className={VENDOR_ORDERS_TABLE_STYLES.editorActions}>
        {actions.otherStatuses.length > 0 ? (
          <Select onValueChange={actions.handleStatusSelect}>
            <SelectTrigger
              aria-label={LABELS.selectStatus}
              className={VENDOR_ORDERS_TABLE_STYLES.actionsSelect}
            >
              <SelectValue placeholder={LABELS.selectStatus} />
            </SelectTrigger>
            <SelectContent>
              <SubOrderStatusOptions statuses={actions.otherStatuses} />
            </SelectContent>
          </Select>
        ) : null}
        {actions.canShip ? (
          <Button size="sm" variant="outline" onClick={actions.beginShipment}>
            {SUB_ORDER_STATUS_OPTION_LABELS.SHIPPED}
          </Button>
        ) : null}
        <Button size="sm" variant="outline" onClick={actions.cancelEditing}>
          {LABELS.close}
        </Button>
      </div>
      {error}
    </div>
  );
}
