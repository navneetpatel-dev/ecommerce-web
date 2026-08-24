"use client";

import { useState, type ReactNode } from "react";
import { Archive, Check, Trash2, Ban, Play } from "lucide-react";
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
}

function toneIcon(tone: AdminActionTone) {
  switch (tone) {
    case "archive":
      return Archive;
    case "danger":
      return Trash2;
    case "success":
      return Check;
    case "neutral":
      return Ban;
    default:
      return Play;
  }
}

function toneFromDialog(variant: StatusDialogVariant): AdminActionTone {
  if (variant === "danger") return "danger";
  if (variant === "success") return "success";
  /** Warning is used for archive, suspend, block — callers should pass `tone` when not archive. */
  if (variant === "warning") return "archive";
  return "neutral";
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
}: AdminConfirmActionProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const resolvedTone = tone ?? toneFromDialog(dialogVariant);
  const Icon = toneIcon(resolvedTone);

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

  const triggerButton = (
    <Button
      size="sm"
      variant={triggerVariant}
      className={cn(
        tableMenuButtonClass(resolvedTone as TableActionTone),
        triggerClassName,
      )}
      disabled={disabled || loading}
      onClick={() => {
        setReason("");
        setActionError(null);
        setOpen(true);
      }}
    >
      {showIcon ? <Icon strokeWidth={2.25} aria-hidden /> : null}
      <span>{label}</span>
    </Button>
  );

  return (
    <>
      {disabled && disabledHint ? (
        <DisabledActionHint disabled message={disabledHint} block>
          {triggerButton}
        </DisabledActionHint>
      ) : (
        triggerButton
      )}

      <StatusDialog
        open={open}
        onOpenChange={(next) => {
          if (!next) close();
        }}
        variant={dialogVariant}
        title={title}
        description={description}
        secondaryAction={{
          label: LABELS.cancel,
          disabled: loading,
          onClick: close,
        }}
        primaryAction={{
          label: confirmLabel ?? label,
          variant: primaryVariant,
          loading,
          disabled: requireReason && !reason.trim(),
          disabledHint:
            requireReason && !reason.trim() ? reasonHint : undefined,
          onClick: () => {
            void run();
          },
        }}
      >
        {requireReason ? (
          <FormFieldFrame
            label={reasonLabel}
            htmlFor="admin-confirm-reason"
            hint={!reason.trim() ? reasonHint : undefined}
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
        ) : null}
        {actionError ? (
          <p className="text-body-sm text-danger">{actionError}</p>
        ) : null}
      </StatusDialog>
    </>
  );
}
