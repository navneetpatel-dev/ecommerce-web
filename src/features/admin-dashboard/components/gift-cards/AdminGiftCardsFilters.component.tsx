"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { adminGiftCardsStyles as styles } from "../../styles/gift-cards/adminGiftCards.styles";
import { GiftCardStatusOptionsList } from "./GiftCardStatusOptionsList.component";

interface AdminGiftCardsFiltersProps {
  search: string;
  status: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
}

/** Search by code or email, and filter by status. */
export function AdminGiftCardsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: AdminGiftCardsFiltersProps) {
  return (
    <div className={styles.filters}>
      <Input
        type="search"
        value={search}
        onChange={onSearchChange}
        placeholder={LABELS.giftCardSearchPlaceholder}
        aria-label={LABELS.giftCardSearchPlaceholder}
      />
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger aria-label={LABELS.giftCardStatus}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <GiftCardStatusOptionsList />
        </SelectContent>
      </Select>
    </div>
  );
}
