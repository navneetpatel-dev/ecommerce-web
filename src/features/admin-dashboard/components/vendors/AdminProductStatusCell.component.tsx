import { ProductAboveMrpNote } from "@/features/products";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";

/** A product's status, with a note when it has options that stopped selling above their MRP. */
export function AdminProductStatusCell({ row }: { row: AdminDataRow }) {
  const variants = (row.variants ?? []) as Array<{ aboveMrp?: boolean }>;
  return (
    <>
      <StatusBadge status={String(row.status ?? "")} />
      <ProductAboveMrpNote
        all={Boolean(row.aboveMrp)}
        count={variants.filter((variant) => variant.aboveMrp).length}
      />
    </>
  );
}
