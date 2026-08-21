"use client";

import { FormActions, FormStack } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { PlatformSettings } from "../../hooks/usePlatformSettingsForm";
import { PlatformSettingsHeader } from "./PlatformSettingsHeader";
import { CommerceSettingsSection } from "./CommerceSettingsSection";
import { FulfillmentSettingsSection } from "./FulfillmentSettingsSection";
import { SupportSettingsSection } from "./SupportSettingsSection";
import { CodSettingsSection } from "./CodSettingsSection";

interface PlatformSettingsFormProps {
  form: PlatformSettings;
  message?: string | null;
  onCommissionRateChange: (value: number) => void;
  onTcsRateChange: (value: number) => void;
  onTdsRateChange: (value: number) => void;
  onAutoApproveChange: (value: boolean) => void;
  onReturnWindowChange: (value: number) => void;
  onPayoutCycleChange: (value: string) => void;
  onFreeShippingThresholdChange: (value: number) => void;
  onReturnShippingFeeChange: (value: number) => void;
  onSupportEmailChange: (value: string) => void;
  onSupportHoursChange: (value: string) => void;
  onTicketReopenWindowDaysChange: (value: number) => void;
  onBugVerifyWindowDaysChange: (value: number) => void;
  onBugCloseWindowDaysChange: (value: number) => void;
  onCodEnabledChange: (value: boolean) => void;
  onCodMinOrderValueChange: (value: number) => void;
  onCodMaxOrderValueChange: (value: number | null) => void;
  onSave: () => void;
}

export function PlatformSettingsForm(props: PlatformSettingsFormProps) {
  const { form, message, onSave } = props;

  return (
    <div className="w-full min-w-0">
      <FormStack className="space-y-8">
        <PlatformSettingsHeader onSave={onSave} />

        <CommerceSettingsSection
          form={form}
          onCommissionRateChange={props.onCommissionRateChange}
          onTcsRateChange={props.onTcsRateChange}
          onTdsRateChange={props.onTdsRateChange}
          onAutoApproveChange={props.onAutoApproveChange}
        />

        <FulfillmentSettingsSection
          form={form}
          onReturnWindowChange={props.onReturnWindowChange}
          onPayoutCycleChange={props.onPayoutCycleChange}
          onFreeShippingThresholdChange={props.onFreeShippingThresholdChange}
          onReturnShippingFeeChange={props.onReturnShippingFeeChange}
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

        <FormActions leading={message}>
          <Button type="button" fullWidth="mobile" onClick={onSave}>
            {LABELS.saveSettings}
          </Button>
        </FormActions>
      </FormStack>
    </div>
  );
}
