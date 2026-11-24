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
  status?: string;
  onStatusChange?: (value: string) => void;
  categoryId?: string;
  onCategoryChange?: (value: string) => void;
  inStock?: string;
  onInStockChange?: (value: string) => void;
  minPrice?: string;
  onMinPriceChange?: (value: string) => void;
  maxPrice?: string;
  onMaxPriceChange?: (value: string) => void;
  sort?: string;
  onSortChange?: (value: string) => void;
  onClear?: () => void;
  onAddProduct?: () => void;
}

export interface ProductsTableContentProps extends ProductActionCallbacks {
  products?: ProductTableRow[];
}
