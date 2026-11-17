"use client";

import type { ChangeEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import { shippingRatesLabels } from "@/shared/constants/labels/shippingRates";
import { SHIPPING_METHOD } from "@/shared/constants/statuses";
import type { ShippingZoneOption } from "../../hooks/shipping/useAdminShippingRatesPage";

export interface AdminShippingRatesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  zoneId: string;
  onZoneIdChange: (value: string) => void;
  method: string;
  onMethodChange: (value: string) => void;
  vendorId: string;
  onVendorIdChange: (value: string) => void;
  zones: ShippingZoneOption[];
  vendors: Array<{ id: string; name: string }>;
  onClear: () => void;
}

export function AdminShippingRatesFilters({
  search,
  onSearchChange,
  zoneId,
  onZoneIdChange,
  method,
  onMethodChange,
  vendorId,
  onVendorIdChange,
  zones,
  vendors,
  onClear,
}: AdminShippingRatesFiltersProps) {
  const activeCount =
    (search.trim() ? 1 : 0) +
    (zoneId !== "ALL" ? 1 : 0) +
    (method !== "ALL" ? 1 : 0) +
    (vendorId !== "ALL" ? 1 : 0);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <FormFieldFrame
          label={LABELS.search}
          htmlFor="admin-shipping-rates-filter-search"
        >
          <Input
            id="admin-shipping-rates-filter-search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search rates by zone, vendor, or method..."
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={shippingRatesLabels.zone}
          htmlFor="admin-shipping-rates-filter-zone"
        >
          <Select value={zoneId} onValueChange={onZoneIdChange}>
            <SelectTrigger id="admin-shipping-rates-filter-zone">
              <SelectValue placeholder="All Zones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Zones</SelectItem>
              {zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>

        <FormFieldFrame
          label={shippingRatesLabels.method}
          htmlFor="admin-shipping-rates-filter-method"
        >
          <Select value={method} onValueChange={onMethodChange}>
            <SelectTrigger id="admin-shipping-rates-filter-method">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Methods</SelectItem>
              <SelectItem value={SHIPPING_METHOD.STANDARD}>Standard</SelectItem>
              <SelectItem value={SHIPPING_METHOD.EXPRESS}>Express</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>

        <FormFieldFrame
          label={shippingRatesLabels.vendorOptional}
          htmlFor="admin-shipping-rates-filter-vendor"
        >
          <Select value={vendorId} onValueChange={onVendorIdChange}>
            <SelectTrigger id="admin-shipping-rates-filter-vendor">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Vendors (Platform)</SelectItem>
              {vendors.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>

        {activeCount > 0 && (
          <div className="flex items-end">
            <Button type="button" variant="outline" onClick={onClear}>
              {LABELS.clearFilters}
            </Button>
          </div>
        )}
      </div>
    </CollapsibleTableFilters>
  );
}
