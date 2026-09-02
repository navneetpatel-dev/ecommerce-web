import { SummaryCard } from "./SummaryCard.component";
import { Package, Truck, Banknote, Clock } from "lucide-react";
import type { VendorSummary } from "@/shared/api/types";
import { formatInr } from "@/shared/utils/orderFormat";

interface VendorSummaryGridProps {
  summary?: VendorSummary;
}

export function VendorSummaryGrid({ summary }: VendorSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryCard
        title="Today's Orders"
        value={summary?.todayOrders ?? 0}
        icon={Package}
      />
      <SummaryCard
        title="Pending Shipments"
        value={summary?.pendingShipments ?? 0}
        icon={Truck}
      />
      <SummaryCard
        title="Month Revenue"
        value={formatInr(summary?.monthRevenue ?? 0)}
        icon={Banknote}
        valueClassName="text-success"
      />
      <SummaryCard
        title="Pending Payouts"
        value={formatInr(summary?.pendingPayouts ?? 0)}
        icon={Clock}
      />
    </div>
  );
}
