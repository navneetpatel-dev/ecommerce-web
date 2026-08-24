"use client";

import { useScrollToTop } from "@/shared/hooks/useScrollToTop.hook";
import { ScrollToTop } from "@/shared/components/ScrollToTop.component";

export function ScrollToTopContainer() {
  const scroll = useScrollToTop();

  return (
    <ScrollToTop visible={scroll.visible} onScrollToTop={scroll.scrollToTop} />
  );
}
