import { SummaryCard } from "./SummaryCard.component";
import { Package, Truck, Banknote, Clock } from "lucide-react";
import type { VendorSummary } from "@/shared/api/types";
import { formatInr } from "@/shared/utils/orderFormat";

interface VendorSummaryGridProps {
  summary?: VendorSummary;
}

export function VendorSummaryGrid({ summary }: VendorSummaryGridProps) {
  const todayOrders = summary?.todayOrders ?? 0;
  const pendingShipments = summary?.pendingShipments ?? 0;
  const monthRevenue = formatInr(summary?.monthRevenue ?? 0);
  const pendingPayouts = formatInr(summary?.pendingPayouts ?? 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryCard title="Today's Orders" value={todayOrders} icon={Package} />
      <SummaryCard
        title="Pending Shipments"
        value={pendingShipments}
        icon={Truck}
      />
      <SummaryCard
        title="Month Revenue"
        value={monthRevenue}
        icon={Banknote}
        valueClassName="text-success"
      />
      <SummaryCard
        title="Pending Payouts"
        value={pendingPayouts}
        icon={Clock}
      />
    </div>
  );
}
