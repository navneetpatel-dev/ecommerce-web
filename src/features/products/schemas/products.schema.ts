/**
 * Public schema surface for the products feature. Value types live in
 * `../types/productListingForm.types.ts` (Rule 10); form rules and the write
 * mapping live beside this barrel with `.schema.ts` suffixes (Rule 9).
 */
export * from "../types/productListingForm.types";
export * from "./listingFormSchema/index";
export * from "./productWriteMapping.schema";
