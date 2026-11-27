import { describe, expect, it } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { taxRuleDeleteBody } from "../taxRuleDeleteBody";

describe("taxRuleDeleteBody", () => {
  it("words one affected category in the singular", () => {
    const body = taxRuleDeleteBody({ isDefault: false, appliesToCount: 1 });

    expect(body).toBe(LABELS.taxRuleDeleteCategoryBodyOne);
    expect(body).toContain("1 category is affected");
  });

  it("keeps the counted wording for several", () => {
    expect(taxRuleDeleteBody({ isDefault: false, appliesToCount: 3 })).toBe(
      LABELS.taxRuleDeleteCategoryBody,
    );
  });

  it("explains the platform default", () => {
    expect(taxRuleDeleteBody({ isDefault: true, appliesToCount: 1 })).toBe(
      LABELS.taxRuleDeleteDefaultBodyOne,
    );
    expect(taxRuleDeleteBody({ isDefault: true, appliesToCount: 0 })).toBe(
      LABELS.taxRuleDeleteDefaultBody,
    );
  });
});
