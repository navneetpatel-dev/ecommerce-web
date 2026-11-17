"use client";

import type { ChangeEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";

export interface AdminShippingZonesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export function AdminShippingZonesFilters({
  search,
  onSearchChange,
  onClear,
}: AdminShippingZonesFiltersProps) {
  const activeCount = search.trim() ? 1 : 0;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
        <FormFieldFrame
          label={LABELS.search}
          htmlFor="admin-shipping-zones-filter-search"
        >
          <Input
            id="admin-shipping-zones-filter-search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search zones by name, state, or pincode prefix..."
          />
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
