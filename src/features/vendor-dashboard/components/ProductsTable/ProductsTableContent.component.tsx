"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/shared/components/ui/table";
import { LABELS } from "@/shared/constants/labels";
import {
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_DATA_CELL_CLASS,
  TABLE_PINNED_LAYOUT_CLASS,
} from "@/shared/constants/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { ProductRow } from "./ProductRow.component";
import { ProductMobileCard } from "./ProductMobileCard.component";
import { productsTableContentStyles as styles } from "./productsTable.styles";
import type { ProductsTableContentProps } from "./types";

/** Empty / mobile cards / desktop pinned-actions table for vendor products. */
export function ProductsTableContent(props: ProductsTableContentProps) {
  const {
    products,
    onEdit,
    onDelete,
    onSubmitForApproval,
    onManageImages,
    isDeleting,
    isSubmitting,
  } = props;

  if (products?.length === 0) {
    return <div className={styles.empty}>{LABELS.noProductsFound}</div>;
  }

  const buildActionProps = (
    product: NonNullable<ProductsTableContentProps["products"]>[number],
  ) => ({
    product,
    onEdit,
    onDelete,
    onSubmitForApproval,
    onManageImages,
    isDeleting,
    isSubmitting,
  });

  return (
    <>
      {/* Below lg: card list + kebab actions */}
      <ul className={styles.mobileList}>
        {products?.map((product) => (
          <ProductMobileCard key={product.id} {...buildActionProps(product)} />
        ))}
      </ul>

      {/* lg+: horizontal scroll + pinned actions */}
      <TableScrollShell desktopOnly>
        <Table scrollContainer={false} className={TABLE_PINNED_LAYOUT_CLASS}>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.productName}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.sku}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.stock}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.price}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.status}
              </TableHead>
              <TableHead className={TABLE_ACTIONS_HEAD_CLASS}>
                {LABELS.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <ProductRow key={product.id} {...buildActionProps(product)} />
            ))}
          </TableBody>
        </Table>
      </TableScrollShell>
    </>
  );
}
