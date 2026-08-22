import type { Metadata } from "next";
import { BlogDetailPage } from "@/features/content";
import { getBlogPost } from "@/features/content";
import { SEO_PAGE_COPY, SITE } from "@/shared/seo/constants";
import { canonicalUrl } from "@/shared/seo/canonical";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Entity-derived metadata for blog articles (Rule 27). */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return {
      title: `${SEO_PAGE_COPY.blog.title} | ${SITE.name}`,
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalUrl(`/blog/${slug}`) },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl(`/blog/${slug}`),
      type: "article",
      siteName: SITE.name,
    },
  };
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  return <BlogDetailPage slug={slug} />;
}
