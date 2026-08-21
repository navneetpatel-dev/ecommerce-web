import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpArticlePage } from "@/features/help";
import { getAllArticles, getArticleBySlug } from "@/features/help";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Help" };
  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function HelpArticleRoute({ params }: Props) {
  const { slug } = await params;
  if (!getArticleBySlug(slug)) notFound();
  return <HelpArticlePage slug={slug} />;
}
