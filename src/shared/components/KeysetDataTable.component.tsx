"use client";

import type { ReactNode } from "react";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { InfiniteLoadMore } from "@/shared/components/InfiniteLoadMore.component";

type Props<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T, index: number) => string;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRefresh?: () => void;
  onRowClick?: (row: T) => void;
  title?: ReactNode;
  toolbar?: ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  rowDetails?: boolean;
};

export function KeysetDataTable<T>({
  columns,
  rows,
  getRowId,
  loading,
  error,
  emptyMessage,
  onRefresh,
  onRowClick,
  title,
  toolbar,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  rowDetails = false,
}: Props<T>) {
  return (
    <div className="space-y-4">
      <DataTable
        title={title}
        toolbar={toolbar}
        columns={columns}
        rows={rows}
        getRowId={getRowId}
        loading={loading}
        error={error}
        emptyMessage={emptyMessage}
        onRefresh={onRefresh}
        rowDetails={rowDetails}
        onRowClick={onRowClick}
      />
      <InfiniteLoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />
    </div>
  );
}
