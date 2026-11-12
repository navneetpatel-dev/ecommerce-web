import { highlightMatch } from "../../utils/highlight/highlightMatch";
import { searchSuggestionRowStyles as styles } from "../../styles/suggestions/searchSuggestionRow.styles";

/** The suggestion name with the typed letters marked (B-15). */
export function HighlightedText({
  text,
  term,
}: {
  text: string;
  term: string;
}) {
  return (
    <>
      {highlightMatch(text, term).map((segment, index) =>
        segment.match ? (
          <mark key={index} className={styles.match}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
