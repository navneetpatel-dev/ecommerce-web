import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { vendorReturnsTableStyles } from "../../../styles/returns/vendorReturnsTable.styles";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";
import { VendorReturnPhotosCell } from "./VendorReturnPhotosCell.component";

interface VendorReturnCardProps {
  row: VendorReturnRowViewModel;
}

export function VendorReturnCard({ row }: VendorReturnCardProps) {
  return (
    <li className={vendorReturnsTableStyles.mobileCard}>
      <div className={vendorReturnsTableStyles.mobileCardHeader}>
        <p className={vendorReturnsTableStyles.mobileCardProduct}>
          {row.productLabel}
        </p>
        <StatusBadge status={row.status} label={row.statusLabel} />
      </div>
      <p className={vendorReturnsTableStyles.mobileCardMeta}>
        {row.customerLabel}
      </p>
      <p className={vendorReturnsTableStyles.mobileCardMeta}>{row.reasonLabel}</p>
      <p className={vendorReturnsTableStyles.mobileCardPickup}>
        {row.pickupLabel}
      </p>
      <div className={vendorReturnsTableStyles.mobileCardPhotos}>
        <VendorReturnPhotosCell
          images={row.images}
          productName={row.productLabel}
        />
      </div>
    </li>
  );
}
