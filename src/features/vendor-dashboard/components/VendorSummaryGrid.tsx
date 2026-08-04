import { SummaryCard } from './SummaryCard'
import { Package, Truck, Banknote, Clock } from 'lucide-react'

interface VendorSummary {
  todayOrders?: number
  pendingShipments?: number
  monthRevenue?: number
  walletBalance?: number
}

interface VendorSummaryGridProps {
  summary?: VendorSummary
}

export function VendorSummaryGrid({ summary }: VendorSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryCard title="Today's Orders" value={summary?.todayOrders ?? 0} icon={Package} />
      <SummaryCard title="Pending Shipments" value={summary?.pendingShipments ?? 0} icon={Truck} />
      <SummaryCard title="Month Revenue" value={`₹${summary?.monthRevenue ?? 0}`} icon={Banknote} valueClassName="text-success" />
      <SummaryCard title="Wallet Balance" value={`₹${summary?.walletBalance ?? 0}`} icon={Clock} />
    </div>
  )
}
