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
import { searchSuggestionRowStyles as styles } from "./searchSuggestionRow.styles";

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

  return <Icon className={styles.typeIcon} strokeWidth={1.5} aria-hidden />;
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
      <span className={styles.thumbImageWrapper}>
        <Image
          src={src}
          alt=""
          width={44}
          height={44}
          className={styles.thumbImage}
          onError={() => setUnavailable(true)}
        />
      </span>
    );
  }

  return (
    <span aria-hidden className={styles.fallbackThumb}>
      {name.trim() ? (
        <span className={styles.fallbackInitial}>
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
        styles.rowButton,
        active ? styles.rowActive : styles.rowInactive,
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

      <span className={styles.contentCol}>
        <span className={styles.nameRow}>
          <span className={cn(styles.nameText, active && styles.nameActive)}>
            {suggestion.name}
          </span>
        </span>
        <span className={styles.metaRow}>
          <span className={styles.typeBadge}>
            <TypeIcon type={suggestion.type} />
            {typeLabel}
          </span>
          {meta ? <span className={styles.metaText}>{meta}</span> : null}
        </span>
      </span>

      <span
        className={cn(styles.arrowButton, active && styles.arrowActive)}
        aria-hidden
      >
        <ArrowUpRight className={styles.arrowIcon} strokeWidth={1.75} />
      </span>
      <span className={styles.srOnly}>{LABELS.searchOpenResult}</span>
    </button>
  );
}
