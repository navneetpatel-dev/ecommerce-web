"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  TableRowActions,
  TableRowAction,
} from "@/shared/components/TableRowActions.component";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { LABELS } from "@/shared/constants/labels";

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

  return (
    <div className="space-y-1">
      <TableRowActions>
        <TableRowAction>
          <Input
            autoFocus
            value={trackingId}
            onChange={(e) => onTrackingIdChange(e.target.value)}
            placeholder={LABELS.trackingNumberPlaceholder}
            aria-label={LABELS.trackingNumber}
            className="w-full min-w-[10rem] text-body-sm"
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
        <p className="text-body-sm text-ink-muted">
          {LABELS.trackingNumberRequiredToShip}
        </p>
      ) : null}
    </div>
  );
}
