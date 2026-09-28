import Link from "next/link";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { searchDidYouMeanStyles } from "../../styles/did-you-mean/searchDidYouMean.styles";

interface SearchDidYouMeanProps {
  /** The term the shopper searched that returned nothing. */
  term: string;
  /** Target derived by the caller from `suggestionHref`. */
  href: string;
}

/** Zero-result suggestion line shown above the listing empty state. */
export function SearchDidYouMean({ term, href }: SearchDidYouMeanProps) {
  return (
    <p className={searchDidYouMeanStyles.row}>
      <span>{formatLabel(LABELS.searchDidYouMean, { term })}</span>
      <Link href={href} className={searchDidYouMeanStyles.link}>
        {LABELS.searchDidYouMeanAction}
      </Link>
    </p>
  );
}
