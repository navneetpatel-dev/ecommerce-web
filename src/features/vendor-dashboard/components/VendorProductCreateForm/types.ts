import type {
  ProductListingFormValues,
  ProductWriteBody,
} from "@/features/products";

export interface VendorProductCreateFormProps {
  mode: "create" | "edit";
  values: ProductListingFormValues;
  categories: Array<{ id: string; name: string }>;
  imageUrls: string[];
  draftUploadId: string;
  submitError: string | null;
  submitting: boolean;
  loading?: boolean;
  onChange: (patch: Partial<ProductListingFormValues>) => void;
  onImageUrlsChange: (urls: string[]) => void;
  onValidSubmit: (body: ProductWriteBody) => void;
  onCancel: () => void;
}
