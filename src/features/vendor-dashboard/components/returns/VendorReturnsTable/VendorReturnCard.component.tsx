import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { vendorReturnsTableStyles } from "../../../styles/returns/vendorReturnsTable.styles";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";
import { VendorReturnPhotosCell } from "./VendorReturnPhotosCell.component";
import { VendorReturnRestockAction } from "./VendorReturnRestockAction.component";

interface VendorReturnCardProps {
  row: VendorReturnRowViewModel;
}

export function VendorReturnCard({ row }: VendorReturnCardProps) {
  return (
    <li className={vendorReturnsTableStyles.mobileCard}>
      <div className={vendorReturnsTableStyles.mobileCardHeader}>
        <div>
          <p className={vendorReturnsTableStyles.mobileCardProduct}>
            {row.productLabel}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {row.returnReference}
            {row.orderReference ? ` · ${row.orderReference}` : ""}
          </p>
        </div>
        <StatusBadge status={row.status} label={row.statusLabel} />
      </div>
      <p className={vendorReturnsTableStyles.mobileCardMeta}>
        {row.customerLabel}
      </p>
      <p className={vendorReturnsTableStyles.mobileCardMeta}>
        {row.reasonLabel}
      </p>
      <p className={vendorReturnsTableStyles.mobileCardPickup}>
        {row.pickupLabel}
      </p>
      <div className={vendorReturnsTableStyles.mobileCardPhotos}>
        <VendorReturnPhotosCell
          images={row.images}
          productName={row.productLabel}
        />
      </div>
      <div className={vendorReturnsTableStyles.mobileCardActions}>
        <VendorReturnRestockAction row={row} />
      </div>
    </li>
  );
}
