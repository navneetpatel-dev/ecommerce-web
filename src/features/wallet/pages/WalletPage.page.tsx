"use client";

import { LABELS } from "@/shared/constants/labels";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { useWalletBalance, useWalletTransactions } from "../api/wallet.queries";
import {
  WalletBalanceCard,
  WalletTransactionsList,
} from "../components/WalletPageContent.component";
import { WalletRechargePanel } from "../components/WalletRechargePanel.component";
import { WalletStatementExportPanel } from "../components/WalletStatementExportPanel.component";
import { walletApi } from "../api/wallet.api";

export function WalletPage() {
  const balanceQuery = useWalletBalance();
  const transactionsQuery = useWalletTransactions();

  const transactions = (transactionsQuery.data?.pages ?? []).flatMap(
    (page) => page.transactions,
  );

  return (
    <div className="storefront-container py-8 md:py-10">
      <header className="mb-8 max-w-2xl">
        <TextEyebrow brand>{LABELS.account}</TextEyebrow>
        <h1
          className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {LABELS.wallet}
        </h1>
        <p className="mt-2 text-body text-ink-muted">
          {LABELS.walletPageDescription}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 space-y-6">
          <WalletBalanceCard
            balance={balanceQuery.data?.points ?? balanceQuery.data?.balance ?? 0}
            purchasedBalance={balanceQuery.data?.purchasedBalance}
            promotionalBalance={balanceQuery.data?.promotionalBalance}
            isLoading={balanceQuery.isLoading}
          />
          <WalletRechargePanel
            balance={balanceQuery.data}
            isLoading={balanceQuery.isLoading}
          />
          <WalletStatementExportPanel />
        </div>
        <div className="lg:col-span-7">
          <TextEyebrow className="mb-3">
            {LABELS.walletTransactionHistory}
          </TextEyebrow>
          <WalletTransactionsList
            transactions={transactions}
            isLoading={transactionsQuery.isLoading}
            isError={transactionsQuery.isError}
            onRetry={() => void transactionsQuery.refetch()}
            hasNextPage={transactionsQuery.hasNextPage}
            isFetchingNextPage={transactionsQuery.isFetchingNextPage}
            onLoadMore={() => void transactionsQuery.fetchNextPage()}
            onDownloadInvoice={(id) => void walletApi.downloadRechargeInvoice(id)}
          />
        </div>
      </div>
    </div>
  );
}
