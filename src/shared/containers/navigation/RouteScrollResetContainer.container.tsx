"use client";

import { Suspense } from "react";
import { RouteScrollReset } from "@/shared/components/RouteScrollReset.component";

export function RouteScrollResetContainer() {
  return (
    <Suspense fallback={null}>
      <RouteScrollReset />
    </Suspense>
  );
}
