"use client";

import { useMediaQuery } from "@/shared/hooks/use-media-query.hook";
import { getPaginationItems } from "@/shared/utils/pagination";
import { Pagination } from "@/shared/components/Pagination.component";

interface PaginationContainerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationContainer({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationContainerProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const items = getPaginationItems(currentPage, totalPages);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      isMobile={isMobile}
      items={items}
      onPageChange={onPageChange}
    />
  );
}
