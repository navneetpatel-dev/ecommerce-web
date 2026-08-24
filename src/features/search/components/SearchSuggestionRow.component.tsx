"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, LayoutGrid, Package, Store } from "lucide-react";
import { formatInr } from "@/shared/utils/orderFormat";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { cn } from "@/shared/utils/cn";
import { SEARCH_SUGGESTION_TYPE } from "../constants";
import type { SearchSuggestion } from "../types";

interface SearchSuggestionRowProps {
  suggestion: SearchSuggestion;
  active?: boolean;
  id?: string;
  onSelect: (suggestion: SearchSuggestion) => void;
}

function suggestionTypeLabel(type: SearchSuggestion["type"]): string {
  switch (type) {
    case SEARCH_SUGGESTION_TYPE.VENDOR:
      return LABELS.searchSuggestionTypeVendor;
    case SEARCH_SUGGESTION_TYPE.CATEGORY:
      return LABELS.searchSuggestionTypeCategory;
    case SEARCH_SUGGESTION_TYPE.PRODUCT:
    default:
      return LABELS.searchSuggestionTypeProduct;
  }
}

function suggestionMeta(suggestion: SearchSuggestion): string | null {
  if (suggestion.type === SEARCH_SUGGESTION_TYPE.PRODUCT) {
    if (suggestion.sku) {
      return formatLabel(LABELS.searchSuggestionSku, { sku: suggestion.sku });
    }
    if (suggestion.basePrice != null) {
      return formatInr(suggestion.basePrice);
    }
  }
  return null;
}

function TypeIcon({ type }: { type: SearchSuggestion["type"] }) {
  const Icon =
    type === SEARCH_SUGGESTION_TYPE.VENDOR
      ? Store
      : type === SEARCH_SUGGESTION_TYPE.CATEGORY
        ? LayoutGrid
        : Package;

  return <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />;
}

function SuggestionThumb({
  src,
  name,
  type,
}: {
  src?: string;
  name: string;
  type: SearchSuggestion["type"];
}) {
  const [unavailable, setUnavailable] = useState(!src);

  if (!unavailable && src) {
    return (
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-paper">
        <Image
          src={src}
          alt=""
          width={44}
          height={44}
          className="h-full w-full object-cover transition-transform duration-300 group-hover/row:scale-[1.04]"
          onError={() => setUnavailable(true)}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line",
        "bg-brand-subtle text-brand transition-colors duration-200",
        "group-hover/row:border-brand/25 group-hover/row:bg-brand group-hover/row:text-paper",
      )}
    >
      {name.trim() ? (
        <span className="font-display text-body leading-none tracking-tight">
          {name.trim().slice(0, 1).toUpperCase()}
        </span>
      ) : (
        <TypeIcon type={type} />
      )}
    </span>
  );
}

export function SearchSuggestionRow({
  suggestion,
  active = false,
  id,
  onSelect,
}: SearchSuggestionRowProps) {
  const meta = suggestionMeta(suggestion);
  const typeLabel = suggestionTypeLabel(suggestion.type);

  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      id={id}
      className={cn(
        "group/row flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150",
        "outline-none focus-visible:bg-brand-subtle/70",
        active ? "bg-brand-subtle/80" : "hover:bg-paper",
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        onSelect(suggestion);
      }}
    >
      <SuggestionThumb
        src={suggestion.imageUrl}
        name={suggestion.name}
        type={suggestion.type}
      />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "truncate text-body font-medium leading-snug text-ink transition-colors",
              "group-hover/row:text-brand",
              active && "text-brand",
            )}
          >
            {suggestion.name}
          </span>
        </span>
        <span className="mt-0.5 flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5",
              "text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-ink-muted",
            )}
          >
            <TypeIcon type={suggestion.type} />
            {typeLabel}
          </span>
          {meta ? (
            <span className="truncate text-body-sm text-ink-muted">{meta}</span>
          ) : null}
        </span>
      </span>

      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent text-ink-faint transition-all duration-200",
          "group-hover/row:border-line group-hover/row:bg-surface group-hover/row:text-brand",
          active && "border-line bg-surface text-brand",
        )}
        aria-hidden
      >
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
      </span>
      <span className="sr-only">{LABELS.searchOpenResult}</span>
    </button>
  );
}
