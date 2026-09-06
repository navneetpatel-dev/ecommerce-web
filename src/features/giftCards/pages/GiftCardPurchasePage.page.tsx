"use client";

import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import { GiftCardPurchaseForm } from "../components/GiftCardPurchaseForm.component";

export function GiftCardPurchasePage() {
  return (
    <div className="storefront-container max-w-xl py-8 md:py-10">
      <header className="mb-8">
        <TextEyebrow brand>{LABELS.account}</TextEyebrow>
        <h1
          className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {giftCardsLabels.giftCardsPageTitle}
        </h1>
        <p className="mt-2 text-body text-ink-muted">
          {giftCardsLabels.giftCardsPageDescription}
        </p>
      </header>

      <GiftCardPurchaseForm />
    </div>
  );
}
