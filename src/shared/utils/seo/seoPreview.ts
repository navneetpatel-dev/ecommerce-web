/** About how much of a search result Google shows before cutting it with "…". */
export const SEO_TITLE_RECOMMENDED = 60;
export const SEO_DESCRIPTION_RECOMMENDED = 160;

function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

/**
 * What a search result for this product would show: the SEO title, else the product name; the SEO
 * description, else the product description. Cut where search engines cut.
 */
export function seoPreviewText(values: {
  seoTitle: string;
  seoDescription: string;
  name: string;
  description: string;
}): { title: string; description: string; usesFallback: boolean } {
  const title = values.seoTitle.trim() || values.name.trim();
  const description = values.seoDescription.trim() || values.description.trim();
  return {
    title: clip(title, SEO_TITLE_RECOMMENDED),
    description: clip(description, SEO_DESCRIPTION_RECOMMENDED),
    usesFallback: !values.seoTitle.trim() || !values.seoDescription.trim(),
  };
}
