import type { SubOrder } from "@/shared/api/types";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { StatusBadge } from "@/shared/components/StatusBadge";

interface SubOrderCardHeaderProps {
  vendorName: string;
  itemCount: number;
  status: SubOrder["status"];
}

export function SubOrderCardHeader({
  vendorName,
  itemCount,
  status,
}: SubOrderCardHeaderProps) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2">
      <div className="flex flex-wrap items-baseline gap-2">
        <TextEyebrow className="!mb-0">Sold by</TextEyebrow>
        <h2 className="font-display text-[1.125rem] text-ink">{vendorName}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
          {itemCount} {itemCount === 1 ? "piece" : "pieces"}
        </span>
        <div className="inline-flex items-center gap-1.5">
          <span className="text-[0.6875rem] font-medium text-ink-faint">
            Shipment
          </span>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}
