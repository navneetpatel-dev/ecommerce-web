"use client";

import { Suspense } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAdminTicketsInfinite } from "../../api/list/supportTickets.queries";
import {
  TicketFilters,
  useTicketFiltersFromUrl,
} from "../../components/filters/TicketFilters.component";
import { TicketList } from "../../components/list/TicketList.component";
import { supportTicketsPagesStyles } from "../customer/supportTicketsPages.styles";

export function AdminTicketsPage() {
  return (
    <RequirePermission permission={PERMISSIONS.TICKET_MANAGE}>
      <Suspense
        fallback={
          <Skeleton className={supportTicketsPagesStyles.skeletonFallback} />
        }
      >
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
    <div className={supportTicketsPagesStyles.adminPageStack}>
      <TicketFilters />
      <TicketList
        title={
          <div className={supportTicketsPagesStyles.adminTitleStack}>
            <h1 className={supportTicketsPagesStyles.titleHeading}>
              {LABELS.supportTickets}
            </h1>
            <p className={supportTicketsPagesStyles.adminTitleDescription}>
              {LABELS.ticketAdminQueueDescription}
            </p>
          </div>
        }
        tickets={tickets}
        detailHref={PATHS.admin.supportTicket}
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
        showVendor
      />
    </div>
  );
}
