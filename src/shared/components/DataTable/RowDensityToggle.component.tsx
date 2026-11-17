"use client";

import { AlignJustify, Rows3 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";

export type TableDensity = "comfortable" | "compact";

export interface RowDensityToggleProps {
  density: TableDensity;
  onChange: (density: TableDensity) => void;
  className?: string;
}

export function RowDensityToggle({
  density,
  onChange,
  className,
}: RowDensityToggleProps) {
  const isCompact = density === "compact";

  const handleToggle = () => {
    onChange(isCompact ? "comfortable" : "compact");
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={handleToggle}
      className={cn("h-9 gap-1.5 text-body-sm font-medium", className)}
      aria-label={`Row density: ${density}. Click to switch to ${isCompact ? "comfortable" : "compact"}`}
      title={`Row density: ${density} (click to toggle)`}
    >
      {isCompact ? (
        <AlignJustify className="size-4 text-ink-muted" aria-hidden />
      ) : (
        <Rows3 className="size-4 text-ink-muted" aria-hidden />
      )}
      <span className="capitalize">{density}</span>
    </Button>
  );
}
