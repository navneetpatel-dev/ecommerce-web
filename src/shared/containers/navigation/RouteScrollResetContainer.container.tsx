"use client";

import { Suspense } from "react";
import { RouteScrollReset } from "@/shared/components/navigation/RouteScrollReset.component";
import { AuthReturnScroll } from "@/shared/components/navigation/AuthReturnScroll.component";

export function RouteScrollResetContainer() {
  return (
    <Suspense fallback={null}>
      <RouteScrollReset />
      <AuthReturnScroll />
    </Suspense>
  );
}
