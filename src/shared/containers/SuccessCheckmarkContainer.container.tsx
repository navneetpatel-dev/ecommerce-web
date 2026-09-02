"use client";

import { useSuccessCheckmark } from "@/shared/hooks/useSuccessCheckmark.hook";
import { SuccessCheckmark } from "@/shared/components/SuccessCheckmark.component";

interface SuccessCheckmarkContainerProps {
  className?: string;
}

export function SuccessCheckmarkContainer({
  className,
}: SuccessCheckmarkContainerProps) {
  const checkmark = useSuccessCheckmark();

  return (
    <SuccessCheckmark
      circleRef={checkmark.circleRef}
      checkRef={checkmark.checkRef}
      className={className}
    />
  );
}
