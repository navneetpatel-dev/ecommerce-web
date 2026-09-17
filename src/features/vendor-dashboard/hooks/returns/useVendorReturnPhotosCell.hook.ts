import { useCallback, useState } from "react";
import type { ProductImage } from "@/shared/api/types";

export function useVendorReturnPhotosCell(images: ProductImage[]) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isEmpty = images.length === 0;

  const handleOpen = useCallback(() => {
    setSelectedIndex(0);
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  return {
    open,
    selectedIndex,
    isEmpty,
    handleOpen,
    handleOpenChange,
    handleSelect,
  };
}
