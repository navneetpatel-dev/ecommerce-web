"use client";

import { useEffect, useState } from "react";
import { vendorApi } from "../../api/vendor.api";
import { LABELS } from "@/shared/constants/labels";
import { STORAGE_KEYS } from "@/shared/constants/storage";
import type { VendorEntityType } from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

export interface ShopSettingsSaveOverride {
  returnShippingFee?: number | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  entityType?: VendorEntityType | null;
  categoryIds?: string[];
  codEnabled?: boolean;
}

interface UseVendorShopSettingsSaveOptions {
  entityType: VendorEntityType | null;
  categoryIds: string[];
  returnShippingFee: number | null;
  codEnabled: boolean;
  logoUrl: string | null;
  bannerUrl: string | null;
  applyShop: (shop: Awaited<ReturnType<typeof vendorApi.getMyShop>>) => void;
  setReturnShippingFee: (value: number | null) => void;
}

export function useVendorShopSettingsSave(
  options: UseVendorShopSettingsSaveOptions,
) {
  const [checklistKey, setChecklistKey] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const flag = sessionStorage.getItem(
        STORAGE_KEYS.KYC_NAME_MISMATCH_WARNING,
      );
      if (flag) {
        sessionStorage.removeItem(STORAGE_KEYS.KYC_NAME_MISMATCH_WARNING);
        setMessage(LABELS.kycNameMismatchWarningAcknowledged);
      }
    }
  }, []);

  const save = (override?: ShopSettingsSaveOverride) => {
    setSaving(true);
    setMessage(null);
    const nextEntityType =
      override && "entityType" in override
        ? override.entityType
        : options.entityType;
    const nextCategoryIds =
      override && "categoryIds" in override
        ? override.categoryIds
        : options.categoryIds;

    vendorApi
      .updateMyShop({
        returnShippingFee:
          override && "returnShippingFee" in override
            ? override.returnShippingFee
            : options.returnShippingFee,
        codEnabled:
          override && "codEnabled" in override
            ? override.codEnabled
            : options.codEnabled,
        logoUrl:
          override && "logoUrl" in override
            ? override.logoUrl
            : options.logoUrl,
        bannerUrl:
          override && "bannerUrl" in override
            ? override.bannerUrl
            : options.bannerUrl,
        ...(nextEntityType ? { entityType: nextEntityType } : {}),
        ...(nextCategoryIds && nextCategoryIds.length > 0
          ? { categoryIds: nextCategoryIds }
          : {}),
      })
      .then((shop) => {
        options.applyShop(shop);
        setChecklistKey((key) => key + 1);
        setMessage(
          override && ("categoryIds" in override || "entityType" in override)
            ? LABELS.categoriesSaved
            : LABELS.vendorShopSettingsSaved,
        );
      })
      .catch((err) =>
        setMessage(
          getApiErrorMessage(
            err,
            override && ("categoryIds" in override || "entityType" in override)
              ? LABELS.couldNotSaveCategories
              : LABELS.couldNotSaveVendorShopSettings,
          ),
        ),
      )
      .finally(() => setSaving(false));
  };

  const clearOverride = () => {
    setMessage(null);
    options.setReturnShippingFee(null);
    save({ returnShippingFee: null });
  };

  return {
    checklistKey,
    message,
    saving,
    save,
    clearOverride,
    setMessage,
  };
}
