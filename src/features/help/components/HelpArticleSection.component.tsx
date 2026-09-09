import type { HelpArticle } from "../types/help.types";

interface HelpArticleSectionProps {
  section: HelpArticle["sections"][number];
}

/** One heading + paragraphs + optional bullet list within an article body. */
export function HelpArticleSection({ section }: HelpArticleSectionProps) {
  const paragraphElements = section.paragraphs?.map((p) => (
    <p
      key={p.slice(0, 48)}
      className="mt-3 text-body leading-relaxed text-ink-muted"
    >
      {p}
    </p>
  ));
  const hasBullets = Boolean(section.bullets?.length);
  const bulletElements = section.bullets?.map((b) => (
    <li key={b.slice(0, 48)}>{b}</li>
  ));
  const bulletList = hasBullets ? (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-body leading-relaxed text-ink-muted">
      {bulletElements}
    </ul>
  ) : null;

  return (
    <section>
      <h2 className="text-body-lg font-semibold tracking-tight text-ink">
        {section.heading}
      </h2>
      {paragraphElements}
      {bulletList}
    </section>
  );
}
