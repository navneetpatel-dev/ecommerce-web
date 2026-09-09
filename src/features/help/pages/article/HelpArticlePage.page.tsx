"use client";

import { HelpArticleView } from "../../components/article/HelpArticleView.component";

export function HelpArticlePage({ slug }: { slug: string }) {
  return <HelpArticleView slug={slug} />;
}
