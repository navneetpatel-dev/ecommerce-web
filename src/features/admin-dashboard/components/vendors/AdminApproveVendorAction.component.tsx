"use client";

import { Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import { useAdminApproveVendorAction } from "../../hooks/vendors/useAdminApproveVendorAction.hook";
import { adminApproveVendorActionStyles as styles } from "../../styles/vendors/adminApproveVendorAction.styles";

interface AdminApproveVendorActionProps {
  vendorName: string;
  onApprove: (commissionRate?: number) => void | Promise<unknown>;
  disabled?: boolean;
  disabledHint?: string;
}

export function AdminApproveVendorAction({
  vendorName,
  onApprove,
  disabled = false,
  disabledHint,
}: AdminApproveVendorActionProps) {
  const {
    open,
    commissionRate,
    setCommissionRate,
    loading,
    error,
    handleOpen,
    handleClose,
    handleOpenChange,
    handleSubmit,
  } = useAdminApproveVendorAction({ onApprove });

  const triggerButton = (
    <Button
      size="sm"
      variant="outline"
      className={tableMenuButtonClass("success")}
      disabled={disabled || loading}
      onClick={handleOpen}
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
    <p className={styles.errorMessage}>{error}</p>
  ) : null;

  return (
    <>
      {triggerElement}

      <StatusDialog
        open={open}
        onOpenChange={handleOpenChange}
        variant="success"
        title={LABELS.confirmApproveVendorTitle}
        description={vendorName}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: loading,
          onClick: handleClose,
        }}
        primaryAction={{
          label: LABELS.approve,
          loading,
          onClick: handleSubmit,
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
