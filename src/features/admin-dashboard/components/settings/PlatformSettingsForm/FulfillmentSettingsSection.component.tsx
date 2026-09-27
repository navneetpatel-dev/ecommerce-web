"use client";

import { NumberInput } from "@/shared/components/NumberInput.component";
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
          onChange={(value) => onReturnWindowChange(value ?? 0)}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.freeShippingThreshold}>
        <NumberInput
          value={form.freeShippingThreshold}
          min={0}
          step={50}
          prefix="₹"
          onChange={(value) => onFreeShippingThresholdChange(value ?? 0)}
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
          prefix="₹"
          onChange={(value) => onReturnShippingFeeChange(value ?? 0)}
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
          prefix="₹"
          onChange={(value) => onDeliveryAgentPerTaskEarningChange(value ?? 0)}
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
          onChange={(value) => onDeliveryAgentTdsRateChange(value ?? 0)}
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
          onChange={(value) => onDeliveryAgentTdsNoPanRateChange(value ?? 0)}
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
          prefix="₹"
          onChange={(value) =>
            onDeliveryAgentTdsSingleThresholdChange(value ?? 0)
          }
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.deliveryAgentTdsAnnualThreshold}>
        <NumberInput
          value={form.deliveryAgentTdsAnnualThreshold ?? 100000}
          min={0}
          step={5000}
          prefix="₹"
          onChange={(value) =>
            onDeliveryAgentTdsAnnualThresholdChange(value ?? 0)
          }
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
          onChange={(value) => onRefundSlaBusinessDaysChange(value ?? 7)}
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
