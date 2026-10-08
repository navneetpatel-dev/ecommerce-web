"use client";

import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingZoneOption } from "../../hooks/shipping/useAdminShippingRatesPage";
import { ShippingRateNumberField } from "./ShippingRateNumberField.component";

interface AdminShippingRateFormProps {
  zoneId: string;
  method: "STANDARD" | "EXPRESS";
  minWeightGrams: string;
  maxWeightGrams: string;
  price: string;
  estimatedDays: string;
  freeShippingThreshold: string;
  vendorId: string;
  zones: ShippingZoneOption[];
  createError?: string | null;
  onZoneIdChange: (value: string) => void;
  onMethodChange: (value: "STANDARD" | "EXPRESS") => void;
  onMinWeightGramsChange: (value: string) => void;
  onMaxWeightGramsChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onEstimatedDaysChange: (value: string) => void;
  onFreeShippingThresholdChange: (value: string) => void;
  onVendorIdChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function AdminShippingRateForm({
  zoneId,
  method,
  minWeightGrams,
  maxWeightGrams,
  price,
  estimatedDays,
  freeShippingThreshold,
  vendorId,
  zones,
  createError = null,
  onZoneIdChange,
  onMethodChange,
  onMinWeightGramsChange,
  onMaxWeightGramsChange,
  onPriceChange,
  onEstimatedDaysChange,
  onFreeShippingThresholdChange,
  onVendorIdChange,
  onSubmit,
}: AdminShippingRateFormProps) {
  const canCreate = Boolean(
    zoneId && maxWeightGrams.trim() && price.trim() && estimatedDays.trim(),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!canCreate) {
      event.preventDefault();
      return;
    }
    onSubmit(event);
  };
  const handleMethodChange = (value: string) =>
    onMethodChange(value as "STANDARD" | "EXPRESS");
  const handleVendorIdChange = (event: ChangeEvent<HTMLInputElement>) =>
    onVendorIdChange(event.target.value);

  return (
    <form onSubmit={handleSubmit}>
      <FormSection title={shippingRatesLabels.addShippingRate} columns={3}>
        <FormFieldFrame
          label={shippingRatesLabels.zone}
          htmlFor="shipping-rate-zone"
        >
          <Select value={zoneId} onValueChange={onZoneIdChange}>
            <SelectTrigger id="shipping-rate-zone">
              <SelectValue placeholder={shippingRatesLabels.selectZone} />
            </SelectTrigger>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  {zone.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>

        <FormFieldFrame
          label={shippingRatesLabels.method}
          htmlFor="shipping-rate-method"
        >
          <Select value={method} onValueChange={handleMethodChange}>
            <SelectTrigger id="shipping-rate-method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SHIPPING_METHOD.STANDARD}>Standard</SelectItem>
              <SelectItem value={SHIPPING_METHOD.EXPRESS}>Express</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>

        <ShippingRateNumberField
          label={shippingRatesLabels.minWeightGrams}
          htmlFor="shipping-rate-min-weight"
          value={minWeightGrams}
          onChange={onMinWeightGramsChange}
        />

        <ShippingRateNumberField
          label={shippingRatesLabels.maxWeightGrams}
          htmlFor="shipping-rate-max-weight"
          value={maxWeightGrams}
          onChange={onMaxWeightGramsChange}
        />

        <ShippingRateNumberField
          label={LABELS.price}
          htmlFor="shipping-rate-price"
          value={price}
          onChange={onPriceChange}
        />

        <ShippingRateNumberField
          label={shippingRatesLabels.estimatedDays}
          htmlFor="shipping-rate-estimated-days"
          value={estimatedDays}
          onChange={onEstimatedDaysChange}
        />

        <ShippingRateNumberField
          label={shippingRatesLabels.freeShippingThresholdOptional}
          htmlFor="shipping-rate-free-threshold"
          value={freeShippingThreshold}
          onChange={onFreeShippingThresholdChange}
        />

        <FormFieldFrame
          label={shippingRatesLabels.vendorIdOptional}
          htmlFor="shipping-rate-vendor-id"
        >
          <Input
            id="shipping-rate-vendor-id"
            value={vendorId}
            onChange={handleVendorIdChange}
            placeholder={shippingRatesLabels.vendorIdOptional}
          />
        </FormFieldFrame>

        <FormError
          error={createError}
          fallback={shippingRatesLabels.couldNotCreateShippingRate}
        />
        <FormActions>
          <DisabledActionHint
            disabled={!canCreate}
            message={shippingRatesLabels.selectZoneToCreateRate}
          >
            <Button type="submit" fullWidth="mobile" disabled={!canCreate}>
              {shippingRatesLabels.addShippingRate}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormSection>
    </form>
  );
}
