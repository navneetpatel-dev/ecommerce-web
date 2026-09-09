"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { PATHS } from "@/shared/constants/paths/paths";
import { useMyTicketsInfinite } from "../../api/list/supportTickets.queries";
import { SupportAuthGate } from "../../components/list/SupportAuthGate.component";
import { TicketCardList } from "../../components/list/TicketCardList.component";
import {
  TicketFilters,
  useTicketFiltersFromUrl,
} from "../../components/filters/TicketFilters.component";
import { supportTicketsPagesStyles } from "./supportTicketsPages.styles";

export function CustomerTicketsPage() {
  return (
    <SupportAuthGate
      message={LABELS.ticketSignInRequired}
      loginNext={PATHS.supportTickets}
    >
      <Suspense
        fallback={
          <Skeleton className={supportTicketsPagesStyles.skeletonFallback} />
        }
      >
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
    <div className={supportTicketsPagesStyles.customerPageContainer}>
      <header className={supportTicketsPagesStyles.customerHeaderRow}>
        <div className={supportTicketsPagesStyles.customerHeaderInfo}>
          <h1 className={supportTicketsPagesStyles.titleHeading}>
            {LABELS.mySupportTickets}
          </h1>
          <p className={supportTicketsPagesStyles.customerHeaderSubtitle}>
            {LABELS.supportTicketsPageDescription}
          </p>
        </div>
        <Button
          asChild
          className={supportTicketsPagesStyles.customerCreateButton}
        >
          <Link href={PATHS.supportTicketNew}>
            {LABELS.createSupportTicket}
          </Link>
        </Button>
      </header>

      <div className={supportTicketsPagesStyles.customerFiltersMargin}>
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
