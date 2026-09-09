"use client";

import { LABELS } from "@/shared/constants/labels";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { WalletBalanceCard } from "../../components/overview/WalletPageContent.component";
import { WalletRechargePanel } from "../../components/recharge/WalletRechargePanel.component";
import { WalletStatementExportPanel } from "../../components/statement-export/WalletStatementExportPanel.component";
import { WalletTransactionsTable } from "../../components/transactions/WalletTransactionsTable.component";
import { walletPageStyles as styles } from "./walletPage.styles";
import { useWalletPage } from "../../hooks/wallet/useWalletPage.hook";

export function WalletPage() {
  const page = useWalletPage();

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
          balance={page.balancePoints}
          purchasedBalance={page.purchasedBalance}
          promotionalBalance={page.promotionalBalance}
          isLoading={page.walletSectionLoading}
          className={styles.fullHeight}
        />
        <WalletRechargePanel
          balance={page.balance}
          isLoading={page.walletSectionLoading}
          className={styles.fullHeight}
        />
      </div>

      <div className={styles.statementWrapper}>
        <WalletStatementExportPanel isLoading={page.walletSectionLoading} />
      </div>

      <section className={styles.transactionsSection}>
        <WalletTransactionsTable
          transactions={page.transactions}
          loading={page.transactionsLoading}
          error={page.transactionsError}
          onRetry={page.retryTransactions}
          page={page.page}
          totalPages={page.totalPages}
          total={page.total}
          from={page.from}
          to={page.to}
          onPageChange={page.setPage}
          onDownloadInvoice={page.downloadInvoice}
        />
      </section>
    </div>
  );
}
