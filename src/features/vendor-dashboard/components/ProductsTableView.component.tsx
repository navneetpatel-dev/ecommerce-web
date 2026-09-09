import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { PaginationContainer } from "@/shared/containers/PaginationContainer.container";
import { PaginationResultSummary } from "@/shared/components/PaginationResultSummary.component";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import { ProductsTableHeader, ProductsTableContent } from "./ProductsTable";
import { productsTableViewStyles } from "./ProductsTable/productsTable.styles";

interface ProductRow {
  id: string;
  name: string;
  slug?: string;
  sku: string;
  stock: number;
  lowStockAt: number;
  basePrice: number;
  status: string;
}

interface ProductsTableViewProps {
  search: string;
  isLoading: boolean;
  products?: ProductRow[];
  page: number;
  totalPages?: number;
  total?: number;
  isDeleting?: boolean;
  isSubmitting?: boolean;
  actionMessage?: string | null;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAddProduct?: () => void;
  onEditProduct?: (product: ProductRow) => void;
  onDeleteProduct?: (product: ProductRow) => void;
  onSubmitForApproval?: (product: ProductRow) => void;
  onManageImages?: (product: ProductRow) => void;
}

export function ProductsTableView({
  search,
  isLoading,
  products,
  page,
  totalPages,
  total,
  isDeleting,
  isSubmitting,
  actionMessage,
  onSearchChange,
  onPageChange,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onSubmitForApproval,
  onManageImages,
}: ProductsTableViewProps) {
  const hasTotal = typeof total === "number" && total > 0;
  const resultFrom = (page - 1) * DEFAULT_PAGE_LIMIT + 1;
  const resultTo = hasTotal ? Math.min(page * DEFAULT_PAGE_LIMIT, total) : 0;

  const actionMessageNotice = actionMessage ? (
    <p className={productsTableViewStyles.notice}>{actionMessage}</p>
  ) : null;

  const resultSummary = hasTotal ? (
    <PaginationResultSummary
      from={resultFrom}
      to={resultTo}
      total={total}
      className={productsTableViewStyles.notice}
    />
  ) : null;

  const tableContent = isLoading ? (
    <SkeletonRows count={5} height="h-10 w-full" />
  ) : (
    <ProductsTableContent
      products={products}
      onEdit={onEditProduct}
      onDelete={onDeleteProduct}
      onSubmitForApproval={onSubmitForApproval}
      onManageImages={onManageImages}
      isDeleting={isDeleting}
      isSubmitting={isSubmitting}
    />
  );

  const pagination = totalPages ? (
    <PaginationContainer
      currentPage={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  ) : null;

  return (
    <div>
      <ProductsTableHeader
        search={search}
        onSearchChange={onSearchChange}
        onAddProduct={onAddProduct}
      />
      {actionMessageNotice}
      {resultSummary}
      {tableContent}
      {pagination}
    </div>
  );
}
