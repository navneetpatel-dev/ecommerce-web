"use client";

import { Check } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
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

  const errorMessage = error ? (
    <p role="alert" className={styles.errorMessage}>
      {error}
    </p>
  ) : null;

  return (
    <>
      <RowActionButton
        label={LABELS.approve}
        icon={Check}
        disabled={disabled || loading}
        disabledHint={disabled ? disabledHint : undefined}
        onClick={handleOpen}
      />

      <StatusDialog
        icon={Check}
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
