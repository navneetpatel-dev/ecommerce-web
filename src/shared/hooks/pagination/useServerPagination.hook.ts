"use client";

import { useState } from "react";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";

export function useServerPagination(
  initialPage = 1,
  pageSize = DEFAULT_PAGE_LIMIT,
) {
  const [page, setPage] = useState(initialPage);

  return {
    page,
    pageSize,
    setPage,
    onPageChange: setPage,
    resetPage: () => setPage(1),
  };
}
