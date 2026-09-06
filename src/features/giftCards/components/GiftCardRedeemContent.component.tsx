"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInr } from "@/shared/utils/orderFormat";
import { LABELS } from "@/shared/constants/labels";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import { PATHS } from "@/shared/constants/paths";
import { useIsAuthenticated } from "@/shared/hooks/useRequireAuth.hook";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useGiftCardRedeemPage } from "../hooks/useGiftCardRedeemPage.hook";
import { useGiftCardRedeem } from "../hooks/useGiftCardRedeem.hook";

function statusBadgeLabel(status: string): string | null {
  if (status === "EXPIRED") return giftCardsLabels.giftCardExpiredBadge;
  if (status === "REDEEMED") return giftCardsLabels.giftCardRedeemedBadge;
  if (status === "CANCELLED" || status === "FAILED")
    return giftCardsLabels.giftCardCancelledBadge;
  return null;
}

export function GiftCardRedeemContent() {
  const { code, giftCard, isLoading, notFound } = useGiftCardRedeemPage();
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const isAuthenticated = useIsAuthenticated();
  const { redeem, isRedeeming, error, result } = useGiftCardRedeem();

  if (isLoading || !authBootstrapped) {
    return (
      <div className="storefront-container space-y-3 py-12">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full max-w-md" />
      </div>
    );
  }

  if (notFound || !giftCard) {
    return (
      <div className="storefront-container py-16 md:py-20">
        <EmptyState
          icon={Gift}
          heading={giftCardsLabels.giftCardNotFoundTitle}
          message={giftCardsLabels.giftCardNotFoundBody}
          actionLabel={LABELS.continueShopping}
          actionTo={PATHS.home}
        />
      </div>
    );
  }

  if (result) {
    return (
      <div className="storefront-container py-16 md:py-20">
        <div className="mx-auto max-w-md border border-line bg-surface-raised p-6 text-center shadow-elevation-1">
          <h1 className="font-display text-[1.25rem] text-ink">
            {giftCardsLabels.giftCardRedeemSuccessTitle}
          </h1>
          <p className="mt-2 text-body text-ink-muted">
            {formatLabel(giftCardsLabels.giftCardRedeemSuccessBody, {
              amount: result.amount,
            })}
          </p>
          <Button className="mt-5" asChild>
            <Link href={PATHS.wallet}>
              {giftCardsLabels.giftCardRedeemViewWallet}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const badge = statusBadgeLabel(giftCard.status);

  return (
    <div className="storefront-container py-16 md:py-20">
      <div className="mx-auto max-w-md border border-line bg-surface-raised p-6 text-center shadow-elevation-1">
        <h1 className="font-display text-[1.25rem] text-ink">
          {giftCardsLabels.giftCardRedeemTitle}
        </h1>
        <p className="mt-4 text-[2rem] font-semibold tabular-nums text-ink">
          {formatInr(giftCard.amount)}
        </p>

        {badge ? (
          <p className="mt-2 text-body-sm font-medium text-danger">{badge}</p>
        ) : null}

        {!badge && !isAuthenticated ? (
          <>
            <p className="mt-4 text-body text-ink-muted">
              {giftCardsLabels.giftCardRedeemLoginPrompt}
            </p>
            <Button className="mt-5" asChild>
              <Link
                href={PATHS.loginWithRedirect(`/gift-cards/redeem/${code}`)}
              >
                {LABELS.logIn}
              </Link>
            </Button>
          </>
        ) : null}

        {!badge && isAuthenticated ? (
          <>
            {error ? (
              <p role="alert" className="mt-4 text-body-sm text-danger">
                {error}
              </p>
            ) : null}
            <Button
              className="mt-5"
              disabled={isRedeeming}
              onClick={() => void redeem(code)}
            >
              {isRedeeming
                ? giftCardsLabels.giftCardRedeemButtonBusy
                : giftCardsLabels.giftCardRedeemButton}
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
}
