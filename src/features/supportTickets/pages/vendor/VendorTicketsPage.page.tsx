"use client";

import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { PATHS } from "@/shared/constants/paths/paths";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions/permissions";
import { Suspense } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useVendorTicketsInfinite } from "../../api/list/supportTickets.queries";
import {
  TicketFilters,
  useTicketFiltersFromUrl,
} from "../../components/filters/TicketFilters.component";
import { TicketList } from "../../components/list/TicketList.component";
import { supportTicketsPagesStyles } from "../customer/supportTicketsPages.styles";

export function VendorTicketsPage() {
  return (
    <RequirePermission permission={VENDOR_SUPPORT_ACCESS}>
      <Suspense
        fallback={
          <Skeleton className={supportTicketsPagesStyles.skeletonFallback} />
        }
      >
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
    <div className={supportTicketsPagesStyles.vendorPageStack}>
      <TicketFilters showVendorId={false} />
      <TicketList
        title={
          <div className={supportTicketsPagesStyles.vendorTitleStack}>
            <h1 className={supportTicketsPagesStyles.titleHeading}>
              {LABELS.supportTickets}
            </h1>
            <p className={supportTicketsPagesStyles.vendorTitleDescription}>
              {LABELS.ticketVendorQueueDescription}
            </p>
          </div>
        }
        tickets={tickets}
        detailHref={PATHS.vendor.supportTicket}
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
        onRefresh={() => void query.refetch()}
        showCustomer
      />
    </div>
  );
}
