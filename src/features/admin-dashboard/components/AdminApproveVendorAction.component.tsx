"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/tableActionTone";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";

interface AdminApproveVendorActionProps {
  vendorName: string;
  onApprove: (commissionRate?: number) => void | Promise<unknown>;
  disabled?: boolean;
  disabledHint?: string;
}

/**
 * Approve-vendor confirmation with an optional commission-rate override field.
 * `AdminConfirmAction` only supports a free-text reason, not a numeric input,
 * so approval gets its own small dialog (pattern mirrors
 * AdminAssignDeliveryAgentAction: plain useState, no form library).
 */
export function AdminApproveVendorAction({
  vendorName,
  onApprove,
  disabled = false,
  disabledHint,
}: AdminApproveVendorActionProps) {
  const [open, setOpen] = useState(false);
  const [commissionRate, setCommissionRate] = useState<number | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (loading) return;
    setOpen(false);
    setCommissionRate(undefined);
    setError(null);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onApprove(commissionRate);
      setOpen(false);
      setCommissionRate(undefined);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadData));
    } finally {
      setLoading(false);
    }
  };

  const triggerButton = (
    <Button
      size="sm"
      variant="outline"
      className={tableMenuButtonClass("success")}
      disabled={disabled || loading}
      onClick={() => setOpen(true)}
    >
      <Check strokeWidth={2.25} aria-hidden />
      <span>{LABELS.approve}</span>
    </Button>
  );
  const showDisabledHint = disabled && Boolean(disabledHint);
  const triggerElement = showDisabledHint ? (
    <DisabledActionHint disabled message={disabledHint!} block>
      {triggerButton}
    </DisabledActionHint>
  ) : (
    triggerButton
  );
  const errorMessage = error ? (
    <p className="text-body-sm text-danger">{error}</p>
  ) : null;

  return (
    <>
      {triggerElement}

      <StatusDialog
        open={open}
        onOpenChange={(next) => {
          if (!next) close();
        }}
        variant="success"
        title={LABELS.confirmApproveVendorTitle}
        description={vendorName}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: loading,
          onClick: close,
        }}
        primaryAction={{
          label: LABELS.approve,
          loading,
          onClick: () => void submit(),
        }}
      >
        <FormFieldFrame
          label={LABELS.commissionRate}
          htmlFor="approve-vendor-commission-rate"
          hint={adminEntityDetailLabels.vendorApprovalCommissionRateHint}
        >
          <NumberInput
            id="approve-vendor-commission-rate"
            value={commissionRate}
            min={0}
            max={100}
            step={1}
            suffix="%"
            onChange={setCommissionRate}
          />
        </FormFieldFrame>
        {errorMessage}
      </StatusDialog>
    </>
  );
}
