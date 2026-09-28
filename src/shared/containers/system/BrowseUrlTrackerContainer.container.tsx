"use client";

import { Suspense } from "react";
import { BrowseUrlTracker } from "@/shared/components/system/BrowseUrlTracker.component";

export function BrowseUrlTrackerContainer() {
  return (
    <Suspense fallback={null}>
      <BrowseUrlTracker />
    </Suspense>
  );
}
