import { describe, expect, it } from "vitest";
import {
  isBlankPhoneNumber,
  isValidPhoneNumber,
  normalisePhoneNumber,
} from "../phoneNumber";

describe("normalisePhoneNumber", () => {
  it("drops spaces, dashes, parentheses and the country code", () => {
    expect(normalisePhoneNumber("+91 98765 43210")).toBe("9876543210");
    expect(normalisePhoneNumber("(98765) 43210")).toBe("9876543210");
    expect(normalisePhoneNumber("098765-43210")).toBe("9876543210");
  });

  it("leaves an international number's own digits intact", () => {
    expect(normalisePhoneNumber("+1 415 555 1234")).toBe("14155551234");
  });
});

describe("isValidPhoneNumber", () => {
  it("accepts Indian mobiles however they were typed", () => {
    for (const value of [
      "9876543210",
      "+91 98765 43210",
      "09876543210",
      " 6376 778 899 ",
    ]) {
      expect(isValidPhoneNumber(value)).toBe(true);
    }
  });

  it("accepts international and landline numbers, so no account is locked out", () => {
    expect(isValidPhoneNumber("+1 415 555 1234")).toBe(true);
    expect(isValidPhoneNumber("08023456789")).toBe(true);
  });

  it("rejects junk the API should never be asked to store", () => {
    for (const value of [
      "123",
      "call me",
      "abc9876543210",
      "1234567890123456",
    ]) {
      expect(isValidPhoneNumber(value)).toBe(false);
    }
  });

  it("treats whitespace as blank, not invalid", () => {
    expect(isBlankPhoneNumber("   ")).toBe(true);
  });
});
