import { Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
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
    <Button
      type="button"
      size="sm"
      variant="outline"
      loading={pending}
      disabled={pending}
      onClick={handleClick}
    >
      <Mail aria-hidden />
      <span>{LABELS.giftCardResend}</span>
    </Button>
  );
}
