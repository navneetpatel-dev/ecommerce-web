import { Plus } from "lucide-react";
import type { Address } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { AddressCard } from "./AddressCard.component";
import { addressesSectionStyles as styles } from "./addressesSection.styles";

interface AddressCardsListProps {
  addresses: Address[];
  defaultingId: string | null;
  isSettingDefault: boolean;
  onEdit: (addr: Address) => void;
  onSetDefault: (addr: Address) => void;
  onDelete: (addr: Address) => void;
  onAddAddress: () => void;
}

export function AddressCardsList({
  addresses,
  defaultingId,
  isSettingDefault,
  onEdit,
  onSetDefault,
  onDelete,
  onAddAddress,
}: AddressCardsListProps) {
  return (
    <ul className={styles.listGrid}>
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          addr={addr}
          defaulting={defaultingId === addr.id && isSettingDefault}
          onEdit={onEdit}
          onSetDefault={onSetDefault}
          onDelete={onDelete}
        />
      ))}
      <li>
        <Button
          type="button"
          variant="outline"
          onClick={onAddAddress}
          className={styles.addNewCardButton}
        >
          <Plus size={20} strokeWidth={1.5} />
          <span className={styles.addNewCardLabel}>{LABELS.addAddress}</span>
        </Button>
      </li>
    </ul>
  );
}
