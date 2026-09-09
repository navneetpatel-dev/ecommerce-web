import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import type { HelpArticle } from "../types/help.types";

interface HelpRelatedArticlesProps {
  related: HelpArticle[];
}

/** "Related articles" list shown at the end of an article body. */
export function HelpRelatedArticles({ related }: HelpRelatedArticlesProps) {
  const relatedItemElements = related.map((item) => (
    <li key={item.slug}>
      <Link
        href={`${PATHS.help}/${item.slug}`}
        className="flex items-center justify-between gap-3 py-3 text-[0.875rem] font-medium text-ink hover:text-brand"
      >
        {item.title}
        <ChevronRight size={14} className="text-ink-muted" />
      </Link>
    </li>
  ));

  return (
    <aside className="mt-12 max-w-2xl border border-line bg-surface-raised p-5 shadow-elevation-1">
      <TextEyebrow>{LABELS.helpRelatedEyebrow}</TextEyebrow>
      <ul className="mt-3 divide-y divide-line">{relatedItemElements}</ul>
    </aside>
  );
}
