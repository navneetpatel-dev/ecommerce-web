import { useCallback, useMemo, useState } from "react";
import type { ProductImage } from "@/shared/api/types";

export function useProofOfDeliveryThumbnail(url: string | null | undefined) {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasProof = Boolean(url);

  const images = useMemo<ProductImage[]>(
    () =>
      url
        ? [{ id: "proof-of-delivery", url, isPrimary: true }]
        : [],
    [url],
  );

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
    hasProof,
    images,
    handleOpen,
    handleOpenChange,
    handleSelect,
  };
}
