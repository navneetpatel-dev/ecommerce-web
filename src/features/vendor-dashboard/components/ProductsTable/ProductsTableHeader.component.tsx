"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import type { ProductsTableHeaderProps } from "./types";
import { productsTableHeaderStyles as styles } from "./productsTable.styles";

export function ProductsTableHeader(props: ProductsTableHeaderProps) {
  const { search, onSearchChange, onAddProduct } = props;
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {addProductButton}
      </div>
      <p className={styles.hint}>{LABELS.vendorProductsHint}</p>
    </div>
  );
}
