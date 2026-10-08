"use client";

import { useState } from "react";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { scrollPageTopOnPageChange } from "@/shared/utils/navigation/paginationScroll";

export function useServerPagination(
  initialPage = 1,
  pageSize = DEFAULT_PAGE_LIMIT,
) {
  const [page, setPage] = useState(initialPage);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    scrollPageTopOnPageChange();
  };

  return {
    page,
    pageSize,
    setPage,
    onPageChange: handlePageChange,
    resetPage: () => setPage(1),
  };
}
