"use client";

import { Suspense } from "react";
import { RouteScrollReset } from "@/shared/components/navigation/RouteScrollReset.component";

export function RouteScrollResetContainer() {
  return (
    <Suspense fallback={null}>
      <RouteScrollReset />
    </Suspense>
  );
}
