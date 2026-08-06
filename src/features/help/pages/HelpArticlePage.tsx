'use client'

import { HelpArticleView } from '../components/HelpArticleView'

export function HelpArticlePage({ slug }: { slug: string }) {
  return <HelpArticleView slug={slug} />
}
