"use client";

import { CheckboxField, FormFieldFrame } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { useAdminShipmentStatusControl } from "../../../hooks/orders/useAdminShipmentStatusControl.hook";
import { adminOrderShipmentActionStyles as styles } from "../../../styles/orders/adminOrderShipmentAction.styles";
import { AdminShipmentStatusOptions } from "./AdminShipmentStatusOptions.component";

interface AdminShipmentStatusControlProps {
  orderId: string;
  shipmentId: string;
  status: string;
  isCashOnDelivery: boolean;
}

export function AdminShipmentStatusControl(
  props: AdminShipmentStatusControlProps,
) {
  const control = useAdminShipmentStatusControl(props);

  if (!control.hasOptions) {
    return (
      <p className={styles.statusHint}>{LABELS.shipmentNoFurtherStatus}</p>
    );
  }

  return (
    <div className={styles.statusControl}>
      <FormFieldFrame label={LABELS.shipmentNextStatusLabel}>
        <Select
          value={control.nextStatus}
          onValueChange={control.handleStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.shipmentNextStatusPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <AdminShipmentStatusOptions statuses={control.options} />
          </SelectContent>
        </Select>
      </FormFieldFrame>
      {control.askReason ? (
        <FormFieldFrame
          label={LABELS.shipmentFailureReasonLabel}
          htmlFor={control.reasonFieldId}
          required
        >
          <Textarea
            id={control.reasonFieldId}
            value={control.reason}
            maxLength={500}
            placeholder={LABELS.shipmentFailureReasonPlaceholder}
            onChange={control.handleReasonChange}
          />
        </FormFieldFrame>
      ) : null}
      {control.askCodCollected ? (
        <div className={styles.codField}>
          <CheckboxField
            id={control.codFieldId}
            checked={control.codCollected}
            onCheckedChange={control.handleCodCollectedChange}
            label={LABELS.shipmentCodCollectedLabel}
          />
          <p className={styles.statusHint}>{LABELS.shipmentCodCollectedHint}</p>
        </div>
      ) : null}
      {control.error ? (
        <p className={styles.refundFailedText}>{control.error}</p>
      ) : null}
      <div className={styles.statusActions}>
        <Button
          type="button"
          size="sm"
          disabled={!control.canSubmit}
          onClick={control.handleSubmit}
        >
          {LABELS.updateShipmentStatus}
        </Button>
      </div>
    </div>
  );
}
