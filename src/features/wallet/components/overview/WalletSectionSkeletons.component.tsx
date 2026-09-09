import type { ReactNode } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/dom/cn";
import { walletSectionSkeletonsStyles as styles } from "../../styles/overview/walletSectionSkeletons.styles";

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
      <Skeleton className={styles.skeletonEyebrow} />
      <Skeleton className={styles.skeletonTitle} />
      <Skeleton className={styles.skeletonSubtitle} />
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
      <Skeleton className={styles.skeletonHeading} />
      <Skeleton className={styles.skeletonTextMd} />
      <Skeleton className={styles.skeletonTextLg} />
      <div className={styles.rechargePillGrid}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className={styles.rechargePill} />
        ))}
      </div>
      <div className={styles.rechargeInputRow}>
        <Skeleton className={styles.skeletonLabel} />
        <div className={styles.rechargeInputGrid}>
          <Skeleton className={styles.rechargeInput} />
          <Skeleton className={styles.rechargeButton} />
        </div>
      </div>
      <Skeleton className={styles.skeletonTerms} />
    </CardShell>
  );
}

export function WalletStatementExportPanelSkeleton() {
  return (
    <section className={styles.statementSection} aria-busy="true" aria-hidden>
      <header className={styles.statementHeader}>
        <Skeleton className={styles.skeletonStatementHeading} />
      </header>
      <div className={styles.statementGrid}>
        <div className={styles.statementField}>
          <Skeleton className={styles.skeletonFieldLabelSm} />
          <Skeleton className={styles.statementFieldControl} />
        </div>
        <div className={styles.statementField}>
          <Skeleton className={styles.skeletonFieldLabelXs} />
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
