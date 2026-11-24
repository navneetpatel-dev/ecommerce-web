import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";

export interface ShippingZoneOption {
  id: string;
  name: string;
}

export interface AdminShippingRateRecord extends Record<string, unknown> {
  id?: string | number;
  zoneId?: string;
  method?: string;
  minWeightGrams?: number;
  maxWeightGrams?: number;
  price?: number;
  estimatedDays?: number;
  freeShippingThreshold?: number | null;
  vendorId?: string | null;
  zoneName?: string;
  vendorName?: string;
}

export interface RatesFilterOptions {
  rows: Record<string, unknown>[];
  zones: ShippingZoneOption[];
  vendors: Array<{ id: string; name: string }>;
  zoneFilter: string;
  methodFilter: string;
  vendorFilter: string;
  search: string;
}

export function filterShippingRatesRows({
  rows,
  zones,
  vendors,
  zoneFilter,
  methodFilter,
  vendorFilter,
  search,
}: RatesFilterOptions): AdminShippingRateRecord[] {
  const zoneNameById = new Map(zones.map((zone) => [zone.id, zone.name]));
  const vendorNameById = new Map(vendors.map((v) => [v.id, v.name]));

  let mapped: AdminShippingRateRecord[] = rows.map((raw) => {
    const row = raw as AdminShippingRateRecord;
    return {
      ...row,
      zoneName:
        zoneNameById.get(String(row.zoneId)) ?? String(row.zoneId ?? ""),
      vendorName: row.vendorId
        ? (vendorNameById.get(String(row.vendorId)) ?? String(row.vendorId))
        : shippingRatesLabels.allVendorsDefault,
    };
  });

  if (zoneFilter !== "ALL") {
    mapped = mapped.filter((r) => String(r.zoneId) === zoneFilter);
  }
  if (methodFilter !== "ALL") {
    mapped = mapped.filter((r) => r.method === methodFilter);
  }
  if (vendorFilter !== "ALL") {
    mapped = mapped.filter((r) => String(r.vendorId || "all") === vendorFilter);
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    mapped = mapped.filter((r) => {
      const matchZone = String(r.zoneName ?? "")
        .toLowerCase()
        .includes(q);
      const matchVendor = String(r.vendorName ?? "")
        .toLowerCase()
        .includes(q);
      const matchMethod = String(r.method ?? "")
        .toLowerCase()
        .includes(q);
      const matchPrice = String(r.price ?? "").includes(q);
      return matchZone || matchVendor || matchMethod || matchPrice;
    });
  }

  return mapped;
}
