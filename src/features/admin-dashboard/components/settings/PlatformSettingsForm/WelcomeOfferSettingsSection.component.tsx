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
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import type { PlatformSettings } from "../../../hooks/settings/usePlatformSettingsForm.hook";
import { useWelcomeOfferSettingsSection } from "../../../hooks/settings/useWelcomeOfferSettingsSection.hook";

interface WelcomeOfferSettingsSectionProps {
  form: PlatformSettings;
  onEnabledChange: (value: boolean) => void;
  onPercentChange: (value: number) => void;
  onMaxDiscountChange: (value: number) => void;
  onMinOrderChange: (value: number) => void;
  onValidDaysChange: (value: number) => void;
}

/** The first-order code emailed to new shoppers once they verify their email. */
export function WelcomeOfferSettingsSection(
  props: WelcomeOfferSettingsSectionProps,
) {
  const section = useWelcomeOfferSettingsSection(props);

  return (
    <FormSection
      title={LABELS.welcomeOfferSection}
      hint={LABELS.welcomeOfferSectionHint}
      columns={3}
    >
      <FormFieldFrame label={LABELS.welcomeOfferEnabled}>
        <Select
          value={section.enabledValue}
          onValueChange={section.handleEnabledChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">{LABELS.welcomeOfferOn}</SelectItem>
            <SelectItem value="false">{LABELS.welcomeOfferOff}</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.welcomeOfferPercent}>
        <NumberInput
          value={props.form.welcomeOfferPercent}
          min={1}
          max={100}
          step={1}
          suffix="%"
          disabled={section.disabled}
          onChange={section.handlePercentChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.welcomeOfferMaxDiscount}
        hint={LABELS.welcomeOfferMaxDiscountHint}
      >
        <NumberInput
          value={props.form.welcomeOfferMaxDiscount}
          min={0}
          step={50}
          prefix={CURRENCY_SYMBOL}
          disabled={section.disabled}
          onChange={section.handleMaxDiscountChange}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.welcomeOfferMinOrder}>
        <NumberInput
          value={props.form.welcomeOfferMinOrder}
          min={0}
          step={50}
          prefix={CURRENCY_SYMBOL}
          disabled={section.disabled}
          onChange={section.handleMinOrderChange}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.welcomeOfferValidDays}>
        <NumberInput
          value={props.form.welcomeOfferValidDays}
          min={1}
          max={365}
          step={1}
          suffix={LABELS.daysShort}
          disabled={section.disabled}
          onChange={section.handleValidDaysChange}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
