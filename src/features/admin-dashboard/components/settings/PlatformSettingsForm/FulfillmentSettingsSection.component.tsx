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
  onDeliveryAgentPerTaskEarningChange: (value: number) => void;
  onRefundSlaBusinessDaysChange: (value: number) => void;
  onDeliveryAgentTdsRateChange: (value: number) => void;
  onDeliveryAgentTdsNoPanRateChange: (value: number) => void;
  onDeliveryAgentTdsSingleThresholdChange: (value: number) => void;
  onDeliveryAgentTdsAnnualThresholdChange: (value: number) => void;
}

export function FulfillmentSettingsSection({
  form,
  onReturnWindowChange,
  onPayoutCycleChange,
  onFreeShippingThresholdChange,
  onReturnShippingFeeChange,
  onDeliveryAgentPerTaskEarningChange,
  onRefundSlaBusinessDaysChange,
  onDeliveryAgentTdsRateChange,
  onDeliveryAgentTdsNoPanRateChange,
  onDeliveryAgentTdsSingleThresholdChange,
  onDeliveryAgentTdsAnnualThresholdChange,
}: FulfillmentSettingsSectionProps) {
  const handleReturnWindowChange = (value: number | undefined) =>
    onReturnWindowChange(value ?? 0);
  const handleFreeShippingThresholdChange = (value: number | undefined) =>
    onFreeShippingThresholdChange(value ?? 0);
  const handleReturnShippingFeeChange = (value: number | undefined) =>
    onReturnShippingFeeChange(value ?? 0);
  const handleDeliveryAgentPerTaskEarningChange = (value: number | undefined) =>
    onDeliveryAgentPerTaskEarningChange(value ?? 0);
  const handleDeliveryAgentTdsRateChange = (value: number | undefined) =>
    onDeliveryAgentTdsRateChange(value ?? 0);
  const handleDeliveryAgentTdsNoPanRateChange = (value: number | undefined) =>
    onDeliveryAgentTdsNoPanRateChange(value ?? 0);
  const handleDeliveryAgentTdsSingleThresholdChange = (
    value: number | undefined,
  ) => onDeliveryAgentTdsSingleThresholdChange(value ?? 0);
  const handleDeliveryAgentTdsAnnualThresholdChange = (
    value: number | undefined,
  ) => onDeliveryAgentTdsAnnualThresholdChange(value ?? 0);
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
        label={LABELS.deliveryAgentPerTaskEarning}
        hint={LABELS.deliveryAgentPerTaskEarningHint}
      >
        <NumberInput
          value={form.deliveryAgentPerTaskEarning}
          min={0}
          step={5}
          prefix={CURRENCY_SYMBOL}
          onChange={handleDeliveryAgentPerTaskEarningChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.deliveryAgentTdsRate}
        hint={LABELS.deliveryAgentTdsRateHint}
      >
        <NumberInput
          value={form.deliveryAgentTdsRatePercent ?? 1}
          min={0}
          max={100}
          step={0.5}
          suffix="%"
          onChange={handleDeliveryAgentTdsRateChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.deliveryAgentTdsNoPanRate}
        hint={LABELS.deliveryAgentTdsNoPanRateHint}
      >
        <NumberInput
          value={form.deliveryAgentTdsNoPanRatePercent ?? 20}
          min={0}
          max={100}
          step={1}
          suffix="%"
          onChange={handleDeliveryAgentTdsNoPanRateChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.deliveryAgentTdsSingleThreshold}
        hint={LABELS.deliveryAgentTdsThresholdHint}
      >
        <NumberInput
          value={form.deliveryAgentTdsSingleThreshold ?? 30000}
          min={0}
          step={1000}
          prefix={CURRENCY_SYMBOL}
          onChange={handleDeliveryAgentTdsSingleThresholdChange}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.deliveryAgentTdsAnnualThreshold}>
        <NumberInput
          value={form.deliveryAgentTdsAnnualThreshold ?? 100000}
          min={0}
          step={5000}
          prefix={CURRENCY_SYMBOL}
          onChange={handleDeliveryAgentTdsAnnualThresholdChange}
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
