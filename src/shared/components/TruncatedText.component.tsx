"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { TABLE_CELL_MAX_CHARS } from "@/shared/constants/table";
import { cn } from "@/shared/utils/cn";
import { truncateText } from "@/shared/utils/truncateText";

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
      <span className={cn("block min-w-0 truncate", className)}>{text}</span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn("block min-w-0 max-w-full truncate", className)}>
          {text}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs whitespace-pre-wrap break-words text-left font-normal normal-case tracking-normal"
      >
        {full}
      </TooltipContent>
    </Tooltip>
  );
}
