'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { formatAnalyticsInr } from '../utils/analyticsFormat'

interface RankedItem {
  id: string
  label: string
  revenue: number
}

interface AnalyticsRankedListProps {
  title: string
  items: RankedItem[]
}

export function AnalyticsRankedList({ title, items }: AnalyticsRankedListProps) {
  const max = Math.max(...items.map((item) => item.revenue), 1)
  const total = items.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-[1.0625rem]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!items.length ? (
          <p className="py-8 text-center text-[0.9375rem] text-ink-muted">
            {LABELS.analyticsEmptyChart}
          </p>
        ) : (
          <ol className="space-y-4">
            {items.map((item, index) => {
              const width = Math.max((item.revenue / max) * 100, 4)
              const share = total > 0 ? Math.round((item.revenue / total) * 100) : 0
              return (
                <li key={item.id} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex min-w-0 items-baseline gap-2">
                      <span className="w-4 shrink-0 font-mono text-[0.75rem] text-ink-faint">
                        {index + 1}
                      </span>
                      <span className="truncate text-[0.9375rem] font-medium text-ink">
                        {item.label}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-[0.875rem] text-ink">
                      {formatAnalyticsInr(item.revenue)}
                    </span>
                  </div>
                  <div className="ml-6 h-1.5 overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <p className="ml-6 text-[0.6875rem] text-ink-faint">
                    {formatLabel(LABELS.analyticsRankShare, { value: String(share) })}
                  </p>
                </li>
              )
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
