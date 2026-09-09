import Link from "next/link";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { vendorGroupHeaderStyles } from "./vendorOrderComponents.styles";

interface VendorGroupHeaderProps {
  vendorName: string;
  /** Links the vendor name to their storefront when known. */
  vendorId?: string | null;
  /** Caller decides what it counts — cart totals quantity, orders count lines. */
  count: number;
  /** Heading level for the vendor name; sections on a page with an h1 use h2. */
  as?: "h2" | "h3" | "p";
  /** Trailing slot, e.g. a shipment status badge on the order detail card. */
  trailing?: React.ReactNode;
  className?: string;
}

/**
 * "Sold by <Vendor> — N items" rule above a vendor's lines.
 *
 * Shared by cart, order confirmation and order detail so the three surfaces
 * that group by seller stay visually identical.
 */
export function VendorGroupHeader({
  vendorName,
  vendorId,
  count,
  as: NameTag = "p",
  trailing,
  className,
}: VendorGroupHeaderProps) {
  const nameClassName = vendorGroupHeaderStyles.name;

  return (
    <div className={cn(vendorGroupHeaderStyles.header, className)}>
      <div className={vendorGroupHeaderStyles.leadingGroup}>
        <TextEyebrow className={vendorGroupHeaderStyles.eyebrow}>
          {LABELS.soldBy}
        </TextEyebrow>
        {vendorId ? (
          <NameTag className={nameClassName}>
            <Link
              href={`${PATHS.products}?vendorId=${vendorId}`}
              className={vendorGroupHeaderStyles.vendorLink}
            >
              {vendorName}
            </Link>
          </NameTag>
        ) : (
          <NameTag className={nameClassName}>{vendorName}</NameTag>
        )}
      </div>

      <div className={vendorGroupHeaderStyles.trailingGroup}>
        <span className={vendorGroupHeaderStyles.countText}>
          {count} {count === 1 ? LABELS.itemSingular : LABELS.itemPlural}
        </span>
        {trailing}
      </div>
    </div>
  );
}
