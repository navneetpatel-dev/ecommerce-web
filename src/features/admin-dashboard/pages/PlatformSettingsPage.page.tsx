"use client";

import { PlatformSettingsForm } from "../components/PlatformSettingsForm.component";
import { usePlatformSettingsForm } from "../hooks/usePlatformSettingsForm.hook";
import { LABELS } from "@/shared/constants/labels";
import { adminPagesStyles } from "./adminPages.styles";

export function PlatformSettingsPage() {
  const settings = usePlatformSettingsForm();

  if (settings.loading) {
    return (
      <p className={adminPagesStyles.emptyText}>
        {LABELS.loadingPlatformSettings}
      </p>
    );
  }

  if (settings.loadError || !settings.form) {
    return (
      <p className={adminPagesStyles.errorText}>
        {settings.loadError ?? LABELS.settingsUnavailable}
      </p>
    );
  }

  return (
    <PlatformSettingsForm
      form={settings.form}
      message={settings.message}
      saveError={settings.saveError}
      onCommissionRateChange={settings.setCommissionRate}
      onTcsRateChange={settings.setTcsRatePercent}
      onTdsRateChange={settings.setTdsRatePercent}
      onCommissionGstRateChange={settings.setCommissionGstRatePercent}
      onPlatformGstinChange={settings.setPlatformGstin}
      onPlatformLegalNameChange={settings.setPlatformLegalName}
      onPlatformStateChange={settings.setPlatformState}
      onAutoApproveChange={settings.setAutoApproveProducts}
      onReturnWindowChange={settings.setReturnWindow}
      onPayoutCycleChange={settings.setPayoutCycle}
      onFreeShippingThresholdChange={settings.setFreeShippingThreshold}
      onReturnShippingFeeChange={settings.setReturnShippingFee}
      onDeliveryAgentPerTaskEarningChange={
        settings.setDeliveryAgentPerTaskEarning
      }
      onRefundSlaBusinessDaysChange={settings.setRefundSlaBusinessDays}
      onSupportEmailChange={settings.setSupportEmail}
      onSupportHoursChange={settings.setSupportHours}
      onTicketReopenWindowDaysChange={settings.setTicketReopenWindowDays}
      onBugVerifyWindowDaysChange={settings.setBugVerifyWindowDays}
      onBugCloseWindowDaysChange={settings.setBugCloseWindowDays}
      onCodEnabledChange={settings.setCodEnabled}
      onCodMinOrderValueChange={settings.setCodMinOrderValue}
      onCodMaxOrderValueChange={settings.setCodMaxOrderValue}
      onWalletRechargeEnabledChange={settings.setWalletRechargeEnabled}
      onWalletMinRechargeChange={settings.setWalletMinRechargeInr}
      onWalletMaxRechargeChange={settings.setWalletMaxRechargeInr}
      onWalletMaxBalanceChange={settings.setWalletMaxBalancePoints}
      onWalletRechargePresetsChange={settings.setWalletRechargePresetsInr}
      onPointsPerRupeeChange={settings.setPointsPerRupee}
      onPromotionalPointsTtlDaysChange={settings.setPromotionalPointsTtlDays}
      onScheduledReportsEnabledChange={settings.setScheduledReportsEnabled}
      onScheduledReportsTypesChange={settings.setScheduledReportsTypes}
      onScheduledReportsRecipientsChange={
        settings.setScheduledReportsRecipients
      }
      onScheduledReportsDayOfWeekChange={settings.setScheduledReportsDayOfWeek}
      onScheduledReportsHourUtcChange={settings.setScheduledReportsHourUtc}
      onSave={settings.save}
    />
  );
}
