import Link from "next/link";
import { Star } from "lucide-react";
import type { VendorInfo } from "@/shared/api/types";
import { PATHS } from "@/shared/constants/paths/paths";
import { cn } from "@/shared/utils/dom/cn";
import { vendorStripStyles } from "../../styles/orders/vendorOrderComponents.styles";
import { VendorLogo } from "./VendorLogo.component";

interface VendorStripProps {
  vendor: VendorInfo;
  size?: "sm" | "md";
  rating?: number;
  className?: string;
}

export function VendorStrip({
  vendor,
  size = "sm",
  rating,
  className,
}: VendorStripProps) {
  if (!vendor) return null;

  const businessName = vendor.businessName || "Vendor";

  return (
    <Link
      href={`${PATHS.products}?vendorId=${vendor.id}`}
      className={cn(
        vendorStripStyles.link,
        size === "md" && vendorStripStyles.sizeMd,
        className,
      )}
    >
      <VendorLogo logoUrl={vendor.logoUrl} businessName={businessName} />
      <span
        className={cn(
          vendorStripStyles.name,
          size === "md" && vendorStripStyles.nameMd,
        )}
      >
        {businessName}
      </span>
      {rating !== undefined && (
        <span className={vendorStripStyles.ratingWrap}>
          <Star className={vendorStripStyles.star} />
          {rating.toFixed(1)}
        </span>
      )}
    </Link>
  );
}
