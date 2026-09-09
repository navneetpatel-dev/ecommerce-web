"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { SEARCH_SUGGESTION_TYPE } from "../../../constants/search/index";
import type { SearchSuggestion } from "../../../types/search/index";
import { SearchSuggestionRow } from "../../suggestions/SearchSuggestionRow.component";
import { SECTION_ORDER, SEARCH_LIST_ID, panelTransition } from "../../../constants/search-bar/constants";
import { searchBarStyles as styles } from "../../../styles/search-bar/searchBar.styles";

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
        <div className={styles.skeletonStack}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.skeletonItem}>
              <div className={styles.skeletonThumb} />
              <div className={styles.skeletonTextCol}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonSubtitle} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!suggestions?.length) {
      return (
        <div className={styles.emptyContainer}>
          <span className={styles.emptyIconWrapper}>
            <Search
              className={styles.emptyIcon}
              strokeWidth={1.5}
              aria-hidden
            />
          </span>
          <p className={styles.emptyTitle}>{LABELS.searchAutocompleteEmpty}</p>
          <p className={styles.emptySubtitle}>
            {LABELS.searchAutocompleteEmptyHint}
          </p>
        </div>
      );
    }

    return (
      <div className={styles.suggestionsWrapper}>
        {grouped.map((section, sectionIndex) => (
          <div
            key={section.type}
            className={cn(sectionIndex > 0 && styles.sectionDivider)}
          >
            <p className={styles.sectionHeader}>{sectionLabel(section.type)}</p>
            <ul className={styles.sectionList}>
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
          className={styles.panelMotionWrapper}
        >
          <div
            id={SEARCH_LIST_ID}
            role="listbox"
            aria-label={LABELS.searchSuggestions}
            className={cn(
              styles.panelListbox,
              isInline ? styles.panelInline : styles.panelDropdown,
            )}
          >
            {renderBody()}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
