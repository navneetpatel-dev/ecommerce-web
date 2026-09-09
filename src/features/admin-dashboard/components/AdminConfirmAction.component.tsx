"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  StatusDialog,
  type StatusDialogVariant,
} from "@/shared/components/StatusDialog.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import {
  tableMenuButtonClass,
  type TableActionTone,
} from "@/shared/constants/tableActionTone";
import { cn } from "@/shared/utils/cn";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { AdminActionTone } from "../utils/adminActionTone";
import {
  renderToneIcon,
  toneFromDialog,
} from "../utils/adminConfirmActionIcon";

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const resolvedTone = tone ?? toneFromDialog(dialogVariant);

  const close = () => {
    if (loading) return;
    setOpen(false);
    setReason("");
    setActionError(null);
  };

  const run = async () => {
    if (requireReason && !reason.trim()) return;
    setLoading(true);
    setActionError(null);
    try {
      await onConfirm(requireReason ? reason.trim() : undefined);
      setOpen(false);
      setReason("");
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.couldNotLoadData));
    } finally {
      setLoading(false);
    }
  };

  const primaryVariant =
    confirmVariant ?? (dialogVariant === "danger" ? "destructive" : "default");
  const reasonTrimmed = reason.trim();
  const reasonMissing = requireReason && !reasonTrimmed;
  const triggerButtonClassName = cn(
    "select-none cursor-pointer",
    inline
      ? "w-auto gap-1.5"
      : tableMenuButtonClass(resolvedTone as TableActionTone),
    triggerClassName,
  );
  const triggerDisabled = disabled || loading;
  const toneIcon = showIcon ? renderToneIcon(resolvedTone) : null;
  const showDisabledHint = disabled && Boolean(disabledHint);
  const confirmButtonLabel = confirmLabel ?? label;
  const reasonFieldHint = reasonTrimmed ? undefined : reasonHint;
  const primaryDisabledHint = reasonMissing ? reasonHint : undefined;
  const openTriggerDialog = () => {
    setReason("");
    setActionError(null);
    setOpen(true);
  };
  const onDialogOpenChange = (next: boolean) => {
    if (!next) close();
  };
  const onPrimaryClick = () => {
    void run();
  };

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
    <FormFieldFrame
      label={reasonLabel}
      htmlFor="admin-confirm-reason"
      hint={reasonFieldHint}
    >
      <Textarea
        id="admin-confirm-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder={reasonLabel}
        className="min-h-[6.5rem] resize-none"
      />
    </FormFieldFrame>
  ) : null;
  const actionErrorMessage = actionError ? (
    <p className="text-body-sm text-danger">{actionError}</p>
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
          onClick: onPrimaryClick,
        }}
      >
        {reasonField}
        {actionErrorMessage}
      </StatusDialog>
    </>
  );
}
