/** Indian delivery pincode — keep in sync with backend `core/constants/pincode.ts`. */
export const PINCODE_LENGTH = 6;
/** Six digits, first 1–8 (same rule as the API): 000000 and 999999 are not real PINs. */
export const PINCODE_PATTERN = /^[1-8]\d{5}$/;
