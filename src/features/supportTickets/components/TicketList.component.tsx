"use client";

import { useRouter } from "next/navigation";
import { type DataTableColumn } from "@/shared/components/DataTable.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import type { SupportTicket } from "../api/supportTickets.api";
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
} from "../utils/labels";
import { KeysetDataTable } from "@/shared/components/KeysetDataTable.component";

type Props = {
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
};

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
}: Props) {
  const router = useRouter();

  const columns: DataTableColumn<SupportTicket>[] = [
    {
      id: "ticketNumber",
      header: LABELS.ticketNumber,
      cell: (row) => (
        <span className="font-mono text-body-sm tabular-nums text-ink">
          {row.hasUnread ? (
            <span
              className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand align-middle"
              title={LABELS.ticketHasUnread}
            />
          ) : null}
          {row.ticketNumber}
        </span>
      ),
      className: "whitespace-nowrap",
    },
    {
      id: "subject",
      header: LABELS.ticketSubject,
      cell: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-ink">{row.subject}</p>
          {row.latestMessagePreview ? (
            <p className="mt-0.5 line-clamp-1 text-body-sm text-ink-muted">
              {row.latestMessagePreview}
            </p>
          ) : null}
        </div>
      ),
      truncate: false,
    },
    ...(showCustomer
      ? [
          {
            id: "customerName",
            header: LABELS.ticketCustomer,
            cell: (row: SupportTicket) => row.customerName || LABELS.emptyCell,
          } satisfies DataTableColumn<SupportTicket>,
        ]
      : []),
    ...(showVendor
      ? [
          {
            id: "vendorName",
            header: LABELS.ticketVendor,
            cell: (row: SupportTicket) => row.vendorName || LABELS.emptyCell,
            hideOnMobile: true,
          } satisfies DataTableColumn<SupportTicket>,
        ]
      : []),
    {
      id: "category",
      header: LABELS.category,
      cell: (row) => TICKET_CATEGORY_LABEL[row.category],
      hideOnMobile: true,
    },
    {
      id: "priority",
      header: LABELS.priority,
      cell: (row) => (
        <StatusBadge
          status={row.priority}
          label={TICKET_PRIORITY_LABEL[row.priority]}
        />
      ),
    },
    {
      id: "status",
      header: LABELS.status,
      cell: (row) => (
        <StatusBadge
          status={row.status}
          label={TICKET_STATUS_LABEL[row.status]}
        />
      ),
    },
    {
      id: "createdAt",
      header: LABELS.createdAt,
      cell: (row) => formatOrderDate(row.createdAt),
      hideOnMobile: true,
    },
  ];

  return (
    <KeysetDataTable
      title={title}
      toolbar={toolbar}
      columns={columns}
      rows={tickets}
      getRowId={(row) => row.id}
      loading={isLoading}
      error={isError ? errorMessage || LABELS.ticketCouldNotLoad : null}
      emptyMessage={emptyMessage}
      onRefresh={onRefresh}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={onLoadMore}
      onRowClick={(row) => router.push(detailHref(row.id))}
    />
  );
}
