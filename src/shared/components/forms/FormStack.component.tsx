import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface FormStackProps {
  children: ReactNode;
  className?: string;
}

/** Vertical rhythm for multi-section dialog/page forms. */
export function FormStack({ children, className }: FormStackProps) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}
