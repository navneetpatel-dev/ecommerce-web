"use client";

import { ChevronDown, Tag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { productEligibleOffersStyles } from "../../../styles/offers/productEligibleOffers.styles";
import { EligibleOffersList } from "./EligibleOffersList.component";
import { useProductEligibleOffers } from "../../../hooks/offers/useProductEligibleOffers.hook";

export interface ProductEligibleOffersProps {
  productId: string;
  className?: string;
  /** When false, skip the network call (e.g. product still loading). */
  enabled?: boolean;
}

export function ProductEligibleOffers({
  productId,
  className,
  enabled = true,
}: ProductEligibleOffersProps) {
  const {
    expanded,
    offersQuery,
    offers,
    canExpand,
    visibleOffers,
    hiddenCount,
    isScrollable,
    toggleExpanded,
  } = useProductEligibleOffers(productId, enabled);

  if (!enabled) return null;

  if (offersQuery.isLoading) {
    return (
      <p className={productEligibleOffersStyles.loading(className)}>
        {LABELS.loading}
      </p>
    );
  }

  if (offers.length === 0) {
    return (
      <p className={productEligibleOffersStyles.empty(className)}>
        {LABELS.noPdpOffers}
      </p>
    );
  }

  const offersCountLabel = formatLabel(LABELS.availableOffersCount, {
    count: offers.length,
  });

  const expandButtonLabel = expanded
    ? LABELS.showLessOffers
    : formatLabel(LABELS.showMoreOffers, { count: hiddenCount });

  return (
    <div className={productEligibleOffersStyles.root(className)}>
      <div className={productEligibleOffersStyles.header}>
        <div className={productEligibleOffersStyles.headerLeft}>
          <Tag
            className={productEligibleOffersStyles.tagIcon}
            strokeWidth={1.75}
            aria-hidden
          />
          <p className={productEligibleOffersStyles.title}>
            {LABELS.availableOffers}
          </p>
        </div>
        <span className={productEligibleOffersStyles.countBadge}>
          {offersCountLabel}
        </span>
      </div>

      <EligibleOffersList offers={visibleOffers} isScrollable={isScrollable} />

      {canExpand ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={productEligibleOffersStyles.expandButton}
          onClick={toggleExpanded}
          aria-expanded={expanded}
        >
          {expandButtonLabel}
          <ChevronDown
            className={productEligibleOffersStyles.expandIcon(expanded)}
            aria-hidden
          />
        </Button>
      ) : null}

      <p className={productEligibleOffersStyles.footerHint}>
        {LABELS.offersAtCheckout}
      </p>
    </div>
  );
}
