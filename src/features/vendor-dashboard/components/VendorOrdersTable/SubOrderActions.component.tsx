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
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import { reportsEngineApi } from "@/features/reports";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  SUB_ORDER_STATUS_CONFIRMED,
  SUB_ORDER_STATUS_SHIPPED,
  SUB_ORDER_STATUS_CANCELLED,
} from "./subOrderStatuses";

interface SubOrderActionsProps {
  subOrderId: string;
  canDownloadInvoice?: boolean;
  updatingId: string | null;
  onSetUpdatingId: (id: string | null) => void;
  onStatusChange: (id: string, status: string) => void;
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

  const handleStatusSelect = (value: string) => {
    onStatusChange(subOrderId, value);
  };

  const startEditing = () => {
    onSetUpdatingId(subOrderId);
  };

  const cancelEditing = () => {
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
      <div className="space-y-2">
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
          <p role="alert" className="text-body-sm text-danger">
            {invoiceError}
          </p>
        ) : null}
      </div>
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
            className="w-full min-w-[8.5rem] rounded-sm px-2 text-body-sm"
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
