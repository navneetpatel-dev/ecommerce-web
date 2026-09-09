"use client";

import { LABELS } from "@/shared/constants/labels";
import { KeysetDataTable } from "@/shared/components/KeysetDataTable.component";
import type { SupportTicket } from "../../api/list/supportTickets.api";
import { useTicketTableColumns } from "./useTicketTableColumns.hook";
import { useTicketListHandlers } from "./useTicketListHandlers.hook";

interface TicketListProps {
  tickets: SupportTicket[];
  detailHref: (id: string) => string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  toolbar?: React.ReactNode;
  title?: React.ReactNode;
  showCustomer?: boolean;
  showVendor?: boolean;
}

export function TicketList({
  tickets,
  detailHref,
  isLoading,
  isError,
  errorMessage,
  emptyMessage = LABELS.supportTicketsEmpty,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onRefresh,
  toolbar,
  title,
  showCustomer,
  showVendor,
}: TicketListProps) {
  const columns = useTicketTableColumns({ showCustomer, showVendor });
  const { handleRowClick, getRowId } = useTicketListHandlers(detailHref);

  return (
    <KeysetDataTable
      title={title}
      toolbar={toolbar}
      columns={columns}
      rows={tickets}
      getRowId={getRowId}
      loading={isLoading}
      error={isError ? errorMessage || LABELS.ticketCouldNotLoad : null}
      emptyMessage={emptyMessage}
      onRefresh={onRefresh}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={onLoadMore}
      onRowClick={handleRowClick}
    />
  );
}
