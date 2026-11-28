"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { offerDetailText, offerDisplayName } from "@/features/coupons";
import type { EligibleCoupon } from "@/shared/api/types";
import { productEligibleOffersStyles } from "../../../styles/offers/productEligibleOffers.styles";

interface EligibleOfferItemProps {
  offer: EligibleCoupon;
}

/** One offer: the code to copy, its name, and what it gives. */
export function EligibleOfferItem({ offer }: EligibleOfferItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(offer.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback ignore if clipboard API blocked
    }
  };

  return (
    <li className={productEligibleOffersStyles.offerItem}>
      <div className={productEligibleOffersStyles.offerLeft}>
        <button
          type="button"
          onClick={handleCopyCode}
          title={
            copied
              ? LABELS.offerCodeCopiedTitle
              : formatLabel(LABELS.offerCopyCodeTitle, { code: offer.code })
          }
          className={productEligibleOffersStyles.offerCodeBadge}
          aria-label={
            copied
              ? LABELS.offerCodeCopied
              : formatLabel(LABELS.offerCopyCodeAria, { code: offer.code })
          }
        >
          {copied ? (
            <>
              <Check
                className={productEligibleOffersStyles.copiedIcon}
                aria-hidden
              />
              <span>{LABELS.offerCopiedBadge}</span>
            </>
          ) : (
            <>
              <span>{offer.code}</span>
              <Copy
                className={productEligibleOffersStyles.copyIcon}
                aria-hidden
              />
            </>
          )}
        </button>
        {offerDisplayName(offer) !== offer.code ? (
          <span className={productEligibleOffersStyles.offerName}>
            {offerDisplayName(offer)}
          </span>
        ) : null}
      </div>
      <span className={productEligibleOffersStyles.offerDetail}>
        {offerDetailText(offer)}
      </span>
    </li>
  );
}
