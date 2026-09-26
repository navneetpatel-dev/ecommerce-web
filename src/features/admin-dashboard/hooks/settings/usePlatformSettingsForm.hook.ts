"use client";

import { useEffect, useState } from "react";
import {
  settingsApi,
  type AdminPlatformSettings,
} from "../../api/settings/settings.api";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

export type PlatformSettings = AdminPlatformSettings;

export function usePlatformSettingsForm() {
  const [form, setForm] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

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
          deliveryAgentPerTaskEarning:
            settings.deliveryAgentPerTaskEarning ?? 20,
          promotionalPointsTtlDays: settings.promotionalPointsTtlDays ?? 0,
          refundSlaBusinessDays: settings.refundSlaBusinessDays ?? 7,
          scheduledReportsEnabled: settings.scheduledReportsEnabled ?? false,
          scheduledReportsTypes: settings.scheduledReportsTypes ?? [],
          scheduledReportsRecipients: settings.scheduledReportsRecipients ?? [],
          scheduledReportsDayOfWeek: settings.scheduledReportsDayOfWeek ?? 1,
          scheduledReportsHourUtc: settings.scheduledReportsHourUtc ?? 6,
        }),
      )
      .catch((err) =>
        setLoadError(getApiErrorMessage(err, LABELS.couldNotLoadSettings)),
      )
      .finally(() => setLoading(false));
  }, []);

  const save = () => {
    if (!form) return;
    setSaveError(null);
    setMessage(null);
    settingsApi
      .update(form)
      .then((saved) => {
        setForm(saved);
        setMessage(LABELS.settingsSaved);
      })
      .catch((err) =>
        setSaveError(getApiErrorMessage(err, LABELS.couldNotSaveSettings)),
      );
  };

  /** Every field setter follows the same shape: clear the save message, patch one field. */
  const setField =
    <K extends keyof PlatformSettings>(field: K) =>
    (value: PlatformSettings[K]) => {
      setMessage(null);
      setForm((current) =>
        current ? { ...current, [field]: value } : current,
      );
    };

  return {
    form,
    loading,
    loadError,
    saveError,
    message,
    save,
    setCommissionRate: setField("defaultCommissionRate"),
    setTcsRatePercent: setField("tcsRatePercent"),
    setTdsRatePercent: setField("tdsRatePercent"),
    setCommissionGstRatePercent: setField("commissionGstRatePercent"),
    setPlatformGstin: setField("platformGstin"),
    setPlatformLegalName: setField("platformLegalName"),
    setPlatformState: setField("platformState"),
    setAutoApproveProducts: setField("autoApproveProducts"),
    setReturnWindow: setField("defaultReturnWindow"),
    setPayoutCycle: setField("payoutCycle"),
    setFreeShippingThreshold: setField("freeShippingThreshold"),
    setReturnShippingFee: setField("returnShippingFee"),
    setSupportEmail: setField("supportEmail"),
    setSupportHours: setField("supportHours"),
    setTicketReopenWindowDays: setField("ticketReopenWindowDays"),
    setBugVerifyWindowDays: setField("bugVerifyWindowDays"),
    setBugCloseWindowDays: setField("bugCloseWindowDays"),
    setCodEnabled: setField("codEnabled"),
    setCodMinOrderValue: setField("codMinOrderValue"),
    setCodMaxOrderValue: setField("codMaxOrderValue"),
    setWalletRechargeEnabled: setField("walletRechargeEnabled"),
    setWalletMinRechargeInr: setField("walletMinRechargeInr"),
    setWalletMaxRechargeInr: setField("walletMaxRechargeInr"),
    setWalletMaxBalancePoints: setField("walletMaxBalancePoints"),
    setWalletRechargePresetsInr: setField("walletRechargePresetsInr"),
    setDeliveryAgentPerTaskEarning: setField("deliveryAgentPerTaskEarning"),
    setPromotionalPointsTtlDays: setField("promotionalPointsTtlDays"),
    setRefundSlaBusinessDays: setField("refundSlaBusinessDays"),
    setScheduledReportsEnabled: setField("scheduledReportsEnabled"),
    setScheduledReportsTypes: setField("scheduledReportsTypes"),
    setScheduledReportsRecipients: setField("scheduledReportsRecipients"),
    setScheduledReportsDayOfWeek: setField("scheduledReportsDayOfWeek"),
    setScheduledReportsHourUtc: setField("scheduledReportsHourUtc"),
  };
}
