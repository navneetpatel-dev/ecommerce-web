'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { useMediaQuery } from '@/shared/hooks/use-media-query'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')

  if (totalPages <= 1) return null

  if (isMobile) {
    return (
      <div className="flex items-center justify-center gap-3 mt-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="text-[0.8125rem] text-ink-muted">Page {currentPage} of {totalPages}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-center gap-2 mt-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft size={16} />
      </Button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(i + 1)}
          className={currentPage === i + 1 ? 'bg-brand text-white hover:bg-brand-hover' : ''}
        >
          {i + 1}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}
