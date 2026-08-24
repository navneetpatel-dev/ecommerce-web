/** Row model shared by the vendor products table pieces (Rule 10). */
export interface ProductTableRow {
  id: string;
  name: string;
  slug?: string;
  sku: string;
  stock: number;
  lowStockAt: number;
  basePrice: number;
  status: string;
}

interface ProductActionCallbacks {
  onEdit?: (product: ProductTableRow) => void;
  onDelete?: (product: ProductTableRow) => void;
  onSubmitForApproval?: (product: ProductTableRow) => void;
  onManageImages?: (product: ProductTableRow) => void;
  isDeleting?: boolean;
  isSubmitting?: boolean;
}

export interface ProductRowActionsProps extends ProductActionCallbacks {
  product: ProductTableRow;
}

export interface ProductsTableHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddProduct?: () => void;
}

export interface ProductsTableContentProps extends ProductActionCallbacks {
  products?: ProductTableRow[];
}
