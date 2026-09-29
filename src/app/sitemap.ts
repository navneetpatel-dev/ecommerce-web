import type { MetadataRoute } from "next";
import { SITE, PUBLIC_SITEMAP_ROUTES } from "@/shared/seo/constants";
import { getCategoryPaths, getLiveVendorSlugs } from "@/shared/seo/sitemapData";
import { getLiveProductSlugs } from "@/shared/seo/data";
import { PATHS } from "@/shared/constants/paths/paths";
import { blogPosts } from "@/features/content";
import { getAllArticles } from "@/features/help";

/**
 * Sitemap generated from the centralized route list (Rule 27) plus live
 * dynamic slugs — products from the catalog, categories as full nesting paths,
 * vendor storefronts, help articles and blog posts. No hand-maintained URL
 * copies that can drift. Every fetch degrades to an empty list rather than
 * failing the build (see `fetchApi` in shared/seo/data.ts).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categoryPaths, vendorSlugs] = await Promise.all([
    getLiveProductSlugs(),
    getCategoryPaths(),
    getLiveVendorSlugs(),
  ]);

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

  for (const pathSlugs of categoryPaths) {
    entries.push({
      url: `${SITE.url}${PATHS.category(...pathSlugs)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const slug of vendorSlugs) {
    entries.push({
      url: `${SITE.url}${PATHS.vendorPage(slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  // Help articles are prerendered static pages carrying Article structured
  // data; without a sitemap entry nothing points crawlers at them.
  for (const article of getAllArticles()) {
    entries.push({
      url: `${SITE.url}${PATHS.help}/${article.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
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
