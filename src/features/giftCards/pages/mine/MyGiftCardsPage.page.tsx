"use client";

import Link from "next/link";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import type { GiftCardView } from "../../api/gift-cards/giftCards.api";
import { ResendGiftCardAction } from "../../components/mine/ResendGiftCardAction.component";
import { useMyGiftCardsPage } from "../../hooks/mine/useMyGiftCardsPage.hook";
import {
  buildPurchasedGiftCardColumns,
  buildRedeemedGiftCardColumns,
} from "../../utils/mine/giftCardColumns";
import { myGiftCardsPageStyles as styles } from "./myGiftCardsPage.styles";

const purchasedColumns = buildPurchasedGiftCardColumns();
const redeemedColumns = buildRedeemedGiftCardColumns();
const getRowId = (row: GiftCardView) => row.id;

export function MyGiftCardsPage() {
  const page = useMyGiftCardsPage();
  const renderResend = (row: GiftCardView) => (
    <ResendGiftCardAction
      card={row}
      pending={page.resendingId === row.id}
      onResend={page.handleResend}
    />
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <TextEyebrow brand>{LABELS.account}</TextEyebrow>
          <h1 className={styles.title}>{LABELS.myGiftCards}</h1>
          <p className={styles.subtitle}>{LABELS.myGiftCardsDescription}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={PATHS.giftCards}>{LABELS.giftCardSendOne}</Link>
        </Button>
      </header>

      <DataTable
        title={LABELS.giftCardsPurchased}
        columns={purchasedColumns}
        rows={page.purchased}
        getRowId={getRowId}
        loading={page.loading}
        error={page.error}
        emptyMessage={LABELS.giftCardsPurchasedEmpty}
        actions={renderResend}
        rowDetails={false}
      />

      <DataTable
        title={LABELS.giftCardsRedeemedByYou}
        columns={redeemedColumns}
        rows={page.redeemed}
        getRowId={getRowId}
        loading={page.loading}
        emptyMessage={LABELS.giftCardsRedeemedEmpty}
        rowDetails={false}
      />
    </div>
  );
}
