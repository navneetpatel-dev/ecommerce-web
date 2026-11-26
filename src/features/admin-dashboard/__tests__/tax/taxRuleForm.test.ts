import { describe, expect, it } from "vitest";
import {
  emptyTaxRuleValues,
  gstPercentOf,
  isNonStandardRate,
  toTaxRuleBody,
  validateTaxRule,
  valuesFromRule,
  GST_OTHER,
} from "../../utils/tax/taxRuleForm";

const messages = { gst: "gst", hsn: "hsn", band: "band" };
const rule = (over: Record<string, unknown> = {}) =>
  ({
    id: "r",
    categoryId: null,
    categoryName: null,
    isDefault: true,
    hsnCode: null,
    gstPercentage: 18,
    priceBandThreshold: null,
    gstPercentageAbove: null,
    appliesToCount: 0,
    createdAt: "",
    ...over,
  }) as never;

describe("tax rule form", () => {
  it("a standard slab selects it; any other rate opens Other with the value", () => {
    expect(valuesFromRule(rule({ gstPercentage: 12 })).gstChoice).toBe("12");
    const other = valuesFromRule(rule({ gstPercentage: 14.5 }));
    expect([other.gstChoice, other.gstCustom]).toEqual([GST_OTHER, "14.5"]);
  });

  it("warns on a non-standard rate but does not block it", () => {
    const values = {
      ...emptyTaxRuleValues(),
      gstChoice: GST_OTHER,
      gstCustom: "14.5",
    };
    expect(isNonStandardRate(values)).toBe(true);
    expect(validateTaxRule(values, messages)).toEqual({});
    expect(isNonStandardRate(emptyTaxRuleValues())).toBe(false);
  });

  it("rejects a missing or out-of-range rate, bad HSN and a half-filled band", () => {
    const base = emptyTaxRuleValues();
    expect(
      validateTaxRule({ ...base, gstChoice: GST_OTHER }, messages).gst,
    ).toBe("gst");
    expect(
      validateTaxRule(
        { ...base, gstChoice: GST_OTHER, gstCustom: "101" },
        messages,
      ).gst,
    ).toBe("gst");
    expect(
      validateTaxRule(
        { ...base, gstChoice: GST_OTHER, gstCustom: "1.234" },
        messages,
      ).gst,
    ).toBe("gst");
    expect(validateTaxRule({ ...base, hsnCode: "12345" }, messages).hsn).toBe(
      "hsn",
    );
    expect(
      validateTaxRule({ ...base, hsnCode: "123456" }, messages).hsn,
    ).toBeUndefined();
    expect(
      validateTaxRule({ ...base, priceBandThreshold: "500" }, messages).band,
    ).toBe("band");
  });

  it("builds the request: empty category is the platform default, band only when complete", () => {
    const body = toTaxRuleBody({ ...emptyTaxRuleValues(), hsnCode: " 1234 " });
    expect(body).toEqual({
      categoryId: null,
      gstPercentage: 18,
      hsnCode: "1234",
      priceBandThreshold: null,
      gstPercentageAbove: null,
    });
    expect(
      gstPercentOf({ ...emptyTaxRuleValues(), gstChoice: GST_OTHER }),
    ).toBeNull();
  });
});
