/** Copy for the tax rules page and the category tax/tree screens. */
export const taxCategoriesLabels = {
  // Tax rule form
  taxRuleCategory: "Category",
  taxRuleCategoryPlaceholder:
    "Platform default (every category without its own rule)",
  taxRuleCategoryHint:
    "Pick a category to set its own GST. Its subcategories use it too, unless they have their own. Leave empty for the platform default.",
  taxRuleDefaultScopeHint:
    "This is the platform default: it cannot be moved to a category. Add a separate rule for a category.",
  taxRuleGstSlab: "GST rate",
  taxRuleGstOther: "Other rate…",
  taxRuleGstCustom: "Custom GST %",
  taxRuleGstNonStandard:
    "This is not one of the standard GST slabs (0, 0.25, 3, 5, 12, 18, 28%). Check it before saving.",
  taxRuleHsnHint: "4, 6 or 8 digits.",
  taxRuleSectionScope: "Where it applies",
  taxRuleSectionRate: "Rate",
  taxRuleSectionBand: "Higher GST by price (optional)",
  taxRuleRateNote: "Customers pay {percent}% GST on top of the price.",
  taxRuleHsnInvalid: "HSN code must be 4, 6 or 8 digits.",
  taxRulePreview:
    "A ₹{price} item: customers pay ₹{amount} including {percent}% GST.",
  taxRuleSaved: "Tax rule saved.",
  taxRuleEditTitle: "Edit tax rule",
  taxRuleAddTitle: "Add tax rule",
  taxRuleAddBody:
    "A rule sets the GST of a category and everything below it. Without a category it is the platform default.",
  taxRuleEditBody: "Change the rate, HSN code or price band of this rule.",
  taxRuleCategoryTaken:
    "This category already has a tax rule. Edit that one, or pick another category.",
  taxRuleDefaultTaken:
    "A platform default rule already exists. Edit it, or pick a category for this rule.",
  taxRuleNoChanges: "Change something to save.",
  taxRuleSave: "Save rule",
  taxRulePlatformDefault: "Platform default",
  taxRuleAppliesTo: "Applies to",
  taxRuleAppliesToCount: "{count} categories",
  taxRuleAppliesToOne: "1 category",
  taxRuleDeleteDefaultBody:
    "This is the platform default. Deleting it changes the GST of every category without its own rule: they fall back to 18%. {count} categories are affected.",
  taxRuleDeleteCategoryBody:
    "{name} will use its parent's rate (or the platform default) instead. {count} categories are affected.",
  taxRuleDeleteDefaultBodyOne:
    "This is the platform default. Deleting it changes the GST of every category without its own rule: they fall back to 18%. 1 category is affected.",
  taxRuleDeleteCategoryBodyOne:
    "{name} will use its parent's rate (or the platform default) instead. 1 category is affected.",
  taxRuleScopeAll: "All rules",
  taxRuleScopeDefault: "Platform default",
  taxRuleScopeCategory: "Category rules",
  taxFocusTitle: "Tax for this category",
  taxFocusHeading: "Tax for {name}",
  taxFocusEditRule: "Edit its rule",
  taxFocusSetOwn: "Set its own rate",
  taxFocusNotFound: "That category was not found, so the full list is shown.",
  categoryManageTax: "Manage tax",
  // Where does a category's tax come from
  taxLookupTitle: "Where does a category's GST come from?",
  taxLookupBody: "Pick a category to see the rate it gets and why.",
  taxSourceOwn: "Its own rule",
  taxSourceInherited: "Inherited from {name}",
  taxSourceDefault: "The platform default rule",
  taxSourceFallback: "No rule applies, so the 18% fallback is used",
  // Category tree
  categoryProducts: "Products",
  categorySubcategories: "Subcategories",
  categoryGst: "GST",
  categoryGstSourceTitle: "{source}",
  categoryReorderSameParent:
    "Drag a category only among the ones under the same parent. To move it to another parent, edit it.",
  categoryMoveError: "Could not move the category.",
  categoryOrderHint:
    "Drag the handle to reorder categories under the same parent. Clear the filters first.",
  categorySearchPlaceholder: "Search categories",
  categoryNameTooLong: "Category name must be 100 characters or fewer",
  // Category dialog tax section
  categoryTaxSection: "Tax",
  categoryTaxSectionHint: "The GST customers pay on products in this category.",
  categoryTaxEffective: "Currently {percent}% GST ({source}).",
  categoryTaxManageHint: "Only people who manage tax can change this.",
  categoryTaxSetOwn: "Set its own rate",
  categoryTaxUseParent: "Use the parent's rate",
  categoryTaxSaved: "Tax saved for this category.",
  categoryTaxRemoved: "This category now uses its parent's rate.",
  categoryRegenerateSlug:
    "Also change the web address (this breaks existing links to the old one)",
  categorySlugKept: "The web address stays /{slug}.",
  // Archive / delete impact
  categoryImpactArchive:
    "{name}. Products: {products}. Subcategories: {children}. Archiving hides it from the shop.",
  categoryImpactArchiveCascade: "Active subcategories also archived: {count}.",
  categoryImpactDelete:
    "{name} will be deleted for good. Products: {products}. Subcategories: {children}. It can only be deleted when both are 0.",
  categoryImpactTaxRule:
    "Its tax rule ({percent}% GST) will be deleted with it.",
  categoryImpactDeletedProducts:
    "Deleted products still filed here: {count}. Reassign them before deleting.",
  categoryImpactSecondaryDelete:
    "Products using it as a secondary category: {count}. They lose that tag.",
  categoryImpactSecondaryArchive:
    "Products using it as a secondary category: {count}. They stop being listed under it.",
  categoryImpactLoading: "Checking what this affects…",
} as const;
