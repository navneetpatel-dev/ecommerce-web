"use client";

import type { CashbackOffer } from "@/features/cashback";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
import { CashbackOfferDialog } from "./CashbackOfferDialog.component";

interface CashbackOfferRowActionsProps {
  offer: CashbackOffer;
  onDelete: (id: string) => Promise<void>;
}

export function CashbackOfferRowActions({
  offer,
  onDelete,
}: CashbackOfferRowActionsProps) {
  const handleDelete = () => onDelete(offer.id);
  return (
    <>
      <CashbackOfferDialog offer={offer} />
      <AdminConfirmAction
        label={LABELS.cashbackOfferDelete}
        dialogVariant="danger"
        tone="danger"
        title={formatLabel(LABELS.cashbackOfferDeleteTitle, {
          name: offer.name,
        })}
        description={LABELS.cashbackOfferDeleteBody}
        onConfirm={handleDelete}
      />
    </>
  );
}
