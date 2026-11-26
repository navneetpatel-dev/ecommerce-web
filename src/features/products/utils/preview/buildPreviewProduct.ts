import type {
  ProductDetail,
  ProductImage,
  ProductVariant,
} from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import type { GstPricePreview } from "../../api/listing/products.api";
import {
  splitCommaList,
  type ProductListingFormValues,
} from "../../types/listing-form/productListingForm.types";
import type { CategoryOptionData } from "../../types/product-editor/types";
import {
  isBlankDraft,
  parseVariantOptions,
  type VariantDraft,
} from "../product-editor/variantDrafts";

export interface PreviewProductInput {
  values: ProductListingFormValues;
  /** `create`: images and variants come from the form; `edit`: from the saved product. */
  mode: "create" | "edit";
  imageUrls: string[];
  variantRows: VariantDraft[];
  saved: ProductDetail | null;
  category: CategoryOptionData | null;
  /** The API's answer for the entered price, MRP and variant prices (GST included). */
  pricing: GstPricePreview | null;
}

const numberOrNull = (text: string) =>
  text.trim() === "" ? null : Number(text);

/**
 * The product as the customer page would receive it, built from what is in the form right now. Prices
 * with GST, the strikethrough MRP and the % off are the API's figures (`pricing`), never calculated
 * here. Nothing that needs saving (ratings, reviews, related products) is invented.
 */
export function buildPreviewProduct(input: PreviewProductInput): ProductDetail {
  const { values, mode, saved, category, pricing } = input;

  const images: ProductImage[] =
    mode === "edit" && saved
      ? saved.images
      : input.imageUrls.map((url, index) => ({
          id: `preview-image-${index}`,
          url,
          isPrimary: index === 0,
        }));

  const rows = input.variantRows.filter((row) => !isBlankDraft(row));
  const variants: ProductVariant[] =
    mode === "edit" && saved
      ? saved.variants
      : rows.map((row, index) => ({
          id: row.key,
          sku: row.sku.trim(),
          attributes: parseVariantOptions(row.options),
          price: Number(row.price),
          displayPrice: pricing?.variantDisplayPrices?.[index] ?? undefined,
          stock: Number(row.stock) || 0,
          lowStockAt: 5,
        }));

  const specs: Record<string, string> = {};
  for (const row of values.specs) {
    if (row.key.trim() && row.value.trim())
      specs[row.key.trim()] = row.value.trim();
  }

  const basePrice = Number(values.price);
  const displayPrice = pricing?.displayPrice ?? basePrice;
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

  return {
    ...(saved ?? {}),
    id: saved?.id ?? "preview",
    slug: saved?.slug ?? "preview",
    name: values.name.trim() || LABELS.previewNamePlaceholder,
    description: values.description,
    basePrice,
    displayPrice,
    compareAtPrice: pricing?.compareAtPrice ?? null,
    showMrp: Boolean(pricing?.showMrp),
    discountPercent: pricing?.discountPercent ?? null,
    gstPercentage: pricing?.gstPercentage,
    brand: values.brand.trim() || null,
    tags: splitCommaList(values.tagsInput),
    highlights: values.highlights.map((item) => item.trim()).filter(Boolean),
    specs,
    deliveryNote: values.deliveryNote.trim() || null,
    returnNote: values.returnNote.trim() || null,
    warrantyMonths: numberOrNull(values.warrantyMonths),
    warrantyType: values.warrantyType || null,
    hsnCode: values.hsnCode.trim() || null,
    videoUrl: values.videoUrl || null,
    sizeChartUrl: values.sizeChartUrl || null,
    codEnabled: values.codMode === "inherit" ? null : values.codMode === "on",
    categoryId: values.categoryId,
    categoryName: category?.name ?? null,
    status: saved?.status ?? "DRAFT",
    images,
    imageUrl: images[0]?.url ?? "",
    variants,
    stock: totalStock,
    avgRating: 0,
    reviewCount: 0,
    vendor: saved?.vendor,
  } as ProductDetail;
}
