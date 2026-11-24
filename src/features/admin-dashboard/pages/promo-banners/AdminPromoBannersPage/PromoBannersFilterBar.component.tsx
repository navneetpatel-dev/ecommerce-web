import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";

interface PromoBannersFilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onResetFilters: () => void;
}

export function PromoBannersFilterBar({
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters,
}: PromoBannersFilterBarProps) {
  const activeCount =
    (searchQuery.trim() ? 1 : 0) + (statusFilter !== "ALL" ? 1 : 0);

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={onResetFilters}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
        <FormFieldFrame
          label={LABELS.search}
          htmlFor="promo-banners-filter-search"
        >
          <Input
            id="promo-banners-filter-search"
            placeholder="Search banners by title or link..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.status}
          htmlFor="promo-banners-filter-status"
        >
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger id="promo-banners-filter-status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
      </div>
    </CollapsibleTableFilters>
  );
}
