"use client";

import { useCallback, useEffect, useState } from "react";
import { vendorApi, type VendorPayoutFrequency } from "../../api/vendor.api";
import { LABELS } from "@/shared/constants/labels";
import type { VendorEntityType } from "@/shared/constants/statuses";

type ShopResponse = Awaited<ReturnType<typeof vendorApi.getMyShop>>;

export function useVendorShopSettingsData() {
  const [vendorId, setVendorId] = useState("");
  const [returnShippingFee, setReturnShippingFee] = useState<number | null>(
    null,
  );
  const [codEnabled, setCodEnabled] = useState(true);
  const [payoutFrequency, setPayoutFrequency] =
    useState<VendorPayoutFrequency | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [entityType, setEntityType] = useState<VendorEntityType | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const applyShop = useCallback((shop: ShopResponse) => {
    setReturnShippingFee(
      shop.returnShippingFee == null ? null : Number(shop.returnShippingFee),
    );
    setCodEnabled(shop.codEnabled !== false);
    setPayoutFrequency(shop.payoutFrequency ?? null);
    setLogoUrl(shop.logoUrl ?? null);
    setBannerUrl(shop.bannerUrl ?? null);
    setEntityType((shop.entityType as VendorEntityType | null) ?? null);
    setCategoryIds(shop.categoryIds ?? []);
  }, []);

  useEffect(() => {
    vendorApi
      .getMyShop()
      .then((shop) => {
        setVendorId(shop.id);
        setBusinessName(shop.businessName);
        applyShop(shop);
      })
      .catch(() => setLoadError(LABELS.couldNotLoadVendorShopSettings))
      .finally(() => setLoading(false));
  }, [applyShop]);

  return {
    vendorId,
    businessName,
    returnShippingFee,
    codEnabled,
    payoutFrequency,
    logoUrl,
    bannerUrl,
    entityType,
    categoryIds,
    loading,
    loadError,
    applyShop,
    setReturnShippingFee,
    setCodEnabled,
    setPayoutFrequency,
    setLogoUrl,
    setBannerUrl,
    setEntityType,
    setCategoryIds,
  };
}
