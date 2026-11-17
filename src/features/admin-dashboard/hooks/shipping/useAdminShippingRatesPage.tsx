"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";
import { adminShippingApi } from "@/features/admin-dashboard/api/shipping/shipping.api";
import { adminApi } from "../../api/analytics/admin.api";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";
import { useShippingRateForm } from "./useShippingRateForm.hook";

export type ShippingZoneOption = { id: string; name: string };

export type AdminShippingRateRecord = Record<string, unknown> & {
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
};

export type AdminShippingRatesPageModel = AdminListPageModel & {
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  search: string;
  setSearch: (value: string) => void;
  zoneFilter: string;
  setZoneFilter: (value: string) => void;
  methodFilter: string;
  setMethodFilter: (value: string) => void;
  vendorFilter: string;
  setVendorFilter: (value: string) => void;
  zones: ShippingZoneOption[];
  vendors: Array<{ id: string; name: string }>;
  onClearFilters: () => void;
  form: {
    zoneId: string;
    method: "STANDARD" | "EXPRESS";
    minWeightGrams: string;
    maxWeightGrams: string;
    price: string;
    estimatedDays: string;
    freeShippingThreshold: string;
    vendorId: string;
    zones: ShippingZoneOption[];
    createError: string | null;
    onZoneIdChange: (value: string) => void;
    onMethodChange: (value: "STANDARD" | "EXPRESS") => void;
    onMinWeightGramsChange: (value: string) => void;
    onMaxWeightGramsChange: (value: string) => void;
    onPriceChange: (value: string) => void;
    onEstimatedDaysChange: (value: string) => void;
    onFreeShippingThresholdChange: (value: string) => void;
    onVendorIdChange: (value: string) => void;
    onSubmit: (e: FormEvent) => Promise<void>;
  };
};

export function useAdminShippingRatesPage(): AdminShippingRatesPageModel {
  const [zones, setZones] = useState<ShippingZoneOption[]>([]);
  const [vendors, setVendors] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [listVersion, setListVersion] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [vendorFilter, setVendorFilter] = useState("ALL");

  const handleRateCreated = useCallback(() => {
    setIsCreateOpen(false);
    setListVersion((version) => version + 1);
  }, []);

  const formState = useShippingRateForm(handleRateCreated);

  useEffect(() => {
    adminShippingApi
      .zones({ page: 1, limit: 100 })
      .then((result) =>
        setZones(
          result.items.map((row) => ({
            id: String(row.id),
            name: typeof row.name === "string" ? row.name : String(row.id),
          })),
        ),
      )
      .catch(() => setZones([]));

    adminApi
      .vendors({ page: 1, limit: 100 })
      .then((res) =>
        setVendors(
          res.items.map((v) => ({
            id: String(v.id),
            name: v.businessName,
          })),
        ),
      )
      .catch(() => setVendors([]));
  }, []);

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void page;
      void limit;
      void listVersion;
      const rows = await adminShippingApi.rates();
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
        mapped = mapped.filter(
          (r) => String(r.vendorId || "all") === vendorFilter,
        );
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
    },
    [
      zones,
      vendors,
      listVersion,
      zoneFilter,
      methodFilter,
      vendorFilter,
      search,
    ],
  );

  const onClearFilters = useCallback(() => {
    setSearch("");
    setZoneFilter("ALL");
    setMethodFilter("ALL");
    setVendorFilter("ALL");
  }, []);

  const actions = useCallback(
    (row: { id?: string | number }, reload: () => void) => {
      const deleteRate = () =>
        adminShippingApi.deleteRate(String(row.id)).then(reload);

      return (
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          confirmVariant="destructive"
          tone="danger"
          title={shippingRatesLabels.deleteShippingRate}
          description={shippingRatesLabels.deleteShippingRateConfirm}
          onConfirm={deleteRate}
        />
      );
    },
    [],
  );

  return {
    isCreateOpen,
    setIsCreateOpen,
    search,
    setSearch,
    zoneFilter,
    setZoneFilter,
    methodFilter,
    setMethodFilter,
    vendorFilter,
    setVendorFilter,
    zones,
    vendors,
    onClearFilters,
    form: {
      ...formState,
      zones,
    },
    title: shippingRatesLabels.shippingRates,
    permission: PERMISSIONS.SHIPPING_MANAGE,
    load,
    actions,
    columnKeys: [
      "zoneName",
      "method",
      "minWeightGrams",
      "maxWeightGrams",
      "price",
      "estimatedDays",
      "freeShippingThreshold",
      "vendorName",
    ],
  };
}
