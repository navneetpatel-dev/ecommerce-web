import type { ProductVariant } from "@/shared/api/types";

export interface SpecRow {
  label: string;
  value: string;
}

export interface UseProductSpecificationsParams {
  specs?:
    | Record<string, unknown>
    | Array<{ key?: string; name?: string; value?: unknown }>
    | string
    | null;
  matchedVariant?: ProductVariant | null;
  categoryName?: string | null;
  displayStock: number;
  brand?: string | null;
  vendorName?: string | null;
  hsnCode?: string | null;
  warrantyMonths?: number | null;
  warrantyType?: string | null;
  returnsAllowed?: boolean;
  returnWindowDays?: number | null;
  returnNote?: string | null;
  deliveryNote?: string | null;
  codAvailable?: boolean;
}
