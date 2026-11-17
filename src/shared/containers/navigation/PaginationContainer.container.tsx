"use client";

import { useMediaQuery } from "@/shared/hooks/responsive/use-media-query.hook";
import { getPaginationItems } from "@/shared/utils/pagination/pagination";
import { Pagination } from "@/shared/components/navigation/Pagination.component";
import { PageSizeSelector } from "@/shared/components/navigation/PageSizeSelector.component";

export interface PaginationContainerProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

export function PaginationContainer({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationContainerProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const items = getPaginationItems(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        isMobile={isMobile}
        items={items}
        onPageChange={onPageChange}
      />
      {pageSize != null && onPageSizeChange != null ? (
        <PageSizeSelector
          pageSize={pageSize}
          options={pageSizeOptions}
          onPageSizeChange={onPageSizeChange}
        />
      ) : null}
    </div>
  );
}
