"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  deliveryEtaLabel,
  deliveryFreeShippingLabel,
  type DeliveryAreaStatus,
} from "@/shared/utils/delivery/deliveryArea";
import { cn } from "@/shared/utils/dom/cn";
import { deliveryAreaStyles } from "@/shared/styles/delivery/deliveryArea.styles";

interface DeliveryServiceabilityNoticeProps {
  /** The area the funnel is shopped in, or null when none is set. */
  pincode: string | null;
  status: DeliveryAreaStatus;
  isChecking?: boolean;
  className?: string;
}

/**
 * Whether the checked delivery area serves this basket, for any surface in the funnel.
 *
 * It renders what it is told (the owning hook runs the check), and a check that never
 * answered renders nothing: only the API's "no" is allowed to warn, so a flaky network
 * degrades to the old behaviour — the quote's 422 at payment — instead of telling a
 * customer we can't serve an area we can.
 */
export function DeliveryServiceabilityNotice({
  pincode,
  status,
  isChecking = false,
  className,
}: DeliveryServiceabilityNoticeProps) {
  if (!pincode) return null;

  if (!status.known) {
    return isChecking ? (
      <p className={cn(deliveryAreaStyles.noticeMuted, className)}>
        {formatLabel(LABELS.deliveryAreaChecking, { pincode })}
      </p>
    ) : null;
  }

  if (!status.serviceable) {
    return (
      <p className={cn(deliveryAreaStyles.noticeDanger, className)}>
        {formatLabel(LABELS.deliveryAreaNotServiceable, { pincode })}
      </p>
    );
  }

  const eta = deliveryEtaLabel(pincode, status.estimatedDays);
  const freeShipping = deliveryFreeShippingLabel(status.freeShippingThreshold);
  const details = [eta, freeShipping].filter(Boolean).join(" · ");
  if (!details) return null;

  return (
    <p className={cn(deliveryAreaStyles.noticeSuccess, className)}>{details}</p>
  );
}
