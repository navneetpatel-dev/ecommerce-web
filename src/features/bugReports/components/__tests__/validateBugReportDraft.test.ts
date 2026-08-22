import { describe, it } from "vitest";
import assert from "node:assert/strict";
import {
  validateBugReportDraft,
  type BugReportDraftValues,
} from "../validateBugReportDraft";
import {
  BUG_DESCRIPTION_MAX,
  BUG_TITLE_MAX,
} from "../../constants/fieldLimits";

function validDraft(): BugReportDraftValues {
  return {
    title: "Checkout crashes",
    description: "Steps below reproduce it reliably.",
    steps: "",
    hasUntypedAttachment: false,
  };
}

describe("validateBugReportDraft", () => {
  it("accepts a complete draft with no errors", () => {
    assert.deepEqual(validateBugReportDraft(validDraft()), {});
  });

  it("requires title and description", () => {
    const errors = validateBugReportDraft({
      ...validDraft(),
      title: "   ",
      description: "",
    });
    assert.ok(errors.title);
    assert.ok(errors.description);
  });

  it("flags over-limit fields and untyped attachments", () => {
    const errors = validateBugReportDraft({
      title: "x".repeat(BUG_TITLE_MAX + 1),
      description: "y".repeat(BUG_DESCRIPTION_MAX + 1),
      steps: "",
      hasUntypedAttachment: true,
    });
    assert.ok(errors.title);
    assert.ok(errors.description);
    assert.ok(errors.attachments);
    assert.equal(errors.steps, undefined);
  });
});
