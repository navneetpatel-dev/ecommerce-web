import { cn } from "@/shared/utils/cn";
import { successCheckmarkStyles } from "./displayComponents.styles";

interface SuccessCheckmarkProps {
  circleRef: React.RefObject<SVGCircleElement | null>;
  checkRef: React.RefObject<SVGPathElement | null>;
  className?: string;
}

export function SuccessCheckmark({
  circleRef,
  checkRef,
  className,
}: SuccessCheckmarkProps) {
  return (
    <div className={cn(successCheckmarkStyles.container, className)}>
      <svg viewBox="0 0 52 52" className={successCheckmarkStyles.svg}>
        <circle
          ref={circleRef}
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="var(--success)"
          strokeWidth="2.5"
          strokeDasharray="157"
          strokeDashoffset="157"
          style={{
            animationDuration: "0.5s",
            animationFillMode: "forwards",
            animationTimingFunction: "ease-out",
          }}
        />
        <path
          ref={checkRef}
          d="M14 27l7 7 16-16"
          fill="none"
          stroke="var(--success)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="48"
          strokeDashoffset="48"
          style={{
            animationDuration: "0.3s",
            animationDelay: "0.25s",
            animationFillMode: "forwards",
            animationTimingFunction: "ease-out",
          }}
        />
      </svg>
    </div>
  );
}
