interface AnalyticsListRow {
  id: string
  revenue: number
  [key: string]: string | number
}

interface AnalyticsListProps {
  items: AnalyticsListRow[]
  labelKey: string
}

export function AnalyticsList({ items, labelKey }: AnalyticsListProps) {
  if (!items?.length) return <p className="text-ink/50 text-sm py-2">No data</p>

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm py-2 border-b border-line last:border-0">
          <span>{String(item[labelKey])}</span>
          <span className="font-mono">₹{item.revenue}</span>
        </div>
      ))}
    </div>
  )
}
