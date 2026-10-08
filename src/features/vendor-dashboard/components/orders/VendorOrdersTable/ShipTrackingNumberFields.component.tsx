"use client";

import { type ChangeEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  TableRowActions,
  TableRowAction,
} from "@/shared/components/DataTable/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import { VENDOR_ORDERS_TABLE_STYLES } from "../../../styles/orders/vendorOrdersTable.styles";

interface ShipTrackingNumberFieldsProps {
  trackingId: string;
  onTrackingIdChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Tracking-number capture step shown before a vendor confirms "Ship". */
export function ShipTrackingNumberFields({
  trackingId,
  onTrackingIdChange,
  onConfirm,
  onCancel,
}: ShipTrackingNumberFieldsProps) {
  const trimmed = trackingId.trim();

  const handleTrackingIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    onTrackingIdChange(event.target.value);

  return (
    <div className={VENDOR_ORDERS_TABLE_STYLES.trackingRoot}>
      <TableRowActions>
        <TableRowAction>
          <Input
            // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional: this control lives in a dialog/popover that opened from a user action, where moving focus into the panel is the expected behaviour
            autoFocus
            value={trackingId}
            onChange={handleTrackingIdChange}
            placeholder={LABELS.trackingNumberPlaceholder}
            aria-label={LABELS.trackingNumber}
            className={VENDOR_ORDERS_TABLE_STYLES.trackingInput}
          />
        </TableRowAction>
        <TableRowAction>
          <Button
            size="sm"
            variant="outline"
            className={tableMenuButtonClass("edit")}
            disabled={!trimmed}
            onClick={onConfirm}
          >
            {LABELS.orderActionShip}
          </Button>
        </TableRowAction>
        <TableRowAction>
          <Button
            size="sm"
            variant="outline"
            className={tableMenuButtonClass("neutral")}
            onClick={onCancel}
          >
            {LABELS.cancel}
          </Button>
        </TableRowAction>
      </TableRowActions>
      {!trimmed ? (
        <p className={VENDOR_ORDERS_TABLE_STYLES.trackingText}>
          {LABELS.trackingNumberRequiredToShip}
        </p>
      ) : null}
    </div>
  );
}
