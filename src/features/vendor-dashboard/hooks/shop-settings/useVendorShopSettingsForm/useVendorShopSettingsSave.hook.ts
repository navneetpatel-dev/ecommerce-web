"use client";

import { useEffect, useState } from "react";
import { vendorApi } from "../../../api/overview/vendor.api";
import {
  bankDetailsProblem,
  buildShopSettingsPayload,
  type ShopSettingsSaveOverride,
  type ShopSettingsSnapshot,
} from "./shopSettingsPayload";
import { LABELS, ROLES } from "@/shared/constants/labels";
import { STORAGE_KEYS } from "@/shared/constants/storage/storage";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

export type { ShopSettingsSaveOverride } from "./shopSettingsPayload";

interface UseVendorShopSettingsSaveOptions extends ShopSettingsSnapshot {
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

  /**
   * `partial` sends only the override (a logo upload or a category change), so an
   * unrelated half-edited field — a new bank account being typed — is never saved by it.
   */
  const save = (override?: ShopSettingsSaveOverride, partial = false) => {
    const bankProblem = partial ? null : bankDetailsProblem(options);
    if (bankProblem) {
      setMessage(bankProblem);
      return;
    }
    setSaving(true);
    setMessage(null);
    const isOwner =
      useAuthStore.getState().currentUser?.role === ROLES.VENDOR_OWNER;
    const payload = buildShopSettingsPayload(
      options,
      override,
      partial,
      isOwner,
    );

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
    save({ returnShippingFee: null }, true);
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
