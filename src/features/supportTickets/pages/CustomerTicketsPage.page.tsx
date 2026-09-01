"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { PATHS } from "@/shared/constants/paths";
import { useMyTicketsInfinite } from "../api/supportTickets.queries";
import { SupportAuthGate } from "../components/SupportAuthGate.component";
import { TicketCardList } from "../components/TicketCardList.component";
import {
  TicketFilters,
  useTicketFiltersFromUrl,
} from "../components/TicketFilters.component";

export function CustomerTicketsPage() {
  return (
    <SupportAuthGate
      message={LABELS.ticketSignInRequired}
      loginNext={PATHS.supportTickets}
    >
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <CustomerTicketsContent />
      </Suspense>
    </SupportAuthGate>
  );
}

function CustomerTicketsContent() {
  const filters = useTicketFiltersFromUrl();
  const query = useMyTicketsInfinite({
    status: filters.status,
    priority: filters.priority,
    category: filters.category,
  });
  const tickets = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="storefront-container py-8 md:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-2xl space-y-1">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.mySupportTickets}
          </h1>
          <p className="text-body text-ink-muted">
            {LABELS.supportTicketsPageDescription}
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href={PATHS.supportTicketNew}>
            {LABELS.createSupportTicket}
          </Link>
        </Button>
      </header>

      <div className="mb-5">
        <TicketFilters showVendorId={false} />
      </div>

      <TicketCardList
        tickets={tickets}
        detailHref={PATHS.supportTicket}
        createHref={PATHS.supportTicketNew}
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={
          query.error
            ? getApiErrorMessage(query.error, LABELS.ticketCouldNotLoad)
            : undefined
        }
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        onLoadMore={() => void query.fetchNextPage()}
      />
    </div>
  );
}
