"use client";

import { useState } from "react";
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
} from "@/shared/components/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import { reportsEngineApi } from "@/features/reports";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  SUB_ORDER_STATUS_CONFIRMED,
  SUB_ORDER_STATUS_SHIPPED,
  SUB_ORDER_STATUS_CANCELLED,
} from "./subOrderStatuses";
import { ShipTrackingNumberFields } from "./ShipTrackingNumberFields.component";
import { VENDOR_ORDERS_TABLE_STYLES } from "./vendorOrdersTable.styles";

interface SubOrderActionsProps {
  subOrderId: string;
  canDownloadInvoice?: boolean;
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string, trackingId?: string) => void;
}

const DEFAULT_NEXT_STATUS = SUB_ORDER_STATUS_SHIPPED;

/** Inline status editor for a vendor sub-order row. */
export function SubOrderActions(props: SubOrderActionsProps) {
  const {
    subOrderId,
    canDownloadInvoice = false,
    updatingId,
    onSetUpdatingId,
    onStatusChange,
  } = props;
  const isEditing = updatingId === subOrderId;
  const [invoicePending, setInvoicePending] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [pendingShipment, setPendingShipment] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  const handleStatusSelect = (value: string) => {
    if (value === SUB_ORDER_STATUS_SHIPPED) {
      setPendingShipment(true);
      return;
    }
    onStatusChange(subOrderId, value);
  };

  const confirmShipment = () => {
    const trimmed = trackingId.trim();
    if (!trimmed) return;
    onStatusChange(subOrderId, SUB_ORDER_STATUS_SHIPPED, trimmed);
  };

  const startEditing = () => {
    onSetUpdatingId(subOrderId);
  };

  const cancelEditing = () => {
    setPendingShipment(false);
    setTrackingId("");
    onSetUpdatingId(null);
  };

  const downloadInvoice = async () => {
    setInvoicePending(true);
    setInvoiceError(null);
    try {
      await reportsEngineApi.vendorSubOrderInvoice(subOrderId);
    } catch (err) {
      setInvoiceError(getApiErrorMessage(err, LABELS.genericActionFailed));
    } finally {
      setInvoicePending(false);
    }
  };

  if (!isEditing) {
    return (
      <div className={VENDOR_ORDERS_TABLE_STYLES.actionsRoot}>
        <TableRowActions>
          {canDownloadInvoice ? (
            <TableRowAction>
              <Button
                size="sm"
                variant="outline"
                className={tableMenuButtonClass("neutral")}
                loading={invoicePending}
                onClick={() => void downloadInvoice()}
              >
                {LABELS.downloadTaxInvoice}
              </Button>
            </TableRowAction>
          ) : null}
          <TableRowAction>
            <Button
              size="sm"
              variant="outline"
              className={tableMenuButtonClass("edit")}
              onClick={startEditing}
            >
              {LABELS.updateStatus}
            </Button>
          </TableRowAction>
        </TableRowActions>
        {invoiceError ? (
          <p role="alert" className={VENDOR_ORDERS_TABLE_STYLES.actionsError}>
            {invoiceError}
          </p>
        ) : null}
      </div>
    );
  }

  if (pendingShipment) {
    return (
      <ShipTrackingNumberFields
        trackingId={trackingId}
        onTrackingIdChange={setTrackingId}
        onConfirm={confirmShipment}
        onCancel={cancelEditing}
      />
    );
  }

  return (
    <TableRowActions>
      <TableRowAction>
        <Select
          defaultValue={DEFAULT_NEXT_STATUS}
          onValueChange={handleStatusSelect}
        >
          <SelectTrigger
            aria-label={LABELS.selectStatus}
            className={VENDOR_ORDERS_TABLE_STYLES.actionsSelect}
          >
            <SelectValue placeholder={LABELS.selectStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SUB_ORDER_STATUS_CONFIRMED}>
              {LABELS.confirm}
            </SelectItem>
            <SelectItem value={SUB_ORDER_STATUS_SHIPPED}>
              {LABELS.orderActionShip}
            </SelectItem>
            <SelectItem value={SUB_ORDER_STATUS_CANCELLED}>
              {LABELS.cancel}
            </SelectItem>
          </SelectContent>
        </Select>
      </TableRowAction>
      <TableRowAction>
        <Button
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("neutral")}
          onClick={cancelEditing}
        >
          {LABELS.cancel}
        </Button>
      </TableRowAction>
    </TableRowActions>
  );
}
