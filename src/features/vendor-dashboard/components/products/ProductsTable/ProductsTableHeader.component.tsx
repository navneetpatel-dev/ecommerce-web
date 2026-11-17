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
import type { ProductsTableHeaderProps } from "../../../types/products/ProductsTable-types";
import { productsTableHeaderStyles as styles } from "../../../styles/products/productsTable.styles";

const ALL_STATUSES = "__ALL__";

export function ProductsTableHeader(props: ProductsTableHeaderProps) {
  const {
    search,
    onSearchChange,
    status,
    onStatusChange,
    onClear,
    onAddProduct,
  } = props;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    onSearchChange(event.target.value);

  const handleStatusChange = (val: string) => {
    if (onStatusChange) {
      onStatusChange(val === ALL_STATUSES ? "" : val);
    }
  };

  const addProductButton = onAddProduct ? (
    <Button size="sm" type="button" fullWidth="mobile" onClick={onAddProduct}>
      <Plus aria-hidden /> {LABELS.addProduct}
    </Button>
  ) : null;

  const activeCount =
    (search.trim() ? 1 : 0) + (status && status !== ALL_STATUSES ? 1 : 0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div>
          <h2 className={styles.heading}>{LABELS.products}</h2>
          <p className={styles.hint}>{LABELS.vendorProductsHint}</p>
        </div>
        {addProductButton}
      </div>

      <CollapsibleTableFilters activeCount={activeCount} onClear={onClear}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
          <FormFieldFrame
            label={LABELS.search}
            htmlFor="vendor-products-filter-search"
          >
            <Input
              id="vendor-products-filter-search"
              placeholder={LABELS.searchProducts}
              value={search}
              onChange={handleSearchChange}
            />
          </FormFieldFrame>

          {onStatusChange ? (
            <FormFieldFrame
              label={LABELS.status}
              htmlFor="vendor-products-filter-status"
            >
              <Select
                value={status || ALL_STATUSES}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="vendor-products-filter-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_STATUSES}>All Statuses</SelectItem>
                  {Object.values(PRODUCT_STATUS).map((s) => (
                    <SelectItem key={s} value={s}>
                      {formatStatusLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldFrame>
          ) : null}

          {activeCount > 0 && onClear ? (
            <div className="flex items-end">
              <Button type="button" variant="outline" onClick={onClear}>
                {LABELS.clearFilters}
              </Button>
            </div>
          ) : null}
        </div>
      </CollapsibleTableFilters>
    </div>
  );
}
