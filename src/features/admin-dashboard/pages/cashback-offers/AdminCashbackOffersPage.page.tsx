"use client";

import type { CashbackOffer } from "@/features/cashback";
import { DataTable } from "@/shared/components/DataTable";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { CashbackOfferDialog } from "../../components/cashback-offers/CashbackOfferDialog.component";
import { CashbackOfferRowActions } from "../../components/cashback-offers/CashbackOfferRowActions.component";
import { useAdminCashbackOffersPage } from "../../hooks/cashback-offers/useAdminCashbackOffersPage.hook";
import { adminCashbackOffersStyles as styles } from "../../styles/cashback-offers/adminCashbackOffers.styles";

const getRowId = (row: CashbackOffer) => row.id;

export function AdminCashbackOffersPage() {
  return (
    <RequirePermission permission={PERMISSIONS.COUPON_MANAGE}>
      <AdminCashbackOffersContent />
    </RequirePermission>
  );
}

function AdminCashbackOffersContent() {
  const page = useAdminCashbackOffersPage();
  const renderActions = (row: CashbackOffer) => (
    <CashbackOfferRowActions offer={row} onDelete={page.handleDelete} />
  );

  return (
    <div className={styles.root}>
      <header className={styles.headerRow}>
        <div className={styles.headerInfo}>
          <h1 className={styles.heading}>{LABELS.adminCashbackOffers}</h1>
          <p className={styles.description}>
            {LABELS.adminCashbackOffersDescription}
          </p>
        </div>
        <CashbackOfferDialog />
      </header>
      <DataTable
        ariaLabel={LABELS.cashbackOffersTableAria}
        columns={page.columns}
        rows={page.rows}
        getRowId={getRowId}
        loading={page.loading}
        refreshing={page.refreshing}
        error={page.error}
        pagination={page.pagination}
        actions={renderActions}
        rowDetails={false}
      />
    </div>
  );
}
