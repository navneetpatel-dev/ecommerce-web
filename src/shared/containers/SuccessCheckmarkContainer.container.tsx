"use client";

import { useSuccessCheckmark } from "@/shared/hooks/useSuccessCheckmark.hook";
import { SuccessCheckmark } from "@/shared/components/SuccessCheckmark.component";

export function SuccessCheckmarkContainer() {
  const checkmark = useSuccessCheckmark();

  return (
    <SuccessCheckmark
      circleRef={checkmark.circleRef}
      checkRef={checkmark.checkRef}
    />
  );
}
