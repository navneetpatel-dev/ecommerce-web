"use client";

import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  StatusDialog,
  type StatusDialogVariant,
} from "@/shared/components/StatusDialog.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import type { AdminActionTone } from "../../utils/shared/adminActionTone";
import { renderToneIcon } from "../../utils/shared/adminConfirmActionIcon";
import { useAdminConfirmAction } from "../../hooks/shared/useAdminConfirmAction.hook";
import { ConfirmReasonField } from "./AdminConfirmAction/ConfirmReasonField.component";
import { adminConfirmActionStyles as styles } from "../../styles/shared/adminConfirmAction.styles";

type ButtonVariant =
  "default" | "outline" | "ghost" | "secondary" | "destructive";

interface AdminConfirmActionProps {
  label: string;
  title: string;
  description: ReactNode;
  dialogVariant?: StatusDialogVariant;
  /** Visual tone for the table trigger chip. */
  tone?: AdminActionTone;
  triggerVariant?: ButtonVariant;
  confirmVariant?: ButtonVariant;
  confirmLabel?: string;
  triggerClassName?: string;
  requireReason?: boolean;
  reasonLabel?: string;
  reasonHint?: string;
  onConfirm: (reason?: string) => void | Promise<unknown>;
  disabled?: boolean;
  /** Shown when the trigger is disabled (e.g. KYC incomplete). */
  disabledHint?: string;
  showIcon?: boolean;
  inline?: boolean;
}

/** Button + StatusDialog confirmation for admin list actions. */
export function AdminConfirmAction({
  label,
  title,
  description,
  dialogVariant = "warning",
  tone,
  triggerVariant = "outline",
  confirmVariant,
  confirmLabel,
  triggerClassName,
  requireReason = false,
  reasonLabel = LABELS.reasonRequired,
  reasonHint = LABELS.enterRejectionReason,
  onConfirm,
  disabled = false,
  disabledHint,
  showIcon = true,
  inline = false,
}: AdminConfirmActionProps) {
  const {
    open,
    loading,
    reason,
    actionError,
    resolvedTone,
    reasonMissing,
    reasonFieldHint,
    primaryDisabledHint,
    close,
    openTriggerDialog,
    onDialogOpenChange,
    onReasonChange,
    run,
  } = useAdminConfirmAction({
    dialogVariant,
    tone,
    requireReason,
    reasonHint,
    onConfirm,
  });

  const primaryVariant =
    confirmVariant ?? (dialogVariant === "danger" ? "destructive" : "default");
  const triggerButtonClassName = styles.triggerButton(
    resolvedTone,
    inline,
    triggerClassName,
  );
  const triggerDisabled = disabled || loading;
  const toneIcon = showIcon ? renderToneIcon(resolvedTone) : null;
  const showDisabledHint = disabled && Boolean(disabledHint);
  const confirmButtonLabel = confirmLabel ?? label;

  const triggerButton = (
    <Button
      size="sm"
      variant={triggerVariant}
      className={triggerButtonClassName}
      disabled={triggerDisabled}
      onClick={openTriggerDialog}
    >
      {toneIcon}
      <span>{label}</span>
    </Button>
  );

  const triggerElement = showDisabledHint ? (
    <DisabledActionHint disabled message={disabledHint!} block>
      {triggerButton}
    </DisabledActionHint>
  ) : (
    triggerButton
  );

  const reasonField = requireReason ? (
    <ConfirmReasonField
      label={reasonLabel}
      hint={reasonFieldHint}
      value={reason}
      onChange={onReasonChange}
    />
  ) : null;

  const actionErrorMessage = actionError ? (
    <p className={styles.errorMessage}>{actionError}</p>
  ) : null;

  return (
    <>
      {triggerElement}

      <StatusDialog
        open={open}
        onOpenChange={onDialogOpenChange}
        variant={dialogVariant}
        title={title}
        description={description}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: loading,
          onClick: close,
        }}
        primaryAction={{
          label: confirmButtonLabel,
          variant: primaryVariant,
          loading,
          disabled: reasonMissing,
          disabledHint: primaryDisabledHint,
          onClick: run,
        }}
      >
        {reasonField}
        {actionErrorMessage}
      </StatusDialog>
    </>
  );
}
