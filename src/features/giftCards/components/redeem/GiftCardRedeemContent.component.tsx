"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { LABELS } from "@/shared/constants/labels";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import { PATHS } from "@/shared/constants/paths/paths";
import { useIsAuthenticated } from "@/shared/hooks/auth/useRequireAuth.hook";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useGiftCardRedeemPage } from "../../hooks/redeem/useGiftCardRedeemPage.hook";
import { useGiftCardRedeem } from "../../hooks/redeem/useGiftCardRedeem.hook";
import { giftCardRedeemContentStyles as styles } from "../../styles/redeem/giftCardRedeemContent.styles";

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
      <div className={styles.loadingContainer}>
        <Skeleton className={styles.skelH8W48} />
        <Skeleton className={styles.skelH32MaxMd} />
      </div>
    );
  }

  if (notFound || !giftCard) {
    return (
      <div className={styles.container}>
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
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.heading}>
            {giftCardsLabels.giftCardRedeemSuccessTitle}
          </h1>
          <p className={styles.subtitle}>
            {formatLabel(giftCardsLabels.giftCardRedeemSuccessBody, {
              amount: result.amount,
            })}
          </p>
          <Button className={styles.button} asChild>
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
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.heading}>
          {giftCardsLabels.giftCardRedeemTitle}
        </h1>
        <p className={styles.amount}>{formatInr(giftCard.amount)}</p>

        {badge ? <p className={styles.badgeError}>{badge}</p> : null}

        {!badge && !isAuthenticated ? (
          <>
            <p className={styles.promptText}>
              {giftCardsLabels.giftCardRedeemLoginPrompt}
            </p>
            <Button className={styles.button} asChild>
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
              <p role="alert" className={styles.errorMessage}>
                {error}
              </p>
            ) : null}
            <Button
              className={styles.button}
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
