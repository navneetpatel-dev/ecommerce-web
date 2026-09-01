"use client";

import { useEffect, useState } from "react";
import { settingsApi, type AdminPlatformSettings } from "../api/settings.api";
import { LABELS } from "@/shared/constants/labels";

export type PlatformSettings = AdminPlatformSettings;

export function usePlatformSettingsForm() {
  const [form, setForm] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    settingsApi
      .get()
      .then((settings) =>
        setForm({
          ...settings,
          returnShippingFee: settings.returnShippingFee ?? 0,
          commissionGstRatePercent: settings.commissionGstRatePercent ?? 18,
          platformGstin: settings.platformGstin ?? "",
          platformLegalName: settings.platformLegalName ?? "",
          platformState: settings.platformState ?? "",
          codEnabled: settings.codEnabled !== false,
          codMinOrderValue: settings.codMinOrderValue ?? 0,
          codMaxOrderValue: settings.codMaxOrderValue ?? null,
          walletRechargeEnabled: settings.walletRechargeEnabled !== false,
          walletMinRechargeInr: settings.walletMinRechargeInr ?? 1,
          walletMaxRechargeInr: settings.walletMaxRechargeInr ?? 10000,
          walletMaxBalancePoints: settings.walletMaxBalancePoints ?? 50000,
          walletRechargePresetsInr: settings.walletRechargePresetsInr ?? [
            500, 1000, 2000, 5000,
          ],
          pointsPerRupee: settings.pointsPerRupee ?? 1,
        }),
      )
      .catch(() => setLoadError(LABELS.couldNotLoadSettings))
      .finally(() => setLoading(false));
  }, []);

  const save = () => {
    if (!form) return;
    settingsApi
      .update(form)
      .then((saved) => {
        setForm(saved);
        setMessage(LABELS.settingsSaved);
      })
      .catch(() => setMessage(LABELS.couldNotSaveSettings));
  };

  return {
    form,
    loading,
    loadError,
    message,
    save,
    setCommissionRate: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, defaultCommissionRate: value } : current,
      );
    },
    setTcsRatePercent: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, tcsRatePercent: value } : current,
      );
    },
    setTdsRatePercent: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, tdsRatePercent: value } : current,
      );
    },
    setCommissionGstRatePercent: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, commissionGstRatePercent: value } : current,
      );
    },
    setPlatformGstin: (value: string) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, platformGstin: value } : current,
      );
    },
    setPlatformLegalName: (value: string) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, platformLegalName: value } : current,
      );
    },
    setPlatformState: (value: string) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, platformState: value } : current,
      );
    },
    setAutoApproveProducts: (value: boolean) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, autoApproveProducts: value } : current,
      );
    },
    setReturnWindow: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, defaultReturnWindow: value } : current,
      );
    },
    setPayoutCycle: (value: string) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, payoutCycle: value } : current,
      );
    },
    setFreeShippingThreshold: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, freeShippingThreshold: value } : current,
      );
    },
    setReturnShippingFee: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, returnShippingFee: value } : current,
      );
    },
    setSupportEmail: (value: string) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, supportEmail: value } : current,
      );
    },
    setSupportHours: (value: string) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, supportHours: value } : current,
      );
    },
    setTicketReopenWindowDays: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, ticketReopenWindowDays: value } : current,
      );
    },
    setBugVerifyWindowDays: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, bugVerifyWindowDays: value } : current,
      );
    },
    setBugCloseWindowDays: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, bugCloseWindowDays: value } : current,
      );
    },
    setCodEnabled: (value: boolean) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, codEnabled: value } : current,
      );
    },
    setCodMinOrderValue: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, codMinOrderValue: value } : current,
      );
    },
    setCodMaxOrderValue: (value: number | null) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, codMaxOrderValue: value } : current,
      );
    },
    setWalletRechargeEnabled: (value: boolean) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, walletRechargeEnabled: value } : current,
      );
    },
    setWalletMinRechargeInr: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, walletMinRechargeInr: value } : current,
      );
    },
    setWalletMaxRechargeInr: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, walletMaxRechargeInr: value } : current,
      );
    },
    setWalletMaxBalancePoints: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, walletMaxBalancePoints: value } : current,
      );
    },
    setWalletRechargePresetsInr: (value: number[]) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, walletRechargePresetsInr: value } : current,
      );
    },
    setPointsPerRupee: (value: number) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, pointsPerRupee: value } : current,
      );
    },
  };
}
