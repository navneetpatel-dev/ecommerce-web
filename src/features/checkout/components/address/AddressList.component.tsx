import { memo } from "react";
import type { Address } from "@/shared/api/types";
import { AddressItem } from "./AddressItem.component";
import { ADDRESS_STEP_STYLES } from "./addressStep.styles";

interface AddressListProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const AddressList = memo(function AddressList({
  addresses,
  selectedId,
  onSelect,
}: AddressListProps) {
  return (
    <ul className={ADDRESS_STEP_STYLES.list}>
      {addresses.map((addr) => (
        <AddressItem
          key={addr.id}
          address={addr}
          isSelected={selectedId === addr.id}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
});
