"use client";

import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import { GiftCardPurchaseForm } from "../../components/purchase/GiftCardPurchaseForm.component";
import { giftCardPurchasePageStyles as styles } from "./giftCardPurchasePage.styles";

export function GiftCardPurchasePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <TextEyebrow brand>{LABELS.account}</TextEyebrow>
        <h1
          className={styles.title}
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {giftCardsLabels.giftCardsPageTitle}
        </h1>
        <p className={styles.subtitle}>
          {giftCardsLabels.giftCardsPageDescription}
        </p>
      </header>

      <GiftCardPurchaseForm />
    </div>
  );
}
