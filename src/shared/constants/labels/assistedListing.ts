/** Copy for listing products on a vendor's behalf (admin) and the variants editor (admin and vendor). */
export const assistedListingLabels = {
  addProductForVendor: "Add product for a vendor",
  addProductForVendorBody:
    "Create a draft listing for an approved vendor. The vendor can edit and submit it; nothing is published until a different admin approves it.",
  listForVendor: "Vendor",
  listForVendorPlaceholder: "Choose the vendor this product belongs to",
  listForVendorRequired: "Choose the vendor this product is listed for.",
  editProductForVendor: "Edit product",
  listedByPlatform: "Listed by the platform team",
  listedByPlatformHint:
    "Our team prepared this listing for you. Review it, then submit it for approval.",
  vendorConsentNoteLabel: "Vendor agreement on record",
  priceChangeReason: "Reason for this change",
  priceChangeReasonHint:
    "Required (10 to 500 characters). It is kept in the audit trail and sent to the vendor.",
  priceChangeReasonRequired: "Give a reason of at least 10 characters.",
  pricingLockedHint:
    "Only a Super Admin can change prices, the category or tax details of a live product.",
  categoryRateImpactSummary:
    "{products} live or pending product(s) from {vendors} vendor(s) would be charged differently (GST changes on {gst}, commission on {commission}).",
  categoryRateImpactBlocked:
    "Only a Super Admin can make this change, because it changes what vendors are charged.",
  categoryCommissionLockedHint:
    "Only a Super Admin can set or change the commission rate.",
  submitOnBehalf: "Submit for review on vendor's behalf",
  submitOnBehalfTitle: "Submit {name} for review",
  submitOnBehalfBody:
    "Record how the vendor agreed to this listing. It then waits for a different admin to approve it.",
  consentNoteLabel: "How did the vendor agree?",
  consentNotePlaceholder: "e.g. Confirmed by phone on 26 Nov, ticket 4521",
  consentNoteRequired:
    "Record the vendor's agreement (at least 10 characters).",
  submitForReview: "Submit for review",
  productSubmittedOnBehalf: "Submitted for review.",
  manageVariants: "Manage variants",
  variantsTitle: "Variants of {name}",
  variantsBody:
    "Each variant has its own SKU, price and stock. A product needs at least one variant before it can be submitted.",
  variantsSection: "Variants",
  variantsSectionHint:
    "Add at least one variant (size, colour and so on) with its SKU, price and stock.",
  addVariant: "Add variant",
  newVariant: "New variant",
  variantNumber: "Variant {number}",
  variantOptionsHint:
    "Optional. Separate with semicolons, e.g. Size: M; Colour: Red.",
  removeVariant: "Remove variant",
  saveVariant: "Save variant",
  variantSku: "SKU",
  variantPrice: "Price",
  variantStock: "Stock",
  variantOptions: "Options",
  variantOptionName: "Option (e.g. Size)",
  variantOptionValue: "Value (e.g. M)",
  variantSkuRequired: "Enter a SKU.",
  variantSkuInvalid:
    "Use letters, digits and . _ / - only (up to 64 characters).",
  variantOptionsInvalid:
    "Use up to 10 options like Size: M; names up to 40 and values up to 80 characters.",
  variantStockTooHigh: "Stock cannot be more than 1,000,000.",
  variantPriceTooHigh: "Price cannot be more than ₹1,00,00,000.",
  priceTooHigh: "Price cannot be more than ₹1,00,00,000.",
  variantPriceRequired: "Enter a price of at least 1.",
  resubmitForApproval: "Resubmit for approval",
  productRejectedBecause: "Rejected: {note}",
  variantStockRequired: "Enter the stock as a whole number (0 or more).",
  stockNow: "Stock saved. It is now {count}.",
  couldNotUpdateStock: "Could not update stock.",
  variantSaved: "Variant saved.",
  lastVariantHint:
    "This listing is on sale or awaiting approval, so its only variant cannot be removed. Add another first.",
  lastImageHint:
    "This listing is on sale or awaiting approval, so its only image cannot be removed. Replace it, or add another first.",
  variantsPartialFailure:
    "The product was created, but {count} variant(s) could not be added. Add them from Manage variants.",
  noVariantsYet: "No variants yet.",
  couldNotSaveVariant: "Could not save the variant.",
  approveOwnWorkTitle: "Approve your own work?",
  approveOwnWorkBody:
    "You prepared or submitted this listing, so normally someone else approves it. As Super Admin you can approve it yourself, but the reason is recorded in the audit trail.",
  approveOwnWorkReason: "Why are you approving it yourself?",
  approveOwnWorkPlaceholder: "e.g. Sole admin; vendor confirmed by phone",
  approveOwnWorkConfirm: "Approve anyway",
  platformProductName: "Platform product",
  productPricingGroupTitle: "Pricing",
  productPricingGroupHint:
    "The selling price is before GST; GST is added at the category's rate. The MRP includes GST.",
  noProductImagesYet:
    "No images yet. Add up to 10 photos; the first one becomes the main image.",
  searchCategories: "Search categories",
  noCategoriesFound: "No categories found.",
  previewAsCustomer: "Preview",
  customerPreviewTitle: "Customer preview",
  customerPreviewBody:
    "How shoppers will see this product page. Buying is turned off.",
  customerPreviewNotLive:
    "Not visible to customers yet: this product is {status}.",
  customerPriceTitle: "How customers will see it",
  customerPriceSavings: "Customers save ₹{amount}",
  customerPriceNoMrp:
    "No MRP, so no discount is shown. Add an MRP above to show a struck-through price and a % off.",
  customerPriceHighDiscount:
    "That is a very large discount ({percent}% off). Customers may doubt it; check the MRP.",
  customerPriceSmallDiscount:
    "A discount this small ({percent}% off) is rarely noticed. A slightly higher MRP stands out more.",
  customerPriceNeedsCategory:
    "Choose a category to see the GST and what customers will pay.",
  customerPriceNeedsPrice: "Enter a selling price to see this.",
  previewNamePlaceholder: "Your product name",
  gstBadge: "{percent}% GST",
  gstBadgeBand: "{from}–{to}% GST",
  gstBadgeBandTitle: "{from}% GST up to ₹{threshold}, {to}% above",
} as const;
