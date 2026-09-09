import { useCallback, useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { productsApi } from "@/features/products";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { ProductImage, ProductVariant } from "@/shared/api/types";

const ALL_VARIANTS_VALUE = "__all__";

interface UseVendorProductImagesInput {
  productId: string;
  open: boolean;
  onChanged?: () => void;
}

/** Manage a product's image list: load, add, replace, delete, set primary. */
export function useVendorProductImages({
  productId,
  open,
  onChanged,
}: UseVendorProductImagesInput) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantId, setVariantId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const product = await productsApi.detail(productId);
      setImages(product.images ?? []);
      setVariants(product.variants ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadProduct));
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  const runImageAction = async (
    busyKey: string,
    action: () => Promise<void>,
  ) => {
    setBusyId(busyKey);
    try {
      await action();
      await load();
      onChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages));
    } finally {
      setBusyId(null);
    }
  };

  const onAddImage = (url: string) =>
    void runImageAction("new", async () => {
      await productsApi.addImage(productId, {
        url,
        isPrimary: images.length === 0,
        variantId: variantId || null,
      });
    });

  const onReplaceImage = (imageId: string, url: string) =>
    void runImageAction(imageId, async () => {
      await productsApi.replaceImage(imageId, { url });
    });

  const onDeleteImage = (imageId: string) =>
    void runImageAction(imageId, async () => {
      await productsApi.deleteImage(imageId);
    });

  const onSetPrimary = (imageId: string) =>
    void runImageAction(imageId, async () => {
      await productsApi.setPrimaryImage(imageId);
    });

  const handleVariantFilter = (value: string) => {
    setVariantId(value === ALL_VARIANTS_VALUE ? "" : value);
  };

  return {
    images,
    variants,
    variantId,
    loading,
    error,
    busyId,
    onAddImage,
    onReplaceImage,
    onDeleteImage,
    onSetPrimary,
    handleVariantFilter,
  };
}

export { ALL_VARIANTS_VALUE };
