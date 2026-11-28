"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingZoneOption } from "../../hooks/shipping/useAdminShippingRatesPage";

interface ShippingRateScopeFieldsProps {
  zoneId: string;
  method: "STANDARD" | "EXPRESS";
  zones: ShippingZoneOption[];
  onZoneIdChange: (value: string) => void;
  onMethodChange: (value: "STANDARD" | "EXPRESS") => void;
}

/** Which zone and delivery method a shipping rate applies to. */
export function ShippingRateScopeFields({
  zoneId,
  method,
  zones,
  onZoneIdChange,
  onMethodChange,
}: ShippingRateScopeFieldsProps) {
  const handleMethodChange = (value: string) =>
    onMethodChange(value as "STANDARD" | "EXPRESS");

  return (
    <>
      <FormFieldFrame
        label={shippingRatesLabels.zone}
        htmlFor="shipping-rate-dialog-zone"
      >
        <Select value={zoneId} onValueChange={onZoneIdChange}>
          <SelectTrigger id="shipping-rate-dialog-zone">
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
        htmlFor="shipping-rate-dialog-method"
      >
        <Select value={method} onValueChange={handleMethodChange}>
          <SelectTrigger id="shipping-rate-dialog-method">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SHIPPING_METHOD.STANDARD}>Standard</SelectItem>
            <SelectItem value={SHIPPING_METHOD.EXPRESS}>Express</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
    </>
  );
}
