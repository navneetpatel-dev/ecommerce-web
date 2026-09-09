import type { ReactNode } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { walletSectionSkeletonsStyles as styles } from "./walletSectionSkeletons.styles";

function CardShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(styles.cardShell, className)}
      aria-busy="true"
      aria-hidden
    >
      <div aria-hidden className={styles.accentStripe} />
      {children}
    </div>
  );
}

export function WalletBalanceCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <CardShell className={className}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-10 w-44" />
      <Skeleton className="mt-3 h-4 w-52 max-w-full" />
      <div className={styles.balanceTwoColGrid}>
        <Skeleton className={styles.balanceColCard} />
        <Skeleton className={styles.balanceColCard} />
      </div>
    </CardShell>
  );
}

export function WalletRechargePanelSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <CardShell className={className}>
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-2 h-4 w-full max-w-md" />
      <Skeleton className="mt-2 h-3 w-full max-w-lg" />
      <div className={styles.rechargePillGrid}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className={styles.rechargePill} />
        ))}
      </div>
      <div className={styles.rechargeInputRow}>
        <Skeleton className="h-4 w-28" />
        <div className={styles.rechargeInputGrid}>
          <Skeleton className={styles.rechargeInput} />
          <Skeleton className={styles.rechargeButton} />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full max-w-xl" />
    </CardShell>
  );
}

export function WalletStatementExportPanelSkeleton() {
  return (
    <section className={styles.statementSection} aria-busy="true" aria-hidden>
      <header className={styles.statementHeader}>
        <Skeleton className="h-5 w-40" />
      </header>
      <div className={styles.statementGrid}>
        <div className={styles.statementField}>
          <Skeleton className="h-4 w-12" />
          <Skeleton className={styles.statementFieldControl} />
        </div>
        <div className={styles.statementField}>
          <Skeleton className="h-4 w-8" />
          <Skeleton className={styles.statementFieldControl} />
        </div>
        <div className={styles.statementActionsRow}>
          <Skeleton className={styles.statementButtonSm} />
          <Skeleton className={styles.statementButtonXs} />
          <Skeleton className={styles.statementButtonXs} />
        </div>
      </div>
    </section>
  );
}
