"use client";

import { useMemo, useState } from "react";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";

export function useClientPagination<T>(
  rows: T[],
  pageSize = DEFAULT_PAGE_LIMIT,
) {
  const [page, setPage] = useState(1);
  const safeSize = Math.max(1, pageSize);
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * safeSize;
    return rows.slice(start, start + safeSize);
  }, [rows, currentPage, safeSize]);

  const from = total === 0 ? 0 : (currentPage - 1) * safeSize + 1;
  const to = Math.min(currentPage * safeSize, total);

  return {
    page: currentPage,
    pageSize: safeSize,
    total,
    totalPages,
    pageRows,
    from,
    to,
    setPage,
    onPageChange: setPage,
  };
}
