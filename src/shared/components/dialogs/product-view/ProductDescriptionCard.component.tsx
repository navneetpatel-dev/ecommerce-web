"use client";

import { CheckCircle2, Tag, Sparkles, ExternalLink } from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";

interface ProductDescriptionCardProps {
  product: Record<string, unknown>;
}

export function ProductDescriptionCard({
  product,
}: ProductDescriptionCardProps) {
  const description =
    typeof product.description === "string" && product.description.trim()
      ? product.description.trim()
      : null;

  const highlights = Array.isArray(product.highlights)
    ? (product.highlights.filter(
        (h) => typeof h === "string" && h.trim(),
      ) as string[])
    : [];

  const tags = Array.isArray(product.tags)
    ? (product.tags.filter(
        (t) => typeof t === "string" && t.trim(),
      ) as string[])
    : [];

  if (!description && highlights.length === 0 && tags.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-line/60 text-ink font-semibold text-body-sm">
        <Sparkles className="size-4 text-brand" aria-hidden />
        <span>Product Story & Highlights</span>
      </div>

      {description && (
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Description
          </h4>
          <p className="whitespace-pre-line text-body-sm leading-relaxed text-ink/85 break-words">
            {description}
          </p>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-line/40">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Key Highlights
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-xs text-ink">
            {highlights.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-paper/60 p-2.5 rounded-xl border border-line/50"
              >
                <CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-line/40">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Tags & Keywords
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, idx) => (
              <a
                key={idx}
                href={`${PATHS.products}?search=${encodeURIComponent(tag)}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Find all products tagged "${tag}" in new tab`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface text-[11px] font-medium text-ink-muted border border-line hover:border-brand hover:text-brand hover:bg-brand-subtle transition-all"
              >
                <Tag className="size-3 text-ink-muted/70" />
                <span>{tag}</span>
                <ExternalLink className="size-2.5 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
