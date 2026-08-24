"use client";

import { Suspense } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { useAdminTicketsInfinite } from "../api/supportTickets.queries";
import {
  TicketFilters,
  useTicketFiltersFromUrl,
} from "../components/TicketFilters.component";
import { TicketList } from "../components/TicketList.component";

export function AdminTicketsPage() {
  return (
    <RequirePermission permission={PERMISSIONS.TICKET_MANAGE}>
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <AdminTicketsContent />
      </Suspense>
    </RequirePermission>
  );
}

function AdminTicketsContent() {
  const filters = useTicketFiltersFromUrl();
  const query = useAdminTicketsInfinite(filters);
  const tickets = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="w-full min-w-0 space-y-5">
      <TicketFilters />
      <TicketList
        title={
          <div className="min-w-0 space-y-1">
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {LABELS.supportTickets}
            </h1>
            <p className="text-body-sm text-ink-muted">
              {LABELS.ticketAdminQueueDescription}
            </p>
          </div>
        }
        tickets={tickets}
        detailHref={PATHS.admin.supportTicket}
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={(query.error as Error | null)?.message}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        onLoadMore={() => void query.fetchNextPage()}
        onRefresh={() => void query.refetch()}
        showCustomer
        showVendor
      />
    </div>
  );
}
