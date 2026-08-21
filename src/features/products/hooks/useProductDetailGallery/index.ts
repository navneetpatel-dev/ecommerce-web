"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clampCartQuantity } from "@/shared/constants/cart";

export function useProductDetailGallery(
  resolvedVariantId: string | null,
  maxQuantity: number,
) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [galleryVariantId, setGalleryVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addSectionRef = useRef<HTMLDivElement>(null);

  if (galleryVariantId !== resolvedVariantId) {
    setGalleryVariantId(resolvedVariantId);
    setSelectedImage(0);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!addSectionRef.current) return;
      const rect = addSectionRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (quantity > maxQuantity) {
    setQuantity(maxQuantity);
  }

  const handleQuantityChange = useCallback(
    (qty: number) => {
      setQuantity(Math.min(maxQuantity, clampCartQuantity(qty)));
    },
    [maxQuantity],
  );

  return {
    selectedImage,
    setSelectedImage,
    quantity,
    handleQuantityChange,
    showStickyBar,
    addSectionRef,
  };
}
