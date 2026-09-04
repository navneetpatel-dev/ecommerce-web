"use client";

import { PlatformSettingsForm } from "../components/PlatformSettingsForm.component";
import { usePlatformSettingsForm } from "../hooks/usePlatformSettingsForm.hook";
import { LABELS } from "@/shared/constants/labels";

export function PlatformSettingsPage() {
  const settings = usePlatformSettingsForm();

  if (settings.loading) {
    return <p className="text-ink-muted">{LABELS.loadingPlatformSettings}</p>;
  }

  if (settings.loadError || !settings.form) {
    return (
      <p className="text-danger">
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
      onSave={settings.save}
    />
  );
}
