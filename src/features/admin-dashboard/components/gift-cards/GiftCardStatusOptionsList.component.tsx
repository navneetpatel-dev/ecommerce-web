import { SelectItem } from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import {
  ADMIN_GIFT_CARD_STATUSES,
  ALL_GIFT_CARD_STATUSES,
} from "../../constants/gift-cards/giftCardStatuses";

/** Options for the status filter: "all" plus every gift card status. */
export function GiftCardStatusOptionsList() {
  return (
    <>
      <SelectItem value={ALL_GIFT_CARD_STATUSES}>
        {LABELS.giftCardAllStatuses}
      </SelectItem>
      {ADMIN_GIFT_CARD_STATUSES.map((value) => (
        <SelectItem key={value} value={value}>
          {value.replace(/_/g, " ")}
        </SelectItem>
      ))}
    </>
  );
}
