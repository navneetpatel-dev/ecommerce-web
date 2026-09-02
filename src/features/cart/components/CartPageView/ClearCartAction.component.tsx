"use client";

import { Trash2 } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { CartConfirmAction } from "../CartConfirmAction.component";

interface ClearCartActionProps {
  onClear: () => void;
  isClearing?: boolean;
  disabled?: boolean;
}

export function ClearCartAction({
  onClear,
  isClearing = false,
  disabled = false,
}: ClearCartActionProps) {
  return (
    <CartConfirmAction
      triggerLabel={LABELS.clearAll}
      title={LABELS.clearCartTitle}
      description={LABELS.clearCartDescription}
      confirmLabel={LABELS.clearAll}
      icon={Trash2}
      pending={isClearing}
      disabled={disabled}
      triggerClassName="shrink-0 text-danger hover:bg-danger-subtle hover:text-danger"
      onConfirm={onClear}
    />
  );
}
