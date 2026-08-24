"use client";

import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/utils/cn";

interface DisabledActionHintProps {
  disabled: boolean;
  message: string;
  children: ReactNode;
  className?: string;
  /** Use block layout so disabled menu triggers stay full width inside kebab popovers. */
  block?: boolean;
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Disabled controls don't receive pointer events, so wrap them to show a hover/focus hint.
 */
export function DisabledActionHint({
  disabled,
  message,
  children,
  className,
  block = false,
  side = "top",
}: DisabledActionHintProps) {
  if (!disabled || !message) {
    if (!className && !block) return <>{children}</>;
    return (
      <span className={cn(block && "block w-full", className)}>{children}</span>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              block ? "block w-full" : "inline-flex max-w-full",
              "cursor-not-allowed",
              className,
            )}
            tabIndex={0}
            aria-disabled="true"
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="max-w-[260px] text-center leading-snug"
        >
          {message}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
