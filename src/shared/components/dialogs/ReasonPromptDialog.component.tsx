"use client";

import type { ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { StatusDialog } from "./StatusDialog.component";

interface ReasonPromptDialogProps {
  open: boolean;
  pending?: boolean;
  error?: string | null;
  title: string;
  description: string;
  placeholder: string;
  confirmLabel: string;
  /** Id used for the textarea + its label; keep unique per consumer. */
  htmlFor: string;
  reason: string;
  onReasonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

/**
 * In-app replacement for `window.prompt` — collects a required reason before a
 * destructive action so the copy and layout stay inside the design system.
 */
export function ReasonPromptDialog({
  open,
  pending = false,
  error,
  title,
  description,
  placeholder,
  confirmLabel,
  htmlFor,
  reason,
  onReasonChange,
  onOpenChange,
  onSubmit,
}: ReasonPromptDialogProps) {
  const trimmedReason = reason.trim();

  const handleOpenChange = (next: boolean) => {
    if (!next && pending) return;
    onOpenChange(next);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="warning"
      title={title}
      description={description}
      secondaryAction={{
        label: LABELS.cancel,
        disabled: pending,
        onClick: handleCancel,
      }}
      primaryAction={{
        label: confirmLabel,
        variant: "destructive",
        loading: pending,
        disabled: !trimmedReason,
        disabledHint: trimmedReason ? undefined : LABELS.reasonRequiredHint,
        onClick: onSubmit,
      }}
    >
      <FormFieldFrame
        label={LABELS.reason}
        htmlFor={htmlFor}
        required
        error={error ?? undefined}
      >
        <Textarea
          id={htmlFor}
          value={reason}
          onChange={onReasonChange}
          disabled={pending}
          placeholder={placeholder}
          rows={3}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- opened from an explicit user action; moving focus into the prompt is expected
          autoFocus
        />
      </FormFieldFrame>
    </StatusDialog>
  );
}
