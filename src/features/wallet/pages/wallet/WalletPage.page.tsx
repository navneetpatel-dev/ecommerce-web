"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useWalletBalance, useWalletTransactions } from "../../api/wallet/wallet.queries";
import { WalletBalanceCard } from "../../components/overview/WalletPageContent.component";
import { WalletRechargePanel } from "../../components/recharge/WalletRechargePanel.component";
import { WalletStatementExportPanel } from "../../components/statement-export/WalletStatementExportPanel.component";
import { WalletTransactionsTable } from "../../components/transactions/WalletTransactionsTable.component";
import { walletApi } from "../../api/wallet/wallet.api";
import { walletPageStyles as styles } from "./walletPage.styles";

export function WalletPage() {
  const [page, setPage] = useState(1);
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const balanceQuery = useWalletBalance();
  const transactionsQuery = useWalletTransactions(page, DEFAULT_PAGE_LIMIT);
  const walletSectionLoading = !authBootstrapped || balanceQuery.isLoading;

  const transactions = transactionsQuery.data?.items ?? [];
  const total = transactionsQuery.data?.total ?? 0;
  const totalPages = transactionsQuery.data?.totalPages ?? 1;
  const from =
    total === 0 || transactions.length === 0
      ? 0
      : (page - 1) * DEFAULT_PAGE_LIMIT + 1;
  const to =
    transactions.length === 0
      ? 0
      : Math.min((page - 1) * DEFAULT_PAGE_LIMIT + transactions.length, total);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <TextEyebrow brand>{LABELS.account}</TextEyebrow>
        <h1
          className={styles.title}
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {LABELS.wallet}
        </h1>
        <p className={styles.description}>{LABELS.walletPageDescription}</p>
      </header>

      <div className={styles.cardsGrid}>
        <WalletBalanceCard
          balance={balanceQuery.data?.points ?? balanceQuery.data?.balance ?? 0}
          purchasedBalance={balanceQuery.data?.purchasedBalance}
          promotionalBalance={balanceQuery.data?.promotionalBalance}
          isLoading={walletSectionLoading}
          className={styles.fullHeight}
        />
        <WalletRechargePanel
          balance={balanceQuery.data}
          isLoading={walletSectionLoading}
          className={styles.fullHeight}
        />
      </div>

      <div className={styles.statementWrapper}>
        <WalletStatementExportPanel isLoading={walletSectionLoading} />
      </div>

      <section className={styles.transactionsSection}>
        <WalletTransactionsTable
          transactions={transactions}
          loading={transactionsQuery.isLoading}
          error={transactionsQuery.isError ? LABELS.errorRetryHint : null}
          onRetry={() => void transactionsQuery.refetch()}
          page={page}
          totalPages={totalPages}
          total={total}
          from={from}
          to={to}
          onPageChange={setPage}
          onDownloadInvoice={(id) => void walletApi.downloadRechargeInvoice(id)}
        />
      </section>
    </div>
  );
}
