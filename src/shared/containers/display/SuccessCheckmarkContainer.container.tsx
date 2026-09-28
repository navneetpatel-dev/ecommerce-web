"use client";

import { useSuccessCheckmark } from "@/shared/hooks/ui/useSuccessCheckmark.hook";
import { SuccessCheckmark } from "@/shared/components/display/SuccessCheckmark.component";

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
