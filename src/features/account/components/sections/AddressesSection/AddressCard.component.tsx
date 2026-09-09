"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import type { Address } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

interface AddressCardProps {
  addr: Address;
  defaulting: boolean;
  onEdit: (addr: Address) => void;
  onSetDefault: (addr: Address) => void;
  onDelete: (addr: Address) => void;
}

export function AddressCard({
  addr,
  defaulting,
  onEdit,
  onSetDefault,
  onDelete,
}: AddressCardProps) {
  const line2Suffix = addr.line2 ? `, ${addr.line2}` : "";
  const defaultBadge = addr.isDefault ? (
    <span className="mt-3 inline-block text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand">
      {LABELS.addressDefault}
    </span>
  ) : null;
  const setDefaultDisabled = addr.isDefault || defaulting;
  const setDefaultButtonClassName = cn(
    "w-full justify-center gap-1.5 transition-colors",
    addr.isDefault
      ? "text-brand hover:text-brand disabled:opacity-100"
      : "text-ink-muted hover:text-brand",
  );
  const setDefaultLabel = addr.isDefault
    ? LABELS.addressDefault
    : LABELS.setDefaultShort;

  return (
    <li
      key={addr.id}
      className="flex flex-col border border-line bg-surface p-4 shadow-elevation-1"
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">
          {addr.line1}
          {line2Suffix}
        </p>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          {addr.city}, {addr.state} {addr.pincode}
        </p>
        <p className="mt-0.5 text-body-sm text-ink-muted">{addr.country}</p>
        {defaultBadge}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-1.5"
          onClick={() => onEdit(addr)}
        >
          <Pencil size={14} />
          {LABELS.edit}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={setDefaultDisabled}
          className={setDefaultButtonClassName}
          loading={defaulting}
          onClick={() => onSetDefault(addr)}
        >
          <Star size={14} />
          {setDefaultLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-1.5 text-danger hover:text-danger"
          onClick={() => onDelete(addr)}
        >
          <Trash2 size={14} />
          {LABELS.delete}
        </Button>
      </div>
    </li>
  );
}
