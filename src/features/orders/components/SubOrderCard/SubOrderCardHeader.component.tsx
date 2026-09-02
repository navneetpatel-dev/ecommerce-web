import type { SubOrder } from "@/shared/api/types";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { VendorGroupHeader } from "@/shared/components/VendorGroupHeader.component";
import { LABELS } from "@/shared/constants/labels";

interface SubOrderCardHeaderProps {
  vendorName: string;
  vendorId?: string | null;
  itemCount: number;
  status: SubOrder["status"];
  className?: string;
}

export function SubOrderCardHeader({
  vendorName,
  vendorId,
  itemCount,
  status,
  className,
}: SubOrderCardHeaderProps) {
  return (
    <VendorGroupHeader
      vendorName={vendorName}
      vendorId={vendorId}
      count={itemCount}
      as="h2"
      className={className}
      trailing={
        <div className="inline-flex items-center gap-1.5">
          <span className="text-[0.6875rem] font-medium text-ink-faint">
            {LABELS.shipment}
          </span>
          <StatusBadge status={status} />
        </div>
      }
    />
  );
}
