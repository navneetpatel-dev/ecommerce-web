import type { ReactNode } from "react";
import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../utils/product-editor/variantDrafts";
import type {
  ProductListingFormValues,
  ProductWriteBody,
} from "@/features/products";

/** A category's GST: the rate, and a second rate above a per-piece price when it has a band. */
export interface CategoryGst {
  percent: number;
  abovePercent?: number | null;
  threshold?: number | null;
}

/** One category in the editor's picker: nesting depth (0 = top level) and its picture, if it has one. */
export interface CategoryOptionData {
  id: string;
  name: string;
  depth?: number;
  imageUrl?: string | null;
  /** Where a search result sits in the tree ("Home & Kitchen › Cookware"). */
  path?: string | null;
  /** GST of the category (own or inherited). */
  gst?: CategoryGst | null;
}

/** What the form tells the person about price, GST and MRP (figures come from the API, never calculated here). */
export interface PriceGuide {
  priceHint: string;
  mrpHint: string;
  /** What a customer pays for the entered price, GST included; null until the API has answered. */
  customerPrice: number | null;
}

/** Whether price, MRP, HSN code and COD can be edited, and what to tell the person when they cannot. */
export interface PricingLock {
  locked: boolean;
  hint?: string;
}

export interface ProductEditorFormProps {
  mode: "create" | "edit";
  values: ProductListingFormValues;
  /** The chosen category (the picker loads its own pages when opened) and how to record a choice. */
  category: {
    selected: CategoryOptionData | null;
    onSelect: (category: CategoryOptionData) => void;
  };
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
