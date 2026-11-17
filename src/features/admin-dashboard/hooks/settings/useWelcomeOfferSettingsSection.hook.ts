"use client";

import type { PlatformSettings } from "./usePlatformSettingsForm.hook";

interface WelcomeOfferSectionOptions {
  form: PlatformSettings;
  onEnabledChange: (value: boolean) => void;
  onPercentChange: (value: number) => void;
  onMaxDiscountChange: (value: number) => void;
  onMinOrderChange: (value: number) => void;
  onValidDaysChange: (value: number) => void;
}

/** Maps the welcome-offer fields to the select and number inputs; a cleared box keeps the default. */
export function useWelcomeOfferSettingsSection({
  form,
  onEnabledChange,
  onPercentChange,
  onMaxDiscountChange,
  onMinOrderChange,
  onValidDaysChange,
}: WelcomeOfferSectionOptions) {
  const handleEnabledChange = (value: string) =>
    onEnabledChange(value === "true");
  const handlePercentChange = (value: number | undefined) =>
    onPercentChange(value ?? 10);
  const handleMaxDiscountChange = (value: number | undefined) =>
    onMaxDiscountChange(value ?? 0);
  const handleMinOrderChange = (value: number | undefined) =>
    onMinOrderChange(value ?? 0);
  const handleValidDaysChange = (value: number | undefined) =>
    onValidDaysChange(value ?? 30);

  return {
    enabledValue: form.welcomeOfferEnabled === false ? "false" : "true",
    disabled: form.welcomeOfferEnabled === false,
    handleEnabledChange,
    handlePercentChange,
    handleMaxDiscountChange,
    handleMinOrderChange,
    handleValidDaysChange,
  };
}
