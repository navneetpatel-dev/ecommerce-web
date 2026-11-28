"use client";

import { useEffect, useState } from "react";

/** The table filling the screen, left with the Escape key. */
export function useTableFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fullscreen escape key listener
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);
  return { isFullscreen, toggleFullscreen };
}
