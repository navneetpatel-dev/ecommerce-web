"use client";

import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { DataTable } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import type { CashbackEntry } from "../api/cashback.api";
import { CashbackTotals } from "../components/CashbackTotals.component";
import { useCashbackHistoryPage } from "../hooks/useCashbackHistoryPage.hook";
import { buildCashbackHistoryColumns } from "../utils/cashbackHistoryColumns";
import { cashbackHistoryPageStyles as styles } from "../styles/cashbackHistoryPage.styles";

const columns = buildCashbackHistoryColumns();
const getRowId = (row: CashbackEntry) => row.orderId;

export function CashbackHistoryPage() {
  const page = useCashbackHistoryPage();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <TextEyebrow brand>{LABELS.wallet}</TextEyebrow>
        <h1 className={styles.title}>{LABELS.cashbackPageTitle}</h1>
        <p className={styles.subtitle}>{LABELS.cashbackPageDescription}</p>
      </header>

      <CashbackTotals
        pending={page.pendingTotal}
        credited={page.creditedTotal}
      />

      <DataTable
        ariaLabel={LABELS.cashbackTableAria}
        columns={columns}
        rows={page.rows}
        getRowId={getRowId}
        loading={page.loading}
        error={page.error}
        emptyMessage={LABELS.cashbackEmpty}
        pagination={page.pagination}
        rowDetails={false}
      />
    </div>
  );
}
