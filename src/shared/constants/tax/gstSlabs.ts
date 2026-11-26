/** The GST slabs in use (percent). Keep in sync with backend `core/constants/tax.ts`. */
export const GST_SLABS = [0, 0.25, 3, 5, 12, 18, 28] as const;

/** A tax rule's HSN code: 4, 6 or 8 digits (the lengths GST invoices use). */
export const HSN_CODE_PATTERN = /^(\d{4}|\d{6}|\d{8})$/;

export const isStandardGstSlab = (percent: number): boolean =>
  (GST_SLABS as readonly number[]).includes(percent);
