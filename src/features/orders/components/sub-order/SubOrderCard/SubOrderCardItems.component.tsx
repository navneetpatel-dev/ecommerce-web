import { memo } from "react";
import type { OrderItem } from "@/shared/api/types";
import { SubOrderCardItemRow } from "./SubOrderCardItemRow.component";
import { SUB_ORDER_CARD_ITEMS_STYLES } from "../../../styles/sub-order/subOrderCardItems.styles";

interface SubOrderCardItemsProps {
  items: OrderItem[] | undefined;
  canReturn: boolean;
  onOpenReturn: (item: OrderItem) => void;
}

/** Order lines, laid out like cart lines so an item reads the same throughout. */
export const SubOrderCardItems = memo(function SubOrderCardItems({
  items,
  canReturn,
  onOpenReturn,
}: SubOrderCardItemsProps) {
  if (!items || items.length === 0) return null;

  return (
    <ul className={SUB_ORDER_CARD_ITEMS_STYLES.list}>
      {items.map((item) => (
        <SubOrderCardItemRow
          key={item.id}
          item={item}
          canReturn={canReturn}
          onOpenReturn={onOpenReturn}
        />
      ))}
    </ul>
  );
});
