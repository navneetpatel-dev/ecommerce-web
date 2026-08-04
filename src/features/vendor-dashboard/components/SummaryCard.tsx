import { StatCard } from '@/shared/components/StatCard'
import type { LucideIcon } from 'lucide-react'

interface SummaryCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  valueClassName?: string
}

export function SummaryCard({ title, value, icon, valueClassName }: SummaryCardProps) {
  return <StatCard title={title} value={value} icon={icon} valueClassName={valueClassName} />
}
