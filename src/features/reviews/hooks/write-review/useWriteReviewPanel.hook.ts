"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LABELS } from "@/shared/constants/labels";
import { useIsAuthenticated } from "@/shared/hooks/auth/useRequireAuth.hook";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { useReviewEligibility } from "../../api/reviews/reviews.queries";

/** How long the arrival highlight stays on the review box. */
const HIGHLIGHT_MS = 2600;

/**
 * "Write a review" at the top of the PDP Reviews tab, for a shopper with a
 * delivered, unreviewed purchase. Arriving with `?review=<orderItemId>` (from
 * the "Write a review" list) opens it, scrolls to it, highlights it and puts
 * focus on the stars.
 */
export function useWriteReviewPanel(productId: string, enabled: boolean) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedItemId = searchParams?.get("review") ?? null;
  const isAuthenticated = useIsAuthenticated();
  const eligibility = useReviewEligibility(
    productId,
    isAuthenticated && enabled,
  );
  const eligibleItemId = eligibility.data?.orderItemId ?? null;
  // The server decides eligibility; a requested line is used only while it does.
  const orderItemId = eligibleItemId
    ? (requestedItemId ?? eligibleItemId)
    : null;

  const [open, setOpen] = useState(Boolean(requestedItemId));
  const [submitted, setSubmitted] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const arrivedRef = useRef(false);

  useEffect(() => {
    if (!requestedItemId || !orderItemId || arrivedRef.current || !enabled)
      return;
    const panel = panelRef.current;
    if (!panel) return;
    arrivedRef.current = true;
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
    panel
      .querySelector<HTMLElement>("button[aria-pressed], input, textarea")
      ?.focus({ preventScroll: true });
    setHighlighted(true);
    const timer = window.setTimeout(() => setHighlighted(false), HIGHLIGHT_MS);
    return () => window.clearTimeout(timer);
  }, [requestedItemId, orderItemId, enabled]);

  const clearRequestParam = () => {
    if (!requestedItemId) return;
    const next = new URLSearchParams(searchParams?.toString());
    next.delete("review");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return {
    panelRef,
    orderItemId,
    open,
    submitted,
    highlighted,
    toggle: () => setOpen((value) => !value),
    close: () => setOpen(false),
    handleSubmitted: () => {
      setSubmitted(true);
      setOpen(false);
      notifySuccess(LABELS.reviewThanks);
      clearRequestParam();
    },
  };
}

export type WriteReviewPanelState = Omit<
  ReturnType<typeof useWriteReviewPanel>,
  "panelRef"
>;
