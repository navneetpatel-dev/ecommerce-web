import type { MetadataRoute } from "next";
import { SITE, PUBLIC_SITEMAP_ROUTES } from "@/shared/seo/constants";
import { getLiveProductSlugs } from "@/shared/seo/data";
import { blogPosts } from "@/features/content";

/**
 * Sitemap generated from the centralized route list (Rule 27) plus live
 * dynamic slugs — products from the catalog, articles from the blog content
 * module. No hand-maintained URL copies that can drift.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getLiveProductSlugs();

  const entries: MetadataRoute.Sitemap = PUBLIC_SITEMAP_ROUTES.map((route) => ({
    url: `${SITE.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  for (const slug of products) {
    entries.push({
      url: `${SITE.url}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  for (const post of blogPosts) {
    entries.push({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    });
  }

  entries.push({
    url: `${SITE.url}/orders/tracking`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.3,
  });

  return entries;
}
