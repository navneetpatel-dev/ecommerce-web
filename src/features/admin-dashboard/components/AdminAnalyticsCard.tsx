import { StatCard } from '@/shared/components/StatCard'

interface AdminAnalyticsCardProps {
  title: string
  value: string | number
}

export function AdminAnalyticsCard({ title, value }: AdminAnalyticsCardProps) {
  return <StatCard title={title} value={value} />
}
