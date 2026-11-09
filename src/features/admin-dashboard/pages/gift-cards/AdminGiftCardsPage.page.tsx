"use client";

import type { GiftCardView } from "@/features/giftCards";
import { DataTable } from "@/shared/components/DataTable";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { AdminGiftCardsFilters } from "../../components/gift-cards/AdminGiftCardsFilters.component";
import { DeactivateGiftCardAction } from "../../components/gift-cards/DeactivateGiftCardAction.component";
import { GiftCardLiabilityMetrics } from "../../components/gift-cards/GiftCardLiabilityMetrics.component";
import { useAdminGiftCardsPage } from "../../hooks/gift-cards/useAdminGiftCardsPage.hook";
import { adminGiftCardsStyles as styles } from "../../styles/gift-cards/adminGiftCards.styles";

const getRowId = (row: GiftCardView) => row.id;

export function AdminGiftCardsPage() {
  return (
    <RequirePermission permission={PERMISSIONS.GIFT_CARD_MANAGE}>
      <AdminGiftCardsContent />
    </RequirePermission>
  );
}

function AdminGiftCardsContent() {
  const page = useAdminGiftCardsPage();
  const renderActions = (row: GiftCardView) => (
    <DeactivateGiftCardAction card={row} onDeactivate={page.handleDeactivate} />
  );

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.heading}>{LABELS.adminGiftCards}</h1>
        <p className={styles.description}>{LABELS.adminGiftCardsDescription}</p>
      </header>
      <GiftCardLiabilityMetrics metrics={page.metrics} />
      <DataTable
        ariaLabel={LABELS.giftCardsTableAria}
        columns={page.columns}
        rows={page.rows}
        getRowId={getRowId}
        loading={page.loading}
        refreshing={page.refreshing}
        error={page.error}
        toolbar={<AdminGiftCardsFilters {...page.filters} />}
        pagination={page.pagination}
        actions={renderActions}
        rowDetails={false}
      />
    </div>
  );
}
