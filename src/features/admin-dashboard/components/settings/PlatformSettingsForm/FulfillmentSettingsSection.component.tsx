"use client";

import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { PlatformSettings } from "../../../hooks/settings/usePlatformSettingsForm.hook";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";

interface FulfillmentSettingsSectionProps {
  form: PlatformSettings;
  onReturnWindowChange: (value: number) => void;
  onPayoutCycleChange: (value: string) => void;
  onFreeShippingThresholdChange: (value: number) => void;
  onReturnShippingFeeChange: (value: number) => void;
  onRefundSlaBusinessDaysChange: (value: number) => void;
}

export function FulfillmentSettingsSection({
  form,
  onReturnWindowChange,
  onPayoutCycleChange,
  onFreeShippingThresholdChange,
  onReturnShippingFeeChange,
  onRefundSlaBusinessDaysChange,
}: FulfillmentSettingsSectionProps) {
  const handleReturnWindowChange = (value: number | undefined) =>
    onReturnWindowChange(value ?? 0);
  const handleFreeShippingThresholdChange = (value: number | undefined) =>
    onFreeShippingThresholdChange(value ?? 0);
  const handleReturnShippingFeeChange = (value: number | undefined) =>
    onReturnShippingFeeChange(value ?? 0);
  const handleRefundSlaBusinessDaysChange = (value: number | undefined) =>
    onRefundSlaBusinessDaysChange(value ?? 7);

  return (
    <FormSection
      title={LABELS.settingsFulfillment}
      hint={LABELS.settingsFulfillmentHint}
      columns={3}
    >
      <FormFieldFrame label={LABELS.defaultReturnWindow}>
        <NumberInput
          value={form.defaultReturnWindow}
          min={0}
          max={365}
          step={1}
          suffix={LABELS.daysShort}
          onChange={handleReturnWindowChange}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.freeShippingThreshold}>
        <NumberInput
          value={form.freeShippingThreshold}
          min={0}
          step={50}
          prefix={CURRENCY_SYMBOL}
          onChange={handleFreeShippingThresholdChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.returnShippingFee}
        hint={LABELS.returnShippingFeeHint}
      >
        <NumberInput
          value={form.returnShippingFee ?? 0}
          min={0}
          step={10}
          prefix={CURRENCY_SYMBOL}
          onChange={handleReturnShippingFeeChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.refundSlaBusinessDays}
        hint={LABELS.refundSlaBusinessDaysHint}
      >
        <NumberInput
          value={form.refundSlaBusinessDays ?? 7}
          min={1}
          max={30}
          step={1}
          suffix={LABELS.daysShort}
          onChange={handleRefundSlaBusinessDaysChange}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.payoutCycle}>
        <Select value={form.payoutCycle} onValueChange={onPayoutCycleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WEEKLY">{LABELS.payoutCycleWeekly}</SelectItem>
            <SelectItem value="BIWEEKLY">
              {LABELS.payoutCycleBiweekly}
            </SelectItem>
            <SelectItem value="MONTHLY">{LABELS.payoutCycleMonthly}</SelectItem>
            <SelectItem value="weekly">
              {LABELS.payoutCycleWeeklyLegacy}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
    </FormSection>
  );
}
