export interface HighlightSegment {
  text: string;
  match: boolean;
}

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Splits text around every case-insensitive occurrence of the typed term (B-15). */
export function highlightMatch(text: string, term: string): HighlightSegment[] {
  const needle = term.trim();
  if (!needle) return [{ text, match: false }];
  const parts = text.split(new RegExp(`(${escapeRegExp(needle)})`, "gi"));
  return parts
    .filter((part) => part !== "")
    .map((part) => ({
      text: part,
      match: part.toLowerCase() === needle.toLowerCase(),
    }));
}
