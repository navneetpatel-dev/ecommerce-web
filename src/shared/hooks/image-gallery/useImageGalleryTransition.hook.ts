"use client";

import { useState } from "react";
import { GALLERY_TRANSITION_MS } from "@/shared/constants/timing/timing";

export function useImageGalleryTransition(
  selectedIndex: number,
  onSelect: (index: number) => void,
) {
  const [prevIndex, setPrevIndex] = useState(selectedIndex);
  const [transitioning, setTransitioning] = useState(false);

  const selectImage = (index: number) => {
    if (index === selectedIndex) return;
    setPrevIndex(selectedIndex);
    setTransitioning(true);
    onSelect(index);
    window.setTimeout(() => setTransitioning(false), GALLERY_TRANSITION_MS);
  };

  return {
    prevIndex,
    transitioning,
    selectImage,
  };
}
