import { StatCard } from '@/shared/components/StatCard'

interface BalanceCardProps {
  balance: number | undefined | null
  isLoading: boolean
}

export function BalanceCard({ balance, isLoading }: BalanceCardProps) {
  return (
    <StatCard
      title="Available Balance"
      value={`₹${balance ?? 0}`}
      size="lg"
      valueClassName="text-brand"
      isLoading={isLoading}
    />
  )
}
