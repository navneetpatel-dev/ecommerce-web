"use client";

import { LifeBuoy } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { FormError } from "@/shared/components/FormError.component";
import { InfiniteLoadMore } from "@/shared/components/InfiniteLoadMore.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import type { SupportTicket } from "../api/supportTickets.api";
import { ticketCardListStyles } from "./ticketCardList.styles";
import { TicketCardsGrid } from "./TicketCardsGrid.component";

interface TicketCardListProps {
  tickets: SupportTicket[];
  detailHref: (id: string) => string;
  createHref: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export function TicketCardList({
  tickets,
  detailHref,
  createHref,
  isLoading,
  isError,
  errorMessage,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: TicketCardListProps) {
  if (isLoading) {
    return (
      <div className={ticketCardListStyles.grid}>
        <Skeleton className={ticketCardListStyles.skeleton} />
        <Skeleton className={ticketCardListStyles.skeleton} />
        <Skeleton className={ticketCardListStyles.skeleton} />
      </div>
    );
  }

  if (isError) {
    return (
      <FormError
        error={new Error(errorMessage || LABELS.ticketCouldNotLoad)}
        fallback={LABELS.ticketCouldNotLoad}
      />
    );
  }

  if (tickets.length === 0) {
    return (
      <div className={ticketCardListStyles.emptyWrapper}>
        <EmptyState
          icon={LifeBuoy}
          heading={LABELS.supportTicketsEmpty}
          message={LABELS.supportTicketsEmptyMessage}
          actionLabel={LABELS.createSupportTicket}
          actionTo={createHref}
          className={ticketCardListStyles.emptyState}
        />
      </div>
    );
  }

  return (
    <div className={ticketCardListStyles.container}>
      <TicketCardsGrid tickets={tickets} detailHref={detailHref} />

      <InfiniteLoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />
    </div>
  );
}
