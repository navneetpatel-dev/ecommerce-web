"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { productEligibleOffersStyles } from "../../../styles/offers/productEligibleOffers.styles";

export interface EligibleOffer {
  code: string;
  name?: string;
  type: string;
  value?: number | null;
  discount: number;
  cashbackAmount?: number;
  minOrderValue?: number | null;
  maxDiscountCap?: number | null;
}

interface EligibleOfferItemProps {
  offer: EligibleOffer;
}

function offerDetailLabel(offer: EligibleOffer): string {
  if (offer.discount > 0) {
    const saveText = `Save ${formatInr(offer.discount)}`;
    if (offer.minOrderValue && offer.minOrderValue > 0) {
      return `${saveText} (Min order ${formatInr(offer.minOrderValue)})`;
    }
    return saveText;
  }
  if (offer.cashbackAmount && offer.cashbackAmount > 0) {
    const cbText = `${formatInr(offer.cashbackAmount)} cashback`;
    if (offer.minOrderValue && offer.minOrderValue > 0) {
      return `${cbText} (Min order ${formatInr(offer.minOrderValue)})`;
    }
    return cbText;
  }
  if (offer.type === "FREE_SHIPPING") return LABELS.couponTypeFreeShipping;
  if (offer.minOrderValue && offer.minOrderValue > 0) {
    return `On orders above ${formatInr(offer.minOrderValue)}`;
  }
  return LABELS.offersAtCheckout;
}

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
          title={copied ? "Copied to clipboard!" : `Copy code ${offer.code}`}
          className={productEligibleOffersStyles.offerCodeBadge}
          aria-label={copied ? "Code copied" : `Copy coupon code ${offer.code}`}
        >
          {copied ? (
            <>
              <Check className="size-3 text-emerald-600" aria-hidden />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <span>{offer.code}</span>
              <Copy className="size-3 opacity-60" aria-hidden />
            </>
          )}
        </button>
        {offer.name && offer.name !== offer.code ? (
          <span className={productEligibleOffersStyles.offerName}>
            {offer.name}
          </span>
        ) : null}
      </div>
      <span className={productEligibleOffersStyles.offerDetail}>
        {offerDetailLabel(offer)}
      </span>
    </li>
  );
}
