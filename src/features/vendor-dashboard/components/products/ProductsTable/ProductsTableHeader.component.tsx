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
import { Plus } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { formatStatusLabel } from "@/shared/utils/formatting/formatStatus";
import { useCategories } from "@/features/categories";
import type { ProductsTableHeaderProps } from "../../../types/products/ProductsTable-types";
import { productsTableHeaderStyles as styles } from "../../../styles/products/productsTable.styles";
import { ProductsTablePriceSortRow } from "./ProductsTablePriceSortRow.component";

const ALL_OPTION = "__ALL__";

const STOCK_OPTIONS = [
  { value: ALL_OPTION, label: "All Inventory" },
  { value: "in_stock", label: "In Stock Only" },
  { value: "out_of_stock", label: "Out of Stock" },
];

export function ProductsTableHeader(props: ProductsTableHeaderProps) {
  const {
    search,
    onSearchChange,
    status,
    onStatusChange,
    categoryId = "",
    onCategoryChange,
    inStock = "",
    onInStockChange,
    minPrice = "",
    onMinPriceChange,
    maxPrice = "",
    onMaxPriceChange,
    sort = "",
    onSortChange,
    onClear,
    onAddProduct,
  } = props;

  const { data: categories } = useCategories();

  const handleSelect = (setter?: (val: string) => void) => (val: string) => {
    setter?.(val === ALL_OPTION ? "" : val);
  };

  const activeCount =
    (search.trim() ? 1 : 0) +
    (status && status !== ALL_OPTION ? 1 : 0) +
    (categoryId ? 1 : 0) +
    (inStock ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (sort ? 1 : 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.heading}>{LABELS.products}</h2>
          <p className={styles.hint}>{LABELS.vendorProductsHint}</p>
        </div>
        {onAddProduct && (
          <Button
            size="sm"
            type="button"
            fullWidth="mobile"
            onClick={onAddProduct}
          >
            <Plus aria-hidden /> {LABELS.addProduct}
          </Button>
        )}
      </div>

      <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
            <FormFieldFrame
              label={LABELS.search}
              htmlFor="vendor-products-search"
            >
              <Input
                id="vendor-products-search"
                placeholder={LABELS.searchProducts}
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onSearchChange(e.target.value)
                }
              />
            </FormFieldFrame>

            <FormFieldFrame
              label={LABELS.status}
              htmlFor="vendor-products-status"
            >
              <Select
                value={status || ALL_OPTION}
                onValueChange={handleSelect(onStatusChange)}
              >
                <SelectTrigger id="vendor-products-status">
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

            <FormFieldFrame
              label={LABELS.category}
              htmlFor="vendor-products-category"
            >
              <Select
                value={categoryId || ALL_OPTION}
                onValueChange={handleSelect(onCategoryChange)}
              >
                <SelectTrigger id="vendor-products-category">
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

            <FormFieldFrame label="Inventory" htmlFor="vendor-products-stock">
              <Select
                value={inStock || ALL_OPTION}
                onValueChange={handleSelect(onInStockChange)}
              >
                <SelectTrigger id="vendor-products-stock">
                  <SelectValue placeholder="All Inventory" />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldFrame>
          </div>

          <ProductsTablePriceSortRow
            minPrice={minPrice}
            onMinPriceChange={onMinPriceChange}
            maxPrice={maxPrice}
            onMaxPriceChange={onMaxPriceChange}
            sort={sort}
            onSortChange={onSortChange}
          />
        </div>
      </CollapsibleTableFilters>
    </div>
  );
}
