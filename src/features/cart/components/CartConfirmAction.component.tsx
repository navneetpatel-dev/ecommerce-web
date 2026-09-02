"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        className={triggerClassName}
        aria-label={triggerAriaLabel}
        disabled={disabled || pending}
        onClick={() => setOpen(true)}
      >
        <Icon aria-hidden />
        {iconOnly ? null : triggerLabel}
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
          onClick: () => setOpen(false),
        }}
        primaryAction={{
          label: confirmLabel,
          variant: "destructive",
          loading: pending,
          onClick: () => {
            setOpen(false);
            onConfirm();
          },
        }}
      />
    </>
  );
}
