"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { useMyReturns } from "../../api/returns/returns.queries";
import { ReturnRequestCard } from "../../components/list/ReturnRequestCard.component";
import { returnsPageStyles as styles } from "./returnsPage.styles";

export function MyReturnsPage() {
  const { data, isLoading, isError, error } = useMyReturns();
  const returns = data ?? [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{LABELS.returnsPageTitle}</h1>
        <p className={styles.subtitle}>{LABELS.returnsPageDescription}</p>
      </header>

      {isLoading ? (
        <div className={styles.skeletonStack}>
          <Skeleton className={styles.skeleton} />
          <Skeleton className={styles.skeleton} />
        </div>
      ) : isError ? (
        <div className={styles.errorBox}>
          <QueryErrorAlert
            error={error}
            fallback={LABELS.couldNotLoadReturns}
          />
        </div>
      ) : returns.length === 0 ? (
        <div className={styles.emptyBox}>
          <EmptyState
            icon={RotateCcw}
            heading={LABELS.noReturnsYet}
            message={LABELS.noReturnsYetMessage}
            actionLabel={LABELS.viewOrders}
            actionTo={PATHS.orders}
            className={styles.emptyState}
          />
        </div>
      ) : (
        <ul className={styles.returnsList}>
          {returns.map((row) => (
            <li key={row.id}>
              <Link href={PATHS.myReturn(row.id)} className={styles.returnLink}>
                <ReturnRequestCard row={row} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
