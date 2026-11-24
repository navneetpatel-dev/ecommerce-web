"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";

interface RecordDetailCopyButtonProps {
  value: string;
  className?: string;
  label?: string;
}

export function RecordDetailCopyButton({
  value,
  className,
  label = "Copy to clipboard",
}: RecordDetailCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    try {
      void navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback or ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={copied ? "Copied!" : label}
      className={cn(
        "inline-flex items-center justify-center size-5 rounded hover:bg-surface-raised text-ink-muted hover:text-ink transition-colors shrink-0",
        copied && "text-emerald-600 dark:text-emerald-400",
        className,
      )}
    >
      {copied ? (
        <Check className="size-3" strokeWidth={2.5} />
      ) : (
        <Copy className="size-3" strokeWidth={2} />
      )}
    </button>
  );
}
