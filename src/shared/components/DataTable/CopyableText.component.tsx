"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";

export interface CopyableTextProps {
  /** The value copied to clipboard. */
  value: string;
  /** Optional custom display element if different from value (e.g. bolded ID, link). */
  children?: ReactNode;
  /** Optional custom label for screen readers. */
  ariaLabel?: string;
  /** Optional additional CSS classes. */
  className?: string;
  /** Optional callback fired when copied. */
  onCopy?: (value: string) => void;
}

/**
 * Renders an identifier (order #, tracking code, SKU, ticket ID) with an
 * instant 1-click copy button and feedback indicator.
 * Automatically stops event propagation so parent row clicks are not triggered.
 */
export function CopyableText({
  value,
  children,
  ariaLabel,
  className,
  onCopy,
}: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (
        typeof window !== "undefined" &&
        window.navigator?.clipboard?.writeText
      ) {
        await window.navigator.clipboard.writeText(value);
      } else if (
        typeof navigator !== "undefined" &&
        navigator?.clipboard?.writeText
      ) {
        await navigator.clipboard.writeText(value);
      }
      onCopy?.(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback copy
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        onCopy?.(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <span
      className={cn("group/copy inline-flex items-center gap-1.5", className)}
    >
      <span className="font-mono text-ink select-all">{children ?? value}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={
          copied ? "Copied to clipboard" : (ariaLabel ?? `Copy ${value}`)
        }
        title={copied ? "Copied!" : "Copy to clipboard"}
        className={cn(
          "inline-flex size-5 items-center justify-center rounded p-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
          copied
            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
            : "text-ink-muted/50 hover:text-ink hover:bg-surface-raised opacity-0 group-hover/copy:opacity-100 focus-visible:opacity-100",
        )}
      >
        {copied ? (
          <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
        ) : (
          <Copy className="size-3.5" strokeWidth={2} aria-hidden />
        )}
      </button>
    </span>
  );
}
