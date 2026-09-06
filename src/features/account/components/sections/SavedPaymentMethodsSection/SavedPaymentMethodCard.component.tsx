"use client";

import { CreditCard, Smartphone, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { paymentMethodsLabels as LABELS } from "@/shared/constants/labels/paymentMethods";
import type { SavedPaymentMethod } from "../../../types";

function describeMethod(method: SavedPaymentMethod): {
  icon: typeof CreditCard;
  title: string;
  subtitle: string;
} {
  if (method.methodType === "upi" || method.vpa) {
    return {
      icon: Smartphone,
      title: LABELS.upiMethodLabel,
      subtitle: method.vpa ?? "",
    };
  }
  const network = method.cardNetwork ?? LABELS.cardMethodLabel;
  const last4 = method.cardLast4 ? `•••• ${method.cardLast4}` : "";
  return { icon: CreditCard, title: network, subtitle: last4 };
}

interface SavedPaymentMethodCardProps {
  method: SavedPaymentMethod;
  deleting: boolean;
  onDelete: (method: SavedPaymentMethod) => void;
}

export function SavedPaymentMethodCard({
  method,
  deleting,
  onDelete,
}: SavedPaymentMethodCardProps) {
  const { icon: Icon, title, subtitle } = describeMethod(method);

  return (
    <li className="flex items-center justify-between gap-3 border border-line bg-paper p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center border border-line bg-paper/60 text-ink-muted">
          <Icon size={18} strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.9rem] font-medium text-ink">{title}</p>
          {subtitle ? (
            <p className="truncate text-[0.8rem] text-ink-muted">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={deleting}
        onClick={() => onDelete(method)}
        aria-label="Remove payment method"
      >
        <Trash2 size={16} />
      </Button>
    </li>
  );
}
