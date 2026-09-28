/**
 * Phone numbers, normalised for storage and availability.
 *
 * Rule: 10 digits starting 6–9 (an Indian mobile) or 8–15 digits (a landline or
 * an international number). Deliberately lenient — rejecting anything else would
 * lock existing accounts out of editing their profile — but it still rejects
 * junk like "123" or "call me", which the API was previously asked to store.
 *
 * Autofill, copy-paste and dictation all deliver the country code, spaces,
 * dashes and parentheses, so input is cleaned before it is checked.
 */

/** Digits only: country code and trunk zero removed. */
export const INDIAN_MOBILE_LENGTH = 10;
export const PHONE_MAX_DIGITS = 15;

const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const ANY_PHONE = /^\d{8,15}$/;
/** Only characters a phone number is ever typed with. */
const PHONE_CHARACTERS = /^[\d\s()+.-]+$/;

export function normalisePhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  const withoutCountryCode =
    digits.startsWith("91") && digits.length > INDIAN_MOBILE_LENGTH
      ? digits.slice(2)
      : digits;
  return withoutCountryCode.replace(/^0+/, "");
}

export function isValidPhoneNumber(value: string): boolean {
  const raw = value.trim();
  // "call me on 9876543210" must not normalise into a valid number.
  if (!PHONE_CHARACTERS.test(raw)) return false;

  const digits = normalisePhoneNumber(raw);
  return INDIAN_MOBILE.test(digits) || ANY_PHONE.test(digits);
}

export function isBlankPhoneNumber(value: string): boolean {
  return value.trim() === "";
}
