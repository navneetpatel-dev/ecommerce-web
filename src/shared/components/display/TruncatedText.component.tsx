"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { TABLE_CELL_MAX_CHARS } from "@/shared/constants/table/table";
import { cn } from "@/shared/utils/dom/cn";
import { truncateText } from "@/shared/utils/formatting/truncateText";
import { truncatedTextStyles } from "../../styles/display/displayComponents.styles";

interface TruncatedTextProps {
  children: string | number;
  maxChars?: number;
  className?: string;
}

/** Show limited characters in-cell; full value on hover when truncated. */
export function TruncatedText({
  children,
  maxChars = TABLE_CELL_MAX_CHARS,
  className,
}: TruncatedTextProps) {
  const { text, truncated, full } = truncateText(String(children), maxChars);

  if (!truncated) {
    return (
      <span className={cn(truncatedTextStyles.span, className)}>{text}</span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn(truncatedTextStyles.tooltipSpan, className)}>
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className={truncatedTextStyles.tooltipContent}>
        {full}
      </TooltipContent>
    </Tooltip>
  );
}
