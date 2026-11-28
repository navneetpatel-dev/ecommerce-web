import { describe, expect, it } from "vitest";
import type { TaxRuleRow } from "../../../api/tax/tax.api";
import { emptyTaxRuleValues, valuesFromRule } from "../taxRuleForm";
import { proposedTaxRuleChange } from "../taxRuleChange";

const rule: TaxRuleRow = {
  id: "r1",
  categoryId: "c1",
  categoryName: "Mugs",
  isDefault: false,
  hsnCode: null,
  gstPercentage: 5,
  priceBandThreshold: null,
  gstPercentageAbove: null,
  appliesToCount: 1,
  createdAt: "2026-01-01",
};

describe("previewing what a tax change takes off sale", () => {
  it("asks about nothing until the form is complete and different", () => {
    expect(
      proposedTaxRuleChange(null, { ...emptyTaxRuleValues(), hsnCode: "x" }),
    ).toBeNull();
    expect(proposedTaxRuleChange(rule, valuesFromRule(rule))).toBeNull();
  });

  it("describes an edit of the rule being edited", () => {
    const change = proposedTaxRuleChange(rule, {
      ...valuesFromRule({ ...rule, gstPercentage: 28 }),
    });
    expect(change).toMatchObject({
      action: "update",
      ruleId: "r1",
      rule: { gstPercentage: 28 },
    });
  });
});
