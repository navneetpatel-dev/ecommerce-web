import { describe, expect, it } from "vitest";
import { phoneField } from "../phone.schema";
import { LABELS } from "@/shared/constants/labels";

function parse(value: unknown) {
  return phoneField.safeParse(value);
}

describe("phoneField", () => {
  it("accepts an Indian mobile however it was typed", () => {
    for (const value of ["9876543210", "+91 98765 43210", "09876543210"]) {
      const parsed = parse(value);

      expect(parsed.success).toBe(true);
      if (parsed.success) expect(parsed.data).toBe(value.trim());
    }
  });

  it("keeps a blank or omitted field valid", () => {
    expect(parse("")?.data).toBe("");
    expect(parse("   ")?.data).toBe("");
    expect(parse(undefined)?.success).toBe(true);
  });

  it("rejects a value that is not a phone number", () => {
    const parsed = parse("call me");

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(LABELS.invalidPhone);
    }
  });
});
