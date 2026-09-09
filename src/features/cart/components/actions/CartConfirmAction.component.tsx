"use client";

import type { LucideIcon } from "lucide-react";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { useCartConfirmAction } from "../../hooks/actions/useCartConfirmAction.hook";

type TriggerVariant = "ghost" | "outline" | "destructive";
type TriggerSize = "sm" | "icon-sm";

interface CartConfirmActionProps {
  triggerLabel: string;
  triggerAriaLabel?: string;
  title: string;
  description: string;
  confirmLabel: string;
  icon: LucideIcon;
  onConfirm: () => void;
  pending?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
  triggerVariant?: TriggerVariant;
  triggerSize?: TriggerSize;
  triggerClassName?: string;
}

export function CartConfirmAction({
  triggerLabel,
  triggerAriaLabel,
  title,
  description,
  confirmLabel,
  icon: Icon,
  onConfirm,
  pending = false,
  disabled = false,
  iconOnly = false,
  triggerVariant = "ghost",
  triggerSize = "sm",
  triggerClassName,
}: CartConfirmActionProps) {
  const { open, setOpen, handleOpen, handleClose, handleConfirm } =
    useCartConfirmAction(onConfirm);

  const triggerDisabled = disabled || pending;
  const triggerContent = iconOnly ? null : triggerLabel;

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        className={triggerClassName}
        aria-label={triggerAriaLabel}
        disabled={triggerDisabled}
        onClick={handleOpen}
      >
        <Icon aria-hidden />
        {triggerContent}
      </Button>

      <StatusDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        variant="danger"
        secondaryAction={{
          label: LABELS.cancel,
          variant: "outline",
          disabled: pending,
          onClick: handleClose,
        }}
        primaryAction={{
          label: confirmLabel,
          variant: "destructive",
          loading: pending,
          onClick: handleConfirm,
        }}
      />
    </>
  );
}
