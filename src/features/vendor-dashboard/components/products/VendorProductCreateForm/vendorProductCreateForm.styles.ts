export const vendorProductCreateFormStyles = {
  form: "mb-5",
  submitError: "text-sm text-danger",

  // Details
  colSpan2: "sm:col-span-2",
  selectCategoryTriggerError: "border-danger",
  descriptionTextarea: "min-h-[6.5rem]",

  // Catalog
  listStack: "space-y-2",
  highlightRow: "flex gap-2",
  specRow: "grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]",

  // Policies & SEO
  policyTextarea: "min-h-[5.5rem]",
  seoDescriptionTextarea: "min-h-[5.5rem]",
} as const;
