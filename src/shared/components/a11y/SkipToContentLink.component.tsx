import { LABELS } from "@/shared/constants/labels";
import { MAIN_CONTENT_ID } from "@/shared/constants/a11y/landmarks";
import { skipToContentLinkStyles } from "@/shared/styles/a11y/skipLink.styles";

/**
 * First focusable element on every page: keyboard users land here on Tab and
 * can jump straight past the header, mega menu and mobile nav to the page body
 * (WCAG 2.4.1 Bypass Blocks). Hidden until focused — see the styles.
 */
export function SkipToContentLink() {
  return (
    <a href={`#${MAIN_CONTENT_ID}`} className={skipToContentLinkStyles.link}>
      {LABELS.skipToContent}
    </a>
  );
}
