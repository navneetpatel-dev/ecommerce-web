'use client'

import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

const DEFAULT_MAX_INLINE = 2

interface TableRowActionsProps {
  children: ReactNode
  /** Show actions inline when count is ≤ this; otherwise use a ⋮ menu. */
  maxInline?: number
  className?: string
  menuClassName?: string
}

function flattenActionNodes(nodes: ReactNode): ReactNode[] {
  const out: ReactNode[] = []
  Children.forEach(nodes, (child) => {
    if (child == null || typeof child === 'boolean') return
    if (isValidElement(child) && child.type === Fragment) {
      out.push(...flattenActionNodes((child as ReactElement<{ children?: ReactNode }>).props.children))
      return
    }
    out.push(child)
  })
  return out
}

/**
 * Renders row action controls. When there are more than `maxInline` actions,
 * collapses them into a three-dot dropdown so table cells stay compact.
 */
export function TableRowActions({
  children,
  maxInline = DEFAULT_MAX_INLINE,
  className,
  menuClassName,
}: TableRowActionsProps) {
  const items = flattenActionNodes(children)

  if (items.length === 0) return null

  if (items.length <= maxInline) {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
        {items}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-ink-muted hover:text-ink"
            aria-label={LABELS.moreActions}
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className={cn(
            'z-[80] w-auto min-w-[11rem] max-w-[16rem] space-y-1.5 p-2',
            '[&_button]:h-auto [&_button]:w-full [&_button]:justify-start [&_button]:whitespace-normal',
            menuClassName,
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-0">
              {item}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
