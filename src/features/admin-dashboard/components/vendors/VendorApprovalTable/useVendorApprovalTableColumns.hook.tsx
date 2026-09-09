import { useMemo } from "react";
import type { DataTableColumn } from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";

interface Vendor {
  id: string;
  businessName: string;
  slug: string;
  kycComplete?: boolean;
}

export function useVendorApprovalTableColumns() {
  const columns: DataTableColumn<Vendor>[] = useMemo(
    () => [
      {
        id: "businessName",
        header: LABELS.businessName,
        className: "font-medium",
        accessor: "businessName",
      },
      {
        id: "slug",
        header: LABELS.slug,
        className: "text-ink-muted",
        accessor: "slug",
      },
      {
        id: "kyc",
        header: LABELS.kycChecklist,
        cell: (v) =>
          v.kycComplete
            ? LABELS.kycChecklistComplete
            : LABELS.kycChecklistIncomplete,
      },
    ],
    [],
  );

  return columns;
}
