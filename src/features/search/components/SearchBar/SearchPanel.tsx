"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { SEARCH_SUGGESTION_TYPE } from "../../constants";
import type { SearchSuggestion } from "../../types";
import { SearchSuggestionRow } from "../SearchSuggestionRow";
import { SECTION_ORDER, SEARCH_LIST_ID, panelTransition } from "./constants";

interface SearchPanelProps {
  showPanel: boolean;
  suggestions?: SearchSuggestion[];
  activeIndex?: number;
  isFetching?: boolean;
  isInline: boolean;
  onSelect: (suggestion: SearchSuggestion) => void;
  onExitComplete: () => void;
}

function sectionLabel(type: SearchSuggestion["type"]): string {
  switch (type) {
    case SEARCH_SUGGESTION_TYPE.VENDOR:
      return LABELS.searchSuggestionVendors;
    case SEARCH_SUGGESTION_TYPE.CATEGORY:
      return LABELS.searchSuggestionCategories;
    case SEARCH_SUGGESTION_TYPE.PRODUCT:
    default:
      return LABELS.searchSuggestionProducts;
  }
}

export function SearchPanel({
  showPanel,
  suggestions,
  activeIndex = -1,
  isFetching = false,
  isInline,
  onSelect,
  onExitComplete,
}: SearchPanelProps) {
  const grouped = useMemo(() => {
    const items = suggestions ?? [];
    return SECTION_ORDER.map((type) => ({
      type,
      items: items
        .map((suggestion, index) => ({ suggestion, index }))
        .filter(({ suggestion }) => suggestion.type === type),
    })).filter((section) => section.items.length > 0);
  }, [suggestions]);

  const renderBody = () => {
    if (isFetching && !suggestions?.length) {
      return (
        <div className="space-y-2 p-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg px-1 py-1"
            >
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-line/60" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-2/3 animate-pulse rounded bg-line/60" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-line/50" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!suggestions?.length) {
      return (
        <div className="flex flex-col items-center px-5 py-8 text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink-faint">
            <Search className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </span>
          <p className="text-[0.9375rem] font-medium text-ink">
            {LABELS.searchAutocompleteEmpty}
          </p>
          <p className="mt-1 max-w-xs text-[0.8125rem] leading-relaxed text-ink-muted">
            {LABELS.searchAutocompleteEmptyHint}
          </p>
        </div>
      );
    }

    return (
      <div className="py-1.5">
        {grouped.map((section, sectionIndex) => (
          <div
            key={section.type}
            className={cn(
              sectionIndex > 0 && "mt-1 border-t border-line/70 pt-1",
            )}
          >
            <p className="px-4 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              {sectionLabel(section.type)}
            </p>
            <ul className="px-1.5">
              {section.items.map(({ suggestion, index }) => (
                <li key={`${suggestion.type}-${suggestion.id}`}>
                  <SearchSuggestionRow
                    suggestion={suggestion}
                    active={index === activeIndex}
                    id={`${SEARCH_LIST_ID}-option-${index}`}
                    onSelect={onSelect}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence initial={false} onExitComplete={onExitComplete}>
      {showPanel ? (
        <motion.div
          key="search-panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={panelTransition}
          className="overflow-hidden"
        >
          <div
            id={SEARCH_LIST_ID}
            role="listbox"
            aria-label={LABELS.searchSuggestions}
            className={cn(
              "border-t border-line",
              isInline
                ? "max-h-[min(24rem,calc(85vh-12rem))] overflow-auto"
                : "max-h-80 overflow-auto",
            )}
          >
            {renderBody()}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
