"use client";

import { useEffect, useState } from "react";
import {
  vendorApi,
  type VendorPayoutFrequency,
  type VendorBankDetails,
} from "../../../api/overview/vendor.api";
import { LABELS, ROLES } from "@/shared/constants/labels";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { VendorEntityType } from "@/shared/constants/statuses";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

export interface ShopSettingsSaveOverride {
  returnShippingFee?: number | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  entityType?: VendorEntityType | null;
  categoryIds?: string[];
  codEnabled?: boolean;
  payoutFrequency?: VendorPayoutFrequency | null;
  bankDetails?: VendorBankDetails | null;
}

interface UseVendorShopSettingsSaveOptions {
  entityType: VendorEntityType | null;
  categoryIds: string[];
  returnShippingFee: number | null;
  codEnabled: boolean;
  payoutFrequency: VendorPayoutFrequency | null;
  bankDetails?: VendorBankDetails | null;
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

  /* eslint-disable react-hooks/set-state-in-effect -- one-shot consumption of
     a sessionStorage flag written by the KYC flow before navigating here; an
     external-store read, not render state. */
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
  /* eslint-enable react-hooks/set-state-in-effect */

  const save = (override?: ShopSettingsSaveOverride) => {
    setSaving(true);
    setMessage(null);
    const isOwner =
      useAuthStore.getState().currentUser?.role === ROLES.VENDOR_OWNER;

    const nextEntityType =
      override && "entityType" in override
        ? override.entityType
        : options.entityType;
    const nextCategoryIds =
      override && "categoryIds" in override
        ? override.categoryIds
        : options.categoryIds;

    const payload: Record<string, unknown> = {
      logoUrl:
        override && "logoUrl" in override ? override.logoUrl : options.logoUrl,
      bannerUrl:
        override && "bannerUrl" in override
          ? override.bannerUrl
          : options.bannerUrl,
      ...(nextCategoryIds && nextCategoryIds.length > 0
        ? { categoryIds: nextCategoryIds }
        : {}),
    };

    if (isOwner) {
      payload.returnShippingFee =
        override && "returnShippingFee" in override
          ? override.returnShippingFee
          : options.returnShippingFee;
      payload.codEnabled =
        override && "codEnabled" in override
          ? override.codEnabled
          : options.codEnabled;
      payload.payoutFrequency =
        override && "payoutFrequency" in override
          ? override.payoutFrequency
          : options.payoutFrequency;
      if (nextEntityType) payload.entityType = nextEntityType;
      const nextBank =
        override && "bankDetails" in override
          ? override.bankDetails
          : options.bankDetails;
      if (nextBank !== undefined) payload.bankDetails = nextBank;
    }

    const isCat = Boolean(
      override && ("categoryIds" in override || "entityType" in override),
    );

    vendorApi
      .updateMyShop(payload)
      .then((shop) => {
        options.applyShop(shop);
        setChecklistKey((key) => key + 1);
        setMessage(
          isCat ? LABELS.categoriesSaved : LABELS.vendorShopSettingsSaved,
        );
      })
      .catch((err) =>
        setMessage(
          getApiErrorMessage(
            err,
            isCat
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
