'use client'

import { useState } from 'react'

export function useImageGalleryTransition(selectedIndex: number, onSelect: (index: number) => void) {
  const [prevIndex, setPrevIndex] = useState(selectedIndex)
  const [transitioning, setTransitioning] = useState(false)

  const selectImage = (index: number) => {
    if (index === selectedIndex) return
    setPrevIndex(selectedIndex)
    setTransitioning(true)
    onSelect(index)
    window.setTimeout(() => setTransitioning(false), 200)
  }

  return {
    prevIndex,
    transitioning,
    selectImage,
  }
}
