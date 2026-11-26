/** Copy for the shared SEO fields (product and category forms). */
export const seoLabels = {
  seoSectionTitle: "Search listing",
  seoSectionHint:
    "Optional title and description for search engines. Leave blank to use the name and description.",
  seoTitleLabel: "SEO title",
  seoDescriptionLabel: "SEO description",
  seoTitleHint:
    "Recommended up to 60 characters; search engines cut longer titles.",
  seoDescriptionHint:
    "Recommended 120 to 160 characters. Say what makes this worth clicking.",
  seoDescriptionPlaceholder: "Leave blank to use the description.",
  seoPreviewCaption: "How this could look in search results",
  seoPreviewUrl: "yourstore.com › your-page",
  seoPreviewTitleEmpty: "Your title appears here",
  seoPreviewDescriptionEmpty:
    "Your description appears here. Add one above to see it.",
  seoPreviewFallbackNote: "Empty fields use the name and description.",
  seoTitleTooLong: "SEO title must be {max} characters or fewer.",
  seoDescriptionTooLong: "SEO description must be {max} characters or fewer.",
} as const;
