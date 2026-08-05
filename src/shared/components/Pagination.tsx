import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import type { PaginationItem } from '@/shared/utils/pagination'

interface PaginationProps {
  currentPage: number
  totalPages: number
  isMobile: boolean
  items: PaginationItem[]
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  isMobile,
  items,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  if (isMobile) {
    return (
      <div className="flex items-center justify-center gap-3 mt-8">
        <DisabledActionHint disabled={currentPage <= 1} message="You're on the first page.">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={16} />
          </Button>
        </DisabledActionHint>
        <span className="text-[0.8125rem] text-ink-muted">Page {currentPage} of {totalPages}</span>
        <DisabledActionHint disabled={currentPage >= totalPages} message="You're on the last page.">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight size={16} />
          </Button>
        </DisabledActionHint>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-8">
      <DisabledActionHint disabled={currentPage <= 1} message="You're on the first page.">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>
      </DisabledActionHint>
      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex h-9 min-w-9 items-center justify-center text-[0.8125rem] text-ink-muted"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant={currentPage === item ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(item)}
            aria-current={currentPage === item ? 'page' : undefined}
            className={
              currentPage === item
                ? 'bg-brand-subtle text-brand hover:bg-brand-subtle'
                : ''
            }
          >
            {item}
          </Button>
        )
      )}
      <DisabledActionHint disabled={currentPage >= totalPages} message="You're on the last page.">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  )
}
