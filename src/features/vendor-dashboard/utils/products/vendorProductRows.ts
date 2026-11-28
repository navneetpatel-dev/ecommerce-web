import type { ProductListItem } from "@/shared/api/types";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";

type RichProductItem = ProductListItem & {
  sku?: string;
  status?: string;
  listedByPlatform?: boolean;
  variants?: Array<{
    id: string;
    sku?: string;
    stock?: number;
    lowStockAt?: number;
    aboveMrp?: boolean;
  }>;
  rejectionNote?: string | null;
  aboveMrp?: boolean;
};

/** The vendor product table's rows, with the first variant's SKU and stock as fallbacks. */
export function toVendorProductRows(items?: RichProductItem[]) {
  return (items ?? []).map((product: RichProductItem) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.variants?.[0]?.sku ?? product.sku ?? "—",
    stock: product.stock ?? product.variants?.[0]?.stock ?? 0,
    lowStockAt: product.variants?.[0]?.lowStockAt ?? 5,
    basePrice: product.basePrice,
    status: product.status ?? PRODUCT_STATUS.LIVE,
    listedByPlatform: product.listedByPlatform,
    rejectionNote: product.rejectionNote,
    aboveMrp: product.aboveMrp,
    aboveMrpVariants: product.variants?.filter((v) => v.aboveMrp).length,
  }));
}
