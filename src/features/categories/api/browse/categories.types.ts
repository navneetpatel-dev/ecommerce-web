/** Request and response shapes of the category API. */

export type CategoryImpact = {
  categoryId: string;
  childCount: number;
  activeChildCount: number;
  productCount: number;
  /** Deleted products still filed here: they block deleting it until reassigned. */
  deletedProductCount?: number;
  /** Products listing it as a secondary category. */
  secondaryCount?: number;
  ownTaxRule: { id: string; gstPercentage: number } | null;
  gstAfterRuleRemoved: number | null;
};

export type CategoryWriteBody = {
  name?: string;
  /** Also change the URL slug on rename (off by default so links keep working). */
  regenerateSlug?: boolean;
  /** Archive active subcategories too. */
  cascade?: boolean;
  /** With a new parent that changes vendor products' GST or commission. */
  changeReason?: string;
  parentId?: string | null;
  imageUrl?: string | null;
  status?: string;
  displayOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  commissionRate?: number | null;
};

export type CategoryRateChange =
  | { kind: "reassign"; fromCategoryId: string; toCategoryId: string }
  | { kind: "reparent"; categoryId: string; parentId?: string };

export type CategoryRateImpact = {
  /** Live or pending vendor products whose GST or commission would change. */
  productCount: number;
  gstChanged: number;
  commissionChanged: number;
  vendors: Array<{ vendorId: string; businessName: string; products: number }>;
  /** Options the new category's GST would put above their MRP. */
  aboveMrp?: {
    productCount: number;
    variantCount: number;
    vendorCount: number;
  };
  /** Whether the signed-in admin may make this change. */
  canApply: boolean;
  /** Reassignment only: vendors lacking documents for the target; any of them stops the move. */
  blockedVendors?: Array<{
    vendorId: string;
    businessName: string;
    products: number;
  }>;
};
