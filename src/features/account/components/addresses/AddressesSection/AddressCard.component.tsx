"use client";

import { Pencil, Star, Trash2 } from "lucide-react";
import type { Address } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { addressCardStyles as styles } from "./addressCard.styles";

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
  const handleEditClick = () => {
    onEdit(addr);
  };

  const handleSetDefaultClick = () => {
    onSetDefault(addr);
  };

  const handleDeleteClick = () => {
    onDelete(addr);
  };

  const line2Suffix = addr.line2 ? `, ${addr.line2}` : "";
  const setDefaultDisabled = addr.isDefault || defaulting;
  const setDefaultLabel = addr.isDefault
    ? LABELS.addressDefault
    : LABELS.setDefaultShort;

  return (
    <li className={styles.card}>
      <div className={styles.details}>
        <p className={styles.line1}>
          {addr.line1}
          {line2Suffix}
        </p>
        <p className={styles.line2}>
          {addr.city}, {addr.state} {addr.pincode}
        </p>
        <p className={styles.country}>{addr.country}</p>
        {addr.isDefault && (
          <span className={styles.defaultBadge}>{LABELS.addressDefault}</span>
        )}
      </div>
      <div className={styles.actionsRow}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={styles.actionButton}
          onClick={handleEditClick}
        >
          <Pencil size={14} />
          {LABELS.edit}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={setDefaultDisabled}
          className={styles.setDefaultButton(addr.isDefault)}
          loading={defaulting}
          onClick={handleSetDefaultClick}
        >
          <Star size={14} />
          {setDefaultLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={styles.deleteButton}
          onClick={handleDeleteClick}
        >
          <Trash2 size={14} />
          {LABELS.delete}
        </Button>
      </div>
    </li>
  );
}
