"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";
import { adminShippingApi } from "@/features/admin-dashboard/api/shipping.api";
import type { AdminListPageModel } from "../types/adminListPage.types";
import { useShippingRateForm } from "./useShippingRateForm.hook";

export type ShippingZoneOption = { id: string; name: string };

export type AdminShippingRatesPageModel = AdminListPageModel & {
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
  const [listVersion, setListVersion] = useState(0);
  const formState = useShippingRateForm(
    useCallback(() => setListVersion((version) => version + 1), []),
  );

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
  }, []);

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void page;
      void limit;
      void listVersion;
      const rows = await adminShippingApi.rates();
      const zoneNameById = new Map(zones.map((zone) => [zone.id, zone.name]));
      return rows.map((row) => ({
        ...row,
        zoneName: zoneNameById.get(String(row.zoneId)) ?? row.zoneId,
      }));
    },
    [zones, listVersion],
  );

  return {
    form: {
      ...formState,
      zones,
    },
    title: shippingRatesLabels.shippingRates,
    permission: PERMISSIONS.SHIPPING_MANAGE,
    load,
    columnKeys: [
      "zoneName",
      "method",
      "minWeightGrams",
      "maxWeightGrams",
      "price",
      "estimatedDays",
      "freeShippingThreshold",
      "vendorId",
    ],
  };
}
