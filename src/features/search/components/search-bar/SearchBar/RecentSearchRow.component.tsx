"use client";

import { useCallback } from "react";
import { History } from "lucide-react";
import { searchBarStyles as styles } from "../../../styles/search-bar/searchBar.styles";

interface RecentSearchRowProps {
  term: string;
  onSelect: (term: string) => void;
}

export function RecentSearchRow({ term, onSelect }: RecentSearchRowProps) {
  const handleClick = useCallback(() => {
    onSelect(term);
  }, [onSelect, term]);

  return (
    <li>
      <button type="button" className={styles.recentItem} onClick={handleClick}>
        <History size={14} className={styles.recentIcon} />
        <span className={styles.recentLabel}>{term}</span>
      </button>
    </li>
  );
}
