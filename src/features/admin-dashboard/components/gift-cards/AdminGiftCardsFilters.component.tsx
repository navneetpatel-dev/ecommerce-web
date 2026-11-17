"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { LABELS } from "@/shared/constants/labels";
import { GiftCardStatusOptionsList } from "./GiftCardStatusOptionsList.component";
import { ALL_GIFT_CARD_STATUSES } from "../../constants/gift-cards/giftCardStatuses";

interface AdminGiftCardsFiltersProps {
  search: string;
  status: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

/** Search by code or email, and filter by status. */
export function AdminGiftCardsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onClear,
}: AdminGiftCardsFiltersProps) {
  const activeCount =
    (search.trim() ? 1 : 0) +
    (status && status !== ALL_GIFT_CARD_STATUSES ? 1 : 0);

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
        <FormFieldFrame
          label={LABELS.search}
          htmlFor="admin-gift-cards-filter-search"
        >
          <Input
            id="admin-gift-cards-filter-search"
            type="search"
            value={search}
            onChange={onSearchChange}
            placeholder={LABELS.giftCardSearchPlaceholder}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.status}
          htmlFor="admin-gift-cards-filter-status"
        >
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger id="admin-gift-cards-filter-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <GiftCardStatusOptionsList />
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
