"use client";

import type { FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingZoneOption } from "../../hooks/shipping/useAdminShippingRatesPage";
import { useAdminVendorsList } from "../../api/analytics/admin.queries";
import { ShippingRateNumberField } from "./ShippingRateNumberField.component";

export interface AdminShippingRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AdminShippingRateDialog({
  open,
  onOpenChange,
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
}: AdminShippingRateDialogProps) {
  const { data: vendorsData } = useAdminVendorsList();
  const vendors = vendorsData?.items ?? [];

  const canCreate = Boolean(
    zoneId && maxWeightGrams.trim() && price.trim() && estimatedDays.trim(),
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreate) return;
    onSubmit(event);
  };

  const handleMethodChange = (value: string) =>
    onMethodChange(value as "STANDARD" | "EXPRESS");

  const handleVendorSelect = (value: string) =>
    onVendorIdChange(value === "all" ? "" : value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{shippingRatesLabels.addShippingRate}</DialogTitle>
          <DialogDescription>
            Configure delivery charges, weight limits, transit speed, and free
            shipping rules.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <SelectItem value={SHIPPING_METHOD.STANDARD}>
                    Standard
                  </SelectItem>
                  <SelectItem value={SHIPPING_METHOD.EXPRESS}>
                    Express
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormFieldFrame>

            <ShippingRateNumberField
              label={shippingRatesLabels.minWeightGrams}
              htmlFor="shipping-rate-dialog-min-weight"
              value={minWeightGrams}
              onChange={onMinWeightGramsChange}
            />

            <ShippingRateNumberField
              label={shippingRatesLabels.maxWeightGrams}
              htmlFor="shipping-rate-dialog-max-weight"
              value={maxWeightGrams}
              onChange={onMaxWeightGramsChange}
            />

            <ShippingRateNumberField
              label={LABELS.price}
              htmlFor="shipping-rate-dialog-price"
              value={price}
              onChange={onPriceChange}
            />

            <ShippingRateNumberField
              label={shippingRatesLabels.estimatedDays}
              htmlFor="shipping-rate-dialog-estimated-days"
              value={estimatedDays}
              onChange={onEstimatedDaysChange}
            />

            <ShippingRateNumberField
              label={shippingRatesLabels.freeShippingThresholdOptional}
              htmlFor="shipping-rate-dialog-free-threshold"
              value={freeShippingThreshold}
              onChange={onFreeShippingThresholdChange}
            />

            <FormFieldFrame
              label={shippingRatesLabels.vendorOptional}
              htmlFor="shipping-rate-dialog-vendor"
            >
              <Select
                value={vendorId || "all"}
                onValueChange={handleVendorSelect}
              >
                <SelectTrigger id="shipping-rate-dialog-vendor">
                  <SelectValue placeholder={shippingRatesLabels.selectVendor} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {shippingRatesLabels.allVendorsDefault}
                  </SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.businessName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldFrame>
          </div>

          <FormError
            error={createError}
            fallback={shippingRatesLabels.couldNotCreateShippingRate}
          />

          <DialogFooter className="flex items-center justify-end gap-3 pt-3 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {LABELS.cancel}
            </Button>
            <Button type="submit" disabled={!canCreate}>
              {shippingRatesLabels.addShippingRate}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
