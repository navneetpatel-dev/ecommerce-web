"use client";

import { useCallback, useEffect, useState } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";
import { adminShippingApi } from "@/features/admin-dashboard/api/shipping/shipping.api";
import { vendorsApi } from "@/features/vendors";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { useShippingRateForm } from "./useShippingRateForm.hook";
import {
  filterShippingRatesRows,
  type AdminShippingRateRecord,
  type ShippingZoneOption,
} from "../../utils/shipping/ratesFilters.utils";
import type { AdminShippingRatesPageModel } from "../../types/shipping/adminShippingRates.types";

export type {
  AdminShippingRateRecord,
  ShippingZoneOption,
  AdminShippingRatesPageModel,
};

const COLUMN_KEYS = [
  "zoneName",
  "method",
  "minWeightGrams",
  "maxWeightGrams",
  "price",
  "estimatedDays",
  "freeShippingThreshold",
  "vendorName",
];

export function useAdminShippingRatesPage(): AdminShippingRatesPageModel {
  const [zones, setZones] = useState<ShippingZoneOption[]>([]);
  const [vendors, setVendors] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [listVersion, setListVersion] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
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
      .then((res) =>
        setZones(
          res.items.map((r) => ({
            id: String(r.id),
            name: typeof r.name === "string" ? r.name : String(r.id),
          })),
        ),
      )
      .catch(() => setZones([]));

    vendorsApi
      .directory({ limit: 100 })
      .then((res) =>
        setVendors(
          res.items.map((v) => ({ id: String(v.id), name: v.businessName })),
        ),
      )
      .catch(() => setVendors([]));
  }, []);

  const load = useCallback(async () => {
    void listVersion;
    const rows = await adminShippingApi.rates();
    return filterShippingRatesRows({
      rows,
      zones,
      vendors,
      zoneFilter,
      methodFilter,
      vendorFilter,
      search: debouncedSearch,
    });
  }, [
    zones,
    vendors,
    listVersion,
    zoneFilter,
    methodFilter,
    vendorFilter,
    debouncedSearch,
  ]);

  const onClearFilters = useCallback(() => {
    setSearch("");
    setZoneFilter("ALL");
    setMethodFilter("ALL");
    setVendorFilter("ALL");
  }, []);

  const actions = useCallback(
    (row: { id?: string | number }, reload: () => void) => (
      <AdminConfirmAction
        label={LABELS.delete}
        dialogVariant="danger"
        tone="danger"
        title={shippingRatesLabels.deleteShippingRate}
        description={shippingRatesLabels.deleteShippingRateConfirm}
        onConfirm={() =>
          adminShippingApi.deleteRate(String(row.id)).then(reload)
        }
      />
    ),
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
    form: { ...formState, zones },
    title: shippingRatesLabels.shippingRates,
    permission: PERMISSIONS.SHIPPING_MANAGE,
    load,
    actions,
    columnKeys: COLUMN_KEYS,
  };
}
