"use client";

import { HelpArticleView } from "../components/HelpArticleView.component";

export function HelpArticlePage({ slug }: { slug: string }) {
  return <HelpArticleView slug={slug} />;
}
