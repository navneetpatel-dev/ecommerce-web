"use client";

import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions";
import { Suspense } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useVendorTicketsInfinite } from "../api/supportTickets.queries";
import {
  TicketFilters,
  useTicketFiltersFromUrl,
} from "../components/TicketFilters.component";
import { TicketList } from "../components/TicketList.component";

export function VendorTicketsPage() {
  return (
    <RequirePermission permission={VENDOR_SUPPORT_ACCESS}>
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <VendorTicketsContent />
      </Suspense>
    </RequirePermission>
  );
}

function VendorTicketsContent() {
  const filters = useTicketFiltersFromUrl();
  const query = useVendorTicketsInfinite({
    status: filters.status,
    priority: filters.priority,
    category: filters.category,
  });
  const tickets = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="w-full min-w-0 space-y-8">
      <TicketFilters showVendorId={false} />
      <TicketList
        title={
          <div className="min-w-0 space-y-1.5">
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {LABELS.supportTickets}
            </h1>
            <p className="max-w-3xl text-body leading-relaxed text-ink-muted">
              {LABELS.ticketVendorQueueDescription}
            </p>
          </div>
        }
        tickets={tickets}
        detailHref={PATHS.vendor.supportTicket}
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={(query.error as Error | null)?.message}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        onLoadMore={() => void query.fetchNextPage()}
        onRefresh={() => void query.refetch()}
        showCustomer
      />
    </div>
  );
}
