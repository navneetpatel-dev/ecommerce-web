"use client";

import { Wallet } from "lucide-react";
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
      <header className="mb-8">
        <TextEyebrow brand>{LABELS.account}</TextEyebrow>
        <h1
          className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
          style={{ fontSize: "var(--text-display-sm)" }}
        >
          {LABELS.wallet}
        </h1>
        <p className="mt-2 max-w-2xl text-body text-ink-muted">
          {LABELS.walletPageDescription}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        <WalletBalanceCard
          balance={balanceQuery.data?.points ?? balanceQuery.data?.balance ?? 0}
          purchasedBalance={balanceQuery.data?.purchasedBalance}
          promotionalBalance={balanceQuery.data?.promotionalBalance}
          isLoading={balanceQuery.isLoading}
          className="h-full"
        />
        <WalletRechargePanel
          balance={balanceQuery.data}
          isLoading={balanceQuery.isLoading}
          className="h-full"
        />
      </div>

      <div className="mt-6 lg:mt-8">
        <WalletStatementExportPanel />
      </div>

      <section
        className="mt-8 overflow-hidden border border-line bg-surface-raised shadow-elevation-1 lg:mt-10"
        aria-labelledby="wallet-transaction-history"
      >
        <header className="border-b border-line/80 bg-paper/50 px-5 py-4 md:px-6">
          <h2 id="wallet-transaction-history" className="text-body font-semibold text-ink">
            {LABELS.walletTransactionHistory}
          </h2>
        </header>
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
      </section>
    </div>
  );
}
