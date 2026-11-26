import type { ReactNode } from "react";
import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../utils/product-editor/variantDrafts";
import type {
  ProductListingFormValues,
  ProductWriteBody,
} from "@/features/products";

/** One category in the editor's picker: nesting depth (0 = top level) and its picture, if it has one. */
export interface CategoryOptionData {
  id: string;
  name: string;
  depth?: number;
  imageUrl?: string | null;
}

/** Whether price, MRP, HSN code and COD can be edited, and what to tell the person when they cannot. */
export interface PricingLock {
  locked: boolean;
  hint?: string;
}

export interface ProductEditorFormProps {
  mode: "create" | "edit";
  values: ProductListingFormValues;
  categories: CategoryOptionData[];
  imageUrls: string[];
  draftUploadId: string;
  submitError: string | null;
  apiFieldErrors?: Partial<
    Record<import("@/features/products").ProductListingFormField, string>
  >;
  submitting: boolean;
  loading?: boolean;
  onChange: (patch: Partial<ProductListingFormValues>) => void;
  onImageUrlsChange: (urls: string[]) => void;
  onValidSubmit: (body: ProductWriteBody) => void;
  onCancel: () => void;
  /** Overrides the default (vendor staff locked, everyone else free). */
  pricingLock?: PricingLock;
  /** Admin only: the vendor this product is listed for (create mode). */
  vendorField?: ReactNode;
  /** Admin only: asks why a live product's price is changing. */
  reason?: {
    required: boolean;
    value: string;
    error?: string;
    onChange: (value: string) => void;
  };
  /** Variants section of the create form (rows are saved after the product). */
  variants?: {
    rows: VariantDraft[];
    errors: Record<string, VariantDraftErrors>;
    onChange: (rows: VariantDraft[]) => void;
  };
}
