"use client";

import { type ChangeEvent } from "react";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { formatStatusLabel } from "@/shared/utils/formatting/formatStatus";
import { LABELS } from "@/shared/constants/labels";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { useCategories } from "@/features/categories";
import { useAdminVendorsList } from "../../api/analytics/admin.queries";
import { AdminProductsPriceSortRow } from "./AdminProductsPriceSortRow.component";

export interface AdminProductsFiltersProps {
  search: string;
  status: string;
  categoryId?: string;
  vendorId?: string;
  inStock?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  hideStatus?: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onVendorChange?: (value: string) => void;
  onInStockChange?: (value: string) => void;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onClear: () => void;
}

const ALL_OPTION = "__ALL__";

export function AdminProductsFilters(props: AdminProductsFiltersProps) {
  const {
    search,
    status,
    categoryId = "",
    vendorId = "",
    inStock = "",
    minPrice = "",
    maxPrice = "",
    sort = "",
    hideStatus = false,
    onSearchChange,
    onStatusChange,
    onCategoryChange,
    onVendorChange,
    onInStockChange,
    onMinPriceChange,
    onMaxPriceChange,
    onSortChange,
    onClear,
  } = props;

  const { data: categories } = useCategories();
  const { data: vendorsData } = useAdminVendorsList();
  const vendors = vendorsData?.items ?? [];

  const activeCount =
    (search.trim() ? 1 : 0) +
    (!hideStatus && status ? 1 : 0) +
    (categoryId ? 1 : 0) +
    (vendorId ? 1 : 0) +
    (inStock ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (sort ? 1 : 0);

  const handleSelect = (setter?: (val: string) => void) => (val: string) => {
    setter?.(val === ALL_OPTION ? "" : val);
  };

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
      <div className="space-y-3.5">
        <div
          className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${hideStatus ? "lg:grid-cols-3" : "lg:grid-cols-4"} items-end`}
        >
          <FormFieldFrame label={LABELS.search} htmlFor="admin-products-search">
            <SearchInput
              id="admin-products-search"
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              onClear={() => onSearchChange("")}
              placeholder="Search name, SKU, tag..."
            />
          </FormFieldFrame>

          {!hideStatus && (
            <FormFieldFrame
              label={LABELS.status}
              htmlFor="admin-products-status"
            >
              <Select
                value={status || ALL_OPTION}
                onValueChange={handleSelect(onStatusChange)}
              >
                <SelectTrigger id="admin-products-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_OPTION}>All Statuses</SelectItem>
                  {Object.values(PRODUCT_STATUS).map((s) => (
                    <SelectItem key={s} value={s}>
                      {formatStatusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldFrame>
          )}

          <FormFieldFrame
            label={LABELS.category}
            htmlFor="admin-products-category"
          >
            <Select
              value={categoryId || ALL_OPTION}
              onValueChange={handleSelect(onCategoryChange)}
            >
              <SelectTrigger id="admin-products-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTION}>All Categories</SelectItem>
                {categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>

          <FormFieldFrame label="Vendor" htmlFor="admin-products-vendor">
            <Select
              value={vendorId || ALL_OPTION}
              onValueChange={handleSelect(onVendorChange)}
            >
              <SelectTrigger id="admin-products-vendor">
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTION}>All Vendors</SelectItem>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.businessName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </div>

        <AdminProductsPriceSortRow
          inStock={inStock}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sort={sort}
          onInStockChange={onInStockChange}
          onMinPriceChange={onMinPriceChange}
          onMaxPriceChange={onMaxPriceChange}
          onSortChange={onSortChange}
        />
      </div>
    </CollapsibleTableFilters>
  );
}
