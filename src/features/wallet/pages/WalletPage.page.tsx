"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useWalletBalance, useWalletTransactions } from "../api/wallet.queries";
import { WalletBalanceCard } from "../components/WalletPageContent.component";
import { WalletRechargePanel } from "../components/WalletRechargePanel.component";
import { WalletStatementExportPanel } from "../components/WalletStatementExportPanel.component";
import { WalletTransactionsTable } from "../components/WalletTransactionsTable.component";
import { walletApi } from "../api/wallet.api";

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
          isLoading={walletSectionLoading}
          className="h-full"
        />
        <WalletRechargePanel
          balance={balanceQuery.data}
          isLoading={walletSectionLoading}
          className="h-full"
        />
      </div>

      <div className="mt-6 lg:mt-8">
        <WalletStatementExportPanel isLoading={walletSectionLoading} />
      </div>

      <section className="mt-8 lg:mt-10">
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
