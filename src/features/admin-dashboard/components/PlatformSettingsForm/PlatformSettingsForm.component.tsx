"use client";

import { FormActions, FormStack } from "@/shared/components/forms";
import { FormError } from "@/shared/components/FormError.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { PlatformSettings } from "../../hooks/usePlatformSettingsForm.hook";
import { PlatformSettingsHeader } from "./PlatformSettingsHeader.component";
import { CommerceSettingsSection } from "./CommerceSettingsSection.component";
import { FulfillmentSettingsSection } from "./FulfillmentSettingsSection.component";
import { SupportSettingsSection } from "./SupportSettingsSection.component";
import { CodSettingsSection } from "./CodSettingsSection.component";
import { WalletPointsSettingsSection } from "../WalletPointsSettingsSection.component";

interface PlatformSettingsFormProps {
  form: PlatformSettings;
  message?: string | null;
  saveError?: string | null;
  onCommissionRateChange: (value: number) => void;
  onTcsRateChange: (value: number) => void;
  onTdsRateChange: (value: number) => void;
  onCommissionGstRateChange: (value: number) => void;
  onPlatformGstinChange: (value: string) => void;
  onPlatformLegalNameChange: (value: string) => void;
  onPlatformStateChange: (value: string) => void;
  onAutoApproveChange: (value: boolean) => void;
  onReturnWindowChange: (value: number) => void;
  onPayoutCycleChange: (value: string) => void;
  onFreeShippingThresholdChange: (value: number) => void;
  onReturnShippingFeeChange: (value: number) => void;
  onDeliveryAgentPerTaskEarningChange: (value: number) => void;
  onSupportEmailChange: (value: string) => void;
  onSupportHoursChange: (value: string) => void;
  onTicketReopenWindowDaysChange: (value: number) => void;
  onBugVerifyWindowDaysChange: (value: number) => void;
  onBugCloseWindowDaysChange: (value: number) => void;
  onCodEnabledChange: (value: boolean) => void;
  onCodMinOrderValueChange: (value: number) => void;
  onCodMaxOrderValueChange: (value: number | null) => void;
  onWalletRechargeEnabledChange: (value: boolean) => void;
  onWalletMinRechargeChange: (value: number) => void;
  onWalletMaxRechargeChange: (value: number) => void;
  onWalletMaxBalanceChange: (value: number) => void;
  onWalletRechargePresetsChange: (value: number[]) => void;
  onPointsPerRupeeChange: (value: number) => void;
  onSave: () => void;
}

export function PlatformSettingsForm(props: PlatformSettingsFormProps) {
  const { form, message, saveError = null, onSave } = props;

  return (
    <div className="w-full min-w-0">
      <FormStack className="space-y-8">
        <PlatformSettingsHeader onSave={onSave} />

        <CommerceSettingsSection
          form={form}
          onCommissionRateChange={props.onCommissionRateChange}
          onTcsRateChange={props.onTcsRateChange}
          onTdsRateChange={props.onTdsRateChange}
          onCommissionGstRateChange={props.onCommissionGstRateChange}
          onPlatformGstinChange={props.onPlatformGstinChange}
          onPlatformLegalNameChange={props.onPlatformLegalNameChange}
          onPlatformStateChange={props.onPlatformStateChange}
          onAutoApproveChange={props.onAutoApproveChange}
        />

        <FulfillmentSettingsSection
          form={form}
          onReturnWindowChange={props.onReturnWindowChange}
          onPayoutCycleChange={props.onPayoutCycleChange}
          onFreeShippingThresholdChange={props.onFreeShippingThresholdChange}
          onReturnShippingFeeChange={props.onReturnShippingFeeChange}
          onDeliveryAgentPerTaskEarningChange={
            props.onDeliveryAgentPerTaskEarningChange
          }
        />

        <SupportSettingsSection
          form={form}
          onSupportEmailChange={props.onSupportEmailChange}
          onSupportHoursChange={props.onSupportHoursChange}
          onTicketReopenWindowDaysChange={props.onTicketReopenWindowDaysChange}
          onBugVerifyWindowDaysChange={props.onBugVerifyWindowDaysChange}
          onBugCloseWindowDaysChange={props.onBugCloseWindowDaysChange}
        />

        <CodSettingsSection
          form={form}
          onCodEnabledChange={props.onCodEnabledChange}
          onCodMinOrderValueChange={props.onCodMinOrderValueChange}
          onCodMaxOrderValueChange={props.onCodMaxOrderValueChange}
        />

        <WalletPointsSettingsSection
          form={form}
          onWalletRechargeEnabledChange={props.onWalletRechargeEnabledChange}
          onWalletMinRechargeChange={props.onWalletMinRechargeChange}
          onWalletMaxRechargeChange={props.onWalletMaxRechargeChange}
          onWalletMaxBalanceChange={props.onWalletMaxBalanceChange}
          onWalletRechargePresetsChange={props.onWalletRechargePresetsChange}
          onPointsPerRupeeChange={props.onPointsPerRupeeChange}
        />

        <FormError error={saveError} fallback={LABELS.couldNotSaveSettings} />
        <FormActions leading={message}>
          <Button type="button" fullWidth="mobile" onClick={onSave}>
            {LABELS.saveSettings}
          </Button>
        </FormActions>
      </FormStack>
    </div>
  );
}
