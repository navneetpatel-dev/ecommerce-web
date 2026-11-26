"use client";

import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";

/** Marks a product the platform team listed on the vendor's behalf. */
export function PlatformListedBadge() {
  return <Badge variant="brand">{LABELS.listedByPlatform}</Badge>;
}
