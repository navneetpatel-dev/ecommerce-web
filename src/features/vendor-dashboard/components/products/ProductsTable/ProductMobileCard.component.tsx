"use client";

import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { ProductActions } from "./ProductActions.component";
import { productMobileCardStyles as styles } from "../../../styles/products/productsTable.styles";
import type { ProductRowActionsProps } from "../../../types/products/ProductsTable-types";

/** Below-lg card treatment for a vendor product (mirrors the desktop row). */
export function ProductMobileCard(props: ProductRowActionsProps) {
  const {
    product,
    onEdit,
    onDelete,
    onSubmitForApproval,
    onManageImages,
    isDeleting,
    isSubmitting,
  } = props;
  const lowStock = product.stock <= product.lowStockAt;
  const stockValueClassName = lowStock ? styles.metaValueLow : styles.metaValue;

  return (
    <li className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <p className={styles.name}>{product.name}</p>
          <p className={styles.sku}>{product.sku}</p>
        </div>
        <StatusBadge status={product.status} />
      </div>
      <dl className={styles.metaGrid}>
        <div>
          <dt className={styles.metaLabel}>{LABELS.stock}</dt>
          <dd className={stockValueClassName}>{product.stock}</dd>
        </div>
        <div>
          <dt className={styles.metaLabel}>{LABELS.price}</dt>
          <dd className={styles.metaValueMono}>₹{product.basePrice}</dd>
        </div>
      </dl>
      <div className={styles.actionsWrapper}>
        <ProductActions
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onSubmitForApproval={onSubmitForApproval}
          onManageImages={onManageImages}
          isDeleting={isDeleting}
          isSubmitting={isSubmitting}
        />
      </div>
    </li>
  );
}
