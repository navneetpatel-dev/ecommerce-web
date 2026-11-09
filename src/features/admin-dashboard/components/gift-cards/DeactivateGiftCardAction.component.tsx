"use client";

import type { GiftCardView } from "@/features/giftCards";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";

interface DeactivateGiftCardActionProps {
  card: GiftCardView;
  onDeactivate: (id: string, reason?: string) => Promise<void>;
}

/** Stops an active card from being redeemed, with a required reason for the audit log. */
export function DeactivateGiftCardAction({
  card,
  onDeactivate,
}: DeactivateGiftCardActionProps) {
  if (card.status !== "ACTIVE") return null;
  const handleConfirm = (reason?: string) => onDeactivate(card.id, reason);

  return (
    <AdminConfirmAction
      label={LABELS.giftCardDeactivate}
      dialogVariant="danger"
      tone="danger"
      title={formatLabel(LABELS.giftCardDeactivateTitle, { code: card.code })}
      description={LABELS.giftCardDeactivateBody}
      requireReason
      reasonHint={LABELS.giftCardDeactivatePlaceholder}
      onConfirm={handleConfirm}
    />
  );
}
