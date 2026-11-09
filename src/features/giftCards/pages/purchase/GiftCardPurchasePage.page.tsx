"use client";

import Link from "next/link";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import { GiftCardPurchaseForm } from "../../components/purchase/GiftCardPurchaseForm.component";
import { giftCardPurchasePageStyles as styles } from "./giftCardPurchasePage.styles";

export function GiftCardPurchasePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <TextEyebrow brand>{LABELS.account}</TextEyebrow>
        <h1 className={styles.title}>{giftCardsLabels.giftCardsPageTitle}</h1>
        <p className={styles.subtitle}>
          {giftCardsLabels.giftCardsPageDescription}
        </p>
        <Link href={PATHS.giftCardsMine} className={styles.mineLink}>
          {LABELS.myGiftCards}
        </Link>
      </header>

      <GiftCardPurchaseForm />
    </div>
  );
}
