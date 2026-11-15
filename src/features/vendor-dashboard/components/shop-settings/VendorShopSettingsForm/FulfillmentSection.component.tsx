"use client";

import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { CheckboxField } from "@/shared/components/forms/CheckboxField.component";
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
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import { vendorShopSettingsFormStyles as styles } from "../../../styles/shop-settings/vendorShopSettingsForm.styles";

const NO_PREFERENCE_VALUE = "__none__";

interface FulfillmentSectionProps {
  returnShippingFee: number | null;
  codEnabled: boolean;
  payoutFrequency: VendorPayoutFrequency | null;
  disabled?: boolean;
  onReturnShippingFeeChange: (value: number | null) => void;
  onCodEnabledChange: (value: boolean) => void;
  onPayoutFrequencyChange: (value: VendorPayoutFrequency | null) => void;
}

/** Return-fee / COD / payout-cadence fields on the vendor shop settings form. */
export function FulfillmentSection({
  returnShippingFee,
  codEnabled,
  payoutFrequency,
  disabled = false,
  onReturnShippingFeeChange,
  onCodEnabledChange,
  onPayoutFrequencyChange,
}: FulfillmentSectionProps) {
  const handleReturnShippingFeeChange = (value: number | undefined) =>
    onReturnShippingFeeChange(value ?? null);
  const handlePayoutFrequencyChange = (value: string) =>
    onPayoutFrequencyChange(
      value === NO_PREFERENCE_VALUE ? null : (value as VendorPayoutFrequency),
    );

  return (
    <FormSection
      title={LABELS.settingsFulfillment}
      hint={LABELS.settingsFulfillmentHint}
      columns={3}
    >
      {disabled ? (
        <p className={styles.fulfillmentNotice}>
          Only the store proprietor (Vendor Owner) can adjust delivery
          surcharges, COD availability, and payout schedule.
        </p>
      ) : null}
      <FormFieldFrame
        label={LABELS.returnShippingFee}
        hint={LABELS.returnShippingFeeHint}
      >
        <NumberInput
          value={returnShippingFee ?? undefined}
          min={0}
          step={10}
          prefix={CURRENCY_SYMBOL}
          disabled={disabled}
          onChange={handleReturnShippingFeeChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.vendorCodEnabled}
        hint={LABELS.vendorCodEnabledHint}
      >
        <CheckboxField
          id="vendor-shop-cod"
          checked={codEnabled}
          disabled={disabled}
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
          disabled={disabled}
          onValueChange={handlePayoutFrequencyChange}
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
