"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "@/shared/hooks/usePublicSettings.hook";
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";
import {
  settingsApi,
  type AdminPlatformSettings,
} from "../../api/settings/settings.api";
import { LABELS } from "@/shared/constants/labels";
import { normalizeLoadedSettings } from "../../utils/settings/normalizeLoadedSettings";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

export type PlatformSettings = AdminPlatformSettings;

export function usePlatformSettingsForm() {
  const [form, setForm] = useState<PlatformSettings | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  useUnsavedChanges(isDirty);

  useEffect(() => {
    settingsApi
      .get()
      .then((settings) => setForm(normalizeLoadedSettings(settings)))
      .catch((err) =>
        setLoadError(getApiErrorMessage(err, LABELS.couldNotLoadSettings)),
      )
      .finally(() => setLoading(false));
  }, []);

  const save = () => {
    if (!form || saving) return;
    setSaveError(null);
    setMessage(null);
    setSaving(true);
    settingsApi
      .update(form)
      .then((saved) => {
        setForm(saved);
        setIsDirty(false);
        setMessage(LABELS.settingsSaved);
        // Storefront readers (checkout, product pages, maintenance) must not keep the old copy.
        void queryClient.invalidateQueries({ queryKey: settingsKeys.public });
      })
      .catch((err) =>
        setSaveError(getApiErrorMessage(err, LABELS.couldNotSaveSettings)),
      )
      .finally(() => setSaving(false));
  };

  /** Every field setter follows the same shape: clear the save message, patch one field. */
  const setField =
    <K extends keyof PlatformSettings>(field: K) =>
    (value: PlatformSettings[K]) => {
      setMessage(null);
      setIsDirty(true);
      setForm((current) =>
        current ? { ...current, [field]: value } : current,
      );
    };

  return {
    form,
    isDirty,
    saving,
    loading,
    loadError,
    saveError,
    message,
    save,
    setCommissionRate: setField("defaultCommissionRate"),
    setTcsRatePercent: setField("tcsRatePercent"),
    setTdsRatePercent: setField("tdsRatePercent"),
    setTds194oExemptionThreshold: setField("tds194oExemptionThreshold"),
    setCommissionGstRatePercent: setField("commissionGstRatePercent"),
    setPlatformGstin: setField("platformGstin"),
    setPlatformLegalName: setField("platformLegalName"),
    setPlatformState: setField("platformState"),
    setAutoApproveProducts: setField("autoApproveProducts"),
    setAutoApproveReviews: setField("autoApproveReviews"),
    setAutoApproveQuestions: setField("autoApproveQuestions"),
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
    setPromotionalPointsTtlDays: setField("promotionalPointsTtlDays"),
    setRefundSlaBusinessDays: setField("refundSlaBusinessDays"),
    setScheduledReportsEnabled: setField("scheduledReportsEnabled"),
    setScheduledReportsTypes: setField("scheduledReportsTypes"),
    setScheduledReportsRecipients: setField("scheduledReportsRecipients"),
    setScheduledReportsDayOfWeek: setField("scheduledReportsDayOfWeek"),
    setScheduledReportsHourUtc: setField("scheduledReportsHourUtc"),
    setMaintenanceEnabled: setField("maintenanceEnabled"),
    setMaintenanceMessage: setField("maintenanceMessage"),
    setMaintenanceUntil: setField("maintenanceUntil"),
    setWelcomeOfferEnabled: setField("welcomeOfferEnabled"),
    setWelcomeOfferPercent: setField("welcomeOfferPercent"),
    setWelcomeOfferMaxDiscount: setField("welcomeOfferMaxDiscount"),
    setWelcomeOfferMinOrder: setField("welcomeOfferMinOrder"),
    setWelcomeOfferValidDays: setField("welcomeOfferValidDays"),
  };
}
