"use client";

import { useMemo } from "react";
import type { Address } from "@/shared/api/types";

const STEP_COPY: Record<
  number,
  { eyebrow: string; title: string; blurb: string }
> = {
  1: {
    eyebrow: "Step 1 · Address",
    title: "Where should we send it?",
    blurb: "Choose a saved address or add a new one for delivery.",
  },
  2: {
    eyebrow: "Step 2 · Shipping",
    title: "How should it arrive?",
    blurb: "Pick a shipping speed for each vendor in your bag.",
  },
  3: {
    eyebrow: "Step 3 · Payment",
    title: "How will you pay?",
    blurb: "Select a payment method, then review your order.",
  },
  4: {
    eyebrow: "Step 4 · Review",
    title: "Confirm your order",
    blurb: "One last look — totals, shipping, and taxes included.",
  },
};

interface UseCheckoutStepCardParams {
  step: number;
  addressId: string | null;
  addresses?: Address[];
}

export function useCheckoutStepCard({
  step,
  addressId,
  addresses,
}: UseCheckoutStepCardParams) {
  const copy = useMemo(() => {
    return STEP_COPY[step] ?? STEP_COPY[1];
  }, [step]);

  const pincode = useMemo(() => {
    return (
      addresses?.find((address) => address.id === addressId)?.pincode ?? ""
    );
  }, [addresses, addressId]);

  return {
    copy,
    pincode,
  };
}
