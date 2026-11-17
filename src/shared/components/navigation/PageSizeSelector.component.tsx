"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/utils/dom/cn";

export interface PageSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (newPageSize: number) => void;
  options?: number[];
  className?: string;
}

const DEFAULT_OPTIONS = [10, 25, 50, 100];

export function PageSizeSelector({
  pageSize,
  onPageSizeChange,
  options = DEFAULT_OPTIONS,
  className,
}: PageSizeSelectorProps) {
  const currentOptions = options.includes(pageSize)
    ? options
    : [...options, pageSize].sort((a, b) => a - b);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-caption text-ink-muted",
        className,
      )}
    >
      <span className="whitespace-nowrap">Rows per page:</span>
      <Select
        value={String(pageSize)}
        onValueChange={(val) => onPageSizeChange(Number(val))}
      >
        <SelectTrigger
          className="h-8 w-[4.5rem] px-2 text-caption bg-surface border-line"
          aria-label="Select rows per page"
        >
          <SelectValue placeholder={String(pageSize)} />
        </SelectTrigger>
        <SelectContent align="end" side="top" className="min-w-[4.5rem]">
          {currentOptions.map((opt) => (
            <SelectItem key={opt} value={String(opt)} className="text-caption">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
