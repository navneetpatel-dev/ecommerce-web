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
import { Plus } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { formatStatusLabel } from "@/shared/utils/formatting/formatStatus";
import type { ProductsTableHeaderProps } from "../../../types/products/ProductsTable-types";
import { productsTableHeaderStyles as styles } from "../../../styles/products/productsTable.styles";

const ALL_STATUSES = "__ALL__";

export function ProductsTableHeader(props: ProductsTableHeaderProps) {
  const { search, onSearchChange, status, onStatusChange, onAddProduct } =
    props;

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <h2 className={styles.heading}>{LABELS.products}</h2>
          <Input
            placeholder={LABELS.searchProducts}
            className={styles.searchInput}
            value={search}
            onChange={handleSearchChange}
          />
          {onStatusChange ? (
            <div className="w-44 shrink-0">
              <Select
                value={status || ALL_STATUSES}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="h-9 text-sm">
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
            </div>
          ) : null}
        </div>
        {addProductButton}
      </div>
      <p className={styles.hint}>{LABELS.vendorProductsHint}</p>
    </div>
  );
}
