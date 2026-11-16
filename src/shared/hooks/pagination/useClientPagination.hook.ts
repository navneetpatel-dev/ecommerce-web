"use client";

import { useMemo, useState } from "react";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { scrollPageTopOnPageChange } from "@/shared/utils/navigation/paginationScroll";

export function useClientPagination<T>(
  rows: T[],
  pageSize = DEFAULT_PAGE_LIMIT,
) {
  const [page, setPage] = useState(1);
  const safeSize = Number.isFinite(pageSize)
    ? Math.max(1, Math.floor(pageSize))
    : DEFAULT_PAGE_LIMIT;
  const total = Array.isArray(rows) ? rows.length : 0;
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const validPage = Number.isFinite(page) ? Math.floor(page) : 1;
  const currentPage = Math.min(Math.max(1, validPage), totalPages);

  const pageRows = useMemo(() => {
    if (!Array.isArray(rows)) return [];
    const start = (currentPage - 1) * safeSize;
    return rows.slice(start, start + safeSize);
  }, [rows, currentPage, safeSize]);

  const from = total === 0 ? 0 : (currentPage - 1) * safeSize + 1;
  const to = Math.min(currentPage * safeSize, total);

  const handlePageChange = (nextPage: number) => {
    const safeNext = Number.isFinite(nextPage)
      ? Math.min(Math.max(1, Math.floor(nextPage)), totalPages)
      : 1;
    setPage(safeNext);
    scrollPageTopOnPageChange();
  };

  return {
    page: currentPage,
    pageSize: safeSize,
    total,
    totalPages,
    pageRows,
    from,
    to,
    setPage,
    onPageChange: handlePageChange,
  };
}
