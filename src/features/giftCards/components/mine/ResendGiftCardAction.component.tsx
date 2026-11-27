import { Mail } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";
import type { GiftCardView } from "../../api/gift-cards/giftCards.api";

interface ResendGiftCardActionProps {
  card: GiftCardView;
  pending: boolean;
  onResend: (card: GiftCardView) => void;
}

/** Emails a still-usable card to its recipient again. */
export function ResendGiftCardAction({
  card,
  pending,
  onResend,
}: ResendGiftCardActionProps) {
  if (card.status !== "ACTIVE") return null;
  const handleClick = () => onResend(card);

  return (
    <RowActionButton
      icon={Mail}
      label={LABELS.giftCardResend}
      loading={pending}
      onClick={handleClick}
    />
  );
}
