"use client";

import { type ChangeEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { VENDOR_ORDERS_TABLE_STYLES } from "../../../styles/orders/vendorOrdersTable.styles";

interface ShipTrackingNumberFieldsProps {
  trackingId: string;
  onTrackingIdChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Tracking-number capture shown on the row before a vendor confirms "Ship". */
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
      <div className={VENDOR_ORDERS_TABLE_STYLES.trackingActions}>
        <Input
          // eslint-disable-next-line jsx-a11y/no-autofocus -- opened from an explicit Ship action; focus the tracking field immediately
          autoFocus
          value={trackingId}
          onChange={handleTrackingIdChange}
          placeholder={LABELS.trackingNumberPlaceholder}
          aria-label={LABELS.trackingNumber}
          className={VENDOR_ORDERS_TABLE_STYLES.trackingInput}
        />
        <Button
          size="sm"
          variant="outline"
          disabled={!trimmed}
          onClick={onConfirm}
        >
          {LABELS.orderActionShip}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          {LABELS.cancel}
        </Button>
      </div>
      {!trimmed ? (
        <p className={VENDOR_ORDERS_TABLE_STYLES.trackingText}>
          {LABELS.trackingNumberRequiredToShip}
        </p>
      ) : null}
    </div>
  );
}
