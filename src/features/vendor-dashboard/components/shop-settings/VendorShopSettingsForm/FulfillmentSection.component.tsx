"use client";

import { NumberInput } from "@/shared/components/NumberInput.component";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { VendorPayoutFrequency } from "../../../api/overview/vendor.api";

const NO_PREFERENCE_VALUE = "__none__";

interface FulfillmentSectionProps {
  returnShippingFee: number | null;
  codEnabled: boolean;
  payoutFrequency: VendorPayoutFrequency | null;
  onReturnShippingFeeChange: (value: number | null) => void;
  onCodEnabledChange: (value: boolean) => void;
  onPayoutFrequencyChange: (value: VendorPayoutFrequency | null) => void;
}

/** Return-fee / COD / payout-cadence fields on the vendor shop settings form. */
export function FulfillmentSection({
  returnShippingFee,
  codEnabled,
  payoutFrequency,
  onReturnShippingFeeChange,
  onCodEnabledChange,
  onPayoutFrequencyChange,
}: FulfillmentSectionProps) {
  return (
    <FormSection
      title={LABELS.settingsFulfillment}
      hint={LABELS.settingsFulfillmentHint}
      columns={3}
    >
      <FormFieldFrame
        label={LABELS.returnShippingFee}
        hint={LABELS.returnShippingFeeHint}
      >
        <NumberInput
          value={returnShippingFee ?? undefined}
          min={0}
          step={10}
          prefix="₹"
          onChange={(value) =>
            onReturnShippingFeeChange(value == null ? null : value)
          }
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.vendorCodEnabled}
        hint={LABELS.vendorCodEnabledHint}
      >
        <CheckboxField
          id="vendor-shop-cod"
          checked={codEnabled}
          onCheckedChange={onCodEnabledChange}
          label={LABELS.vendorCodEnabled}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.payoutFrequency}
        hint={LABELS.payoutFrequencyHint}
      >
        <Select
          value={payoutFrequency ?? NO_PREFERENCE_VALUE}
          onValueChange={(value) =>
            onPayoutFrequencyChange(
              value === NO_PREFERENCE_VALUE
                ? null
                : (value as VendorPayoutFrequency),
            )
          }
        >
          <SelectTrigger id="vendor-shop-payout-frequency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_PREFERENCE_VALUE}>
              {LABELS.payoutFrequencyNoPreference}
            </SelectItem>
            <SelectItem value="WEEKLY">
              {LABELS.payoutFrequencyWeekly}
            </SelectItem>
            <SelectItem value="BIWEEKLY">
              {LABELS.payoutFrequencyBiweekly}
            </SelectItem>
            <SelectItem value="MONTHLY">
              {LABELS.payoutFrequencyMonthly}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
    </FormSection>
  );
}
