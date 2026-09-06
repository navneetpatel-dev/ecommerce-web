"use client";

import type { VendorEntityType } from "@/shared/constants/statuses";
import type { VendorPayoutFrequency } from "../../api/vendor.api";
import { useVendorShopSettingsData } from "./useVendorShopSettingsData.hook";
import { useVendorShopSettingsSave } from "./useVendorShopSettingsSave.hook";

export function useVendorShopSettingsForm() {
  const data = useVendorShopSettingsData();
  const saveApi = useVendorShopSettingsSave({
    entityType: data.entityType,
    categoryIds: data.categoryIds,
    returnShippingFee: data.returnShippingFee,
    codEnabled: data.codEnabled,
    payoutFrequency: data.payoutFrequency,
    logoUrl: data.logoUrl,
    bannerUrl: data.bannerUrl,
    applyShop: data.applyShop,
    setReturnShippingFee: data.setReturnShippingFee,
  });

  return {
    vendorId: data.vendorId,
    businessName: data.businessName,
    returnShippingFee: data.returnShippingFee,
    codEnabled: data.codEnabled,
    payoutFrequency: data.payoutFrequency,
    logoUrl: data.logoUrl,
    bannerUrl: data.bannerUrl,
    entityType: data.entityType,
    categoryIds: data.categoryIds,
    checklistKey: saveApi.checklistKey,
    loading: data.loading,
    loadError: data.loadError,
    message: saveApi.message,
    saving: saveApi.saving,
    save: () => saveApi.save(),
    clearOverride: saveApi.clearOverride,
    setReturnShippingFee: (value: number | null) => {
      saveApi.setMessage(null);
      data.setReturnShippingFee(value);
    },
    setCodEnabled: (value: boolean) => {
      saveApi.setMessage(null);
      data.setCodEnabled(value);
    },
    setPayoutFrequency: (value: VendorPayoutFrequency | null) => {
      saveApi.setMessage(null);
      data.setPayoutFrequency(value);
    },
    setLogoUrl: (url: string) => {
      saveApi.setMessage(null);
      data.setLogoUrl(url);
      saveApi.save({ logoUrl: url });
    },
    setBannerUrl: (url: string) => {
      saveApi.setMessage(null);
      data.setBannerUrl(url);
      saveApi.save({ bannerUrl: url });
    },
    setEntityType: (value: VendorEntityType) => {
      saveApi.setMessage(null);
      data.setEntityType(value);
    },
    setCategoryIds: (ids: string[]) => {
      saveApi.setMessage(null);
      data.setCategoryIds(ids);
    },
    saveCategories: () =>
      saveApi.save({
        entityType: data.entityType,
        categoryIds: data.categoryIds,
      }),
  };
}
