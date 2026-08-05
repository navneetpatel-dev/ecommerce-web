'use client'

import { useMediaQuery } from '@/shared/hooks/use-media-query'
import { Pagination } from '@/shared/components/Pagination'

interface PaginationContainerProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationContainer({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationContainerProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      isMobile={isMobile}
      onPageChange={onPageChange}
    />
  )
}
