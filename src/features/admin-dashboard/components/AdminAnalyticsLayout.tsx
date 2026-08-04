import { AdminAnalyticsCard } from './AdminAnalyticsCard'
import { AnalyticsList } from './AnalyticsList'

interface AdminAnalyticsData {
  gmv: number
  topVendors: any[]
  topCategories: any[]
}

interface AdminAnalyticsLayoutProps {
  data: AdminAnalyticsData
}

export function AdminAnalyticsLayout({ data }: AdminAnalyticsLayoutProps) {
  return (
    <div className="space-y-8">
      <AdminAnalyticsCard title="Gross Merchandise Volume" value={`₹${data.gmv}`} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Order Volume Trend</h3>
          <p className="text-ink/50 text-sm">Chart available only on supported renderers</p>
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
