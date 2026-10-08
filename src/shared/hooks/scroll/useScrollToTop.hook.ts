"use client";

import { useEffect, useState } from "react";
import { motionSafeScrollBehavior } from "@/shared/utils/a11y/scrollMotion";

export function useScrollToTop(thresholdMultiplier = 1.5) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * thresholdMultiplier);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [thresholdMultiplier]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: motionSafeScrollBehavior() });
  };

  return { visible, scrollToTop };
}
