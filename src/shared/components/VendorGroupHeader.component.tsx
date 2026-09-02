import Link from "next/link";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

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
  const nameClassName = "font-display text-[1.125rem] text-ink";

  return (
    <div
      className={cn(
        "mb-3 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <TextEyebrow className="!mb-0">{LABELS.soldBy}</TextEyebrow>
        {vendorId ? (
          <NameTag className={nameClassName}>
            <Link
              href={`${PATHS.products}?vendorId=${vendorId}`}
              className="transition-colors hover:text-brand"
            >
              {vendorName}
            </Link>
          </NameTag>
        ) : (
          <NameTag className={nameClassName}>{vendorName}</NameTag>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[0.6875rem] uppercase tracking-wider text-ink-faint">
          {count} {count === 1 ? LABELS.itemSingular : LABELS.itemPlural}
        </span>
        {trailing}
      </div>
    </div>
  );
}
