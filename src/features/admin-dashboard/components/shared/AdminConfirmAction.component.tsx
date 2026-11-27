"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import {
  StatusDialog,
  type StatusDialogVariant,
} from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import type { AdminActionTone } from "../../utils/shared/adminActionTone";
import { toneIcon } from "../../utils/shared/adminConfirmActionIcon";
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
  confirmLabel?: string;
  triggerClassName?: string;
  requireReason?: boolean;
  reasonLabel?: string;
  reasonHint?: string;
  onConfirm: (reason?: string) => void | Promise<unknown>;
  disabled?: boolean;
  /** Shown when the trigger is disabled (e.g. KYC incomplete). */
  disabledHint?: string;
  /** Overrides the icon the tone would pick. */
  icon?: LucideIcon;
  inline?: boolean;
}

/** Row action (or button) + StatusDialog confirmation for admin list actions. */
export function AdminConfirmAction({
  label,
  title,
  description,
  dialogVariant = "warning",
  tone,
  triggerVariant = "outline",
  confirmLabel,
  triggerClassName,
  requireReason = false,
  reasonLabel = LABELS.reasonRequired,
  reasonHint = LABELS.enterRejectionReason,
  onConfirm,
  disabled = false,
  disabledHint,
  icon,
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

  const triggerButtonClassName = styles.triggerButton(
    resolvedTone,
    inline,
    triggerClassName,
  );
  const confirmButtonLabel = confirmLabel ?? label;
  const actionIcon = icon ?? toneIcon(resolvedTone);

  const reasonField = requireReason ? (
    <ConfirmReasonField
      label={reasonLabel}
      hint={reasonFieldHint}
      value={reason}
      onChange={onReasonChange}
    />
  ) : null;

  const actionErrorMessage = actionError ? (
    <p role="alert" className={styles.errorMessage}>
      {actionError}
    </p>
  ) : null;

  return (
    <>
      <RowActionButton
        label={label}
        icon={actionIcon}
        kind={resolvedTone === "danger" ? "danger" : "default"}
        variant={triggerVariant}
        className={triggerButtonClassName}
        disabled={disabled || loading}
        disabledHint={disabled ? disabledHint : undefined}
        onClick={openTriggerDialog}
      />

      <StatusDialog
        open={open}
        onOpenChange={onDialogOpenChange}
        variant={dialogVariant}
        icon={actionIcon}
        title={title}
        description={description}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: loading,
          onClick: close,
        }}
        primaryAction={{
          label: confirmButtonLabel,
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
