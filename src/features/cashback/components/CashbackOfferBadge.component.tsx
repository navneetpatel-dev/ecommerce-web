"use client";

import { BadgePercent } from "lucide-react";
import { useCashbackOfferBadge } from "../hooks/useCashbackOfferBadge.hook";
import { cashbackOfferBadgeStyles as styles } from "../styles/cashbackOfferBadge.styles";
import { CashbackOfferDetail } from "./CashbackOfferDetail.component";

interface CashbackOfferBadgeProps {
  categoryId: string | null | undefined;
  /** `card`: one compact line. `detail`: headline and terms (product page). */
  variant?: "card" | "detail";
}

/** A live platform cashback offer for this product's category, if any. */
export function CashbackOfferBadge({
  categoryId,
  variant = "card",
}: CashbackOfferBadgeProps) {
  const copy = useCashbackOfferBadge(categoryId);
  if (!copy) return null;
  if (variant === "detail") return <CashbackOfferDetail copy={copy} />;
  return (
    <span className={styles.card} title={copy.terms || undefined}>
      <BadgePercent className={styles.cardIcon} aria-hidden />
      <span className={styles.cardText}>{copy.headline}</span>
    </span>
  );
}
