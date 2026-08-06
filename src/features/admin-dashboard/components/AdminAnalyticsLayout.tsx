import { AdminAnalyticsCard } from './AdminAnalyticsCard'
import { AnalyticsList } from './AnalyticsList'

interface AdminAnalyticsData {
  gmv: number
  topVendors: any[]
  topCategories: any[]
  orderVolume: Array<{ date: string; count: number }>
}

interface AdminAnalyticsLayoutProps {
  data: AdminAnalyticsData
}

export function AdminAnalyticsLayout({ data }: AdminAnalyticsLayoutProps) {
  const maxOrderCount = Math.max(...(data.orderVolume?.map((item) => item.count) ?? [0]), 1)

  return (
    <div className="space-y-8">
      <AdminAnalyticsCard title="Gross Merchandise Volume" value={`₹${data.gmv}`} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Order Volume Trend</h3>
          <div className="rounded-md border border-line bg-surface p-4">
            <div className="-mx-1 overflow-x-auto px-1">
              <div className="flex h-48 min-w-[28rem] items-end gap-3 sm:min-w-0">
                {data.orderVolume?.map((point) => (
                  <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
                    <div
                      className="w-full rounded-sm border border-brand/20 bg-brand-subtle"
                      style={{ height: `${Math.max((point.count / maxOrderCount) * 100, 8)}%` }}
                      aria-label={`${point.count} orders on ${point.date}`}
                    />
                    <div className="text-center">
                      <p className="text-[0.8125rem] font-medium text-ink">{point.count}</p>
                      <p className="max-w-full truncate text-[0.75rem] text-ink-muted sm:text-[0.8125rem]">
                        {point.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Top Vendors</h3>
          <AnalyticsList items={data.topVendors as any} labelKey="businessName" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Top Categories</h3>
        <AnalyticsList items={data.topCategories as any} labelKey="name" />
      </div>
    </div>
  )
}
