"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { useMyReturns } from "../api/returns.queries";
import { ReturnRequestCard } from "../components/ReturnRequestCard.component";

export function MyReturnsPage() {
  const { data, isLoading, isError, error } = useMyReturns();
  const returns = data ?? [];

  return (
    <div className="storefront-container py-8 md:py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-[1.75rem] text-ink md:text-[2rem]">
          {LABELS.returnsPageTitle}
        </h1>
        <p className="mt-2 text-body text-ink-muted">
          {LABELS.returnsPageDescription}
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : isError ? (
        <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
          {(error as Error)?.message || LABELS.couldNotLoadReturns}
        </p>
      ) : returns.length === 0 ? (
        <div className="border border-dashed border-line bg-paper/50">
          <EmptyState
            icon={RotateCcw}
            heading={LABELS.noReturnsYet}
            message={LABELS.noReturnsYetMessage}
            actionLabel={LABELS.viewOrders}
            actionTo={PATHS.orders}
            className="py-14"
          />
        </div>
      ) : (
        <ul className="space-y-4">
          {returns.map((row) => (
            <li key={row.id}>
              <Link
                href={PATHS.myReturn(row.id)}
                className="block transition-colors hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <ReturnRequestCard row={row} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
