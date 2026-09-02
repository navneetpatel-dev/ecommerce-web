import type { ReactNode } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/cn";

function CardShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-6",
        className,
      )}
      aria-busy="true"
      aria-hidden
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/30 via-brand/15 to-transparent"
      />
      {children}
    </div>
  );
}

export function WalletBalanceCardSkeleton({ className }: { className?: string }) {
  return (
    <CardShell className={className}>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-10 w-44" />
      <Skeleton className="mt-3 h-4 w-52 max-w-full" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-[4.25rem] rounded-md" />
        <Skeleton className="h-[4.25rem] rounded-md" />
      </div>
    </CardShell>
  );
}

export function WalletRechargePanelSkeleton({ className }: { className?: string }) {
  return (
    <CardShell className={className}>
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-2 h-4 w-full max-w-md" />
      <Skeleton className="mt-2 h-3 w-full max-w-lg" />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-9 rounded-md" />
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-28" />
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 w-full rounded-md sm:w-40" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full max-w-xl" />
    </CardShell>
  );
}

export function WalletStatementExportPanelSkeleton() {
  return (
    <section
      className="overflow-hidden rounded-md border border-line bg-surface shadow-card-hairline"
      aria-busy="true"
      aria-hidden
    >
      <header className="border-b border-line/80 bg-paper/50 px-4 py-4 sm:px-6 sm:py-5">
        <Skeleton className="h-5 w-40" />
      </header>
      <div className="grid gap-5 p-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 sm:p-6 xl:grid-cols-3 lg:gap-x-8 lg:p-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-10 rounded-md" />
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-3">
          <Skeleton className="h-10 w-full rounded-md sm:w-32" />
          <Skeleton className="h-10 w-full rounded-md sm:w-28" />
          <Skeleton className="h-10 w-full rounded-md sm:w-28" />
        </div>
      </div>
    </section>
  );
}
