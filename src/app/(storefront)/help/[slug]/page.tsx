import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpArticlePage } from "@/features/help";
import { getAllArticles, getArticleBySlug } from "@/features/help";
import { JsonLd, generateArticleSchema } from "@/shared/seo";
import { canonicalUrl } from "@/shared/seo/canonical";
import { PATHS } from "@/shared/constants/paths/paths";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  // Help articles are local content, so a miss is definitive: keep it out of the
  // index. (The response itself cannot be a 404 — the root `loading.tsx` streams
  // every route, so a status is committed before `notFound()` runs.)
  if (!article) {
    return {
      title: "Help",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: canonicalUrl(`${PATHS.help}/${slug}`) },
  };
}

export default async function HelpArticleRoute({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <JsonLd
        data={generateArticleSchema({
          title: article.title,
          summary: article.summary,
          url: canonicalUrl(`${PATHS.help}/${slug}`),
        })}
      />
      <HelpArticlePage slug={slug} />
    </>
  );
}
