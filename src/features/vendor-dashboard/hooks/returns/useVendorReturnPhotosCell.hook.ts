import { useCallback, useState } from "react";
import type { ProductImage } from "@/shared/api/types";
import { returnsApi } from "@/features/returns";

export function useVendorReturnPhotosCell(
  images: ProductImage[] = [],
  returnId?: string,
  photoCount = 0,
) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<ProductImage[]>(images);
  const [loading, setLoading] = useState(false);

  const totalCount = images.length > 0 ? images.length : photoCount;
  const isEmpty = totalCount === 0;

  const handleOpen = useCallback(() => {
    setSelectedIndex(0);
    setOpen(true);
    if (loadedImages.length === 0 && returnId && photoCount > 0) {
      setLoading(true);
      returnsApi
        .get(returnId)
        .then((detail) => {
          const fetched = (detail.photoUrls ?? []).map((url, idx) => ({
            id: `${returnId}-photo-${idx}`,
            url,
            isPrimary: idx === 0,
          }));
          setLoadedImages(fetched);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [loadedImages.length, returnId, photoCount]);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const activeImages = loadedImages.length > 0 ? loadedImages : images;

  return {
    open,
    selectedIndex,
    isEmpty,
    loading,
    images: activeImages,
    handleOpen,
    handleOpenChange,
    handleSelect,
  };
}
