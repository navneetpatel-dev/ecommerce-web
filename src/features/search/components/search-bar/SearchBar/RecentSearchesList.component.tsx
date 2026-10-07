import { LABELS } from "@/shared/constants/labels";
import { RecentSearchRow } from "./RecentSearchRow.component";
import { searchBarStyles as styles } from "../../../styles/search-bar/searchBar.styles";

interface RecentSearchesListProps {
  recentSearches: readonly string[];
  onSelectRecent: (term: string) => void;
  onClearRecent: () => void;
}

/** Remembered search terms with a clear action — one row per term. */
export function RecentSearchesList({
  recentSearches,
  onSelectRecent,
  onClearRecent,
}: RecentSearchesListProps) {
  return (
    <div className={styles.suggestionsWrapper}>
      <div>
        <div className={styles.recentHeader}>
          <p className={styles.sectionHeader}>{LABELS.recentSearches}</p>
          <button
            type="button"
            className={styles.recentClear}
            onClick={onClearRecent}
          >
            {LABELS.clearRecentSearches}
          </button>
        </div>
        <ul className={styles.sectionList}>
          {recentSearches.map((term) => (
            <RecentSearchRow key={term} term={term} onSelect={onSelectRecent} />
          ))}
        </ul>
      </div>
    </div>
  );
}
