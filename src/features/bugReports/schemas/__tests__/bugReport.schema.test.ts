import { describe, expect, it } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { BugReportSchema, type BugReportInput } from "../bugReport.schema";
import { BUG_DESCRIPTION_MAX } from "../../constants/fieldLimits";

const validDraft: BugReportInput = {
  title: "Checkout button unresponsive",
  description: "Tapping Pay does nothing on the confirmation step.",
  steps: "1. Add item\n2. Tap Pay",
  attachments: [
    {
      url: "https://cdn.test/shot.png",
      type: "SCREENSHOT",
      durationSeconds: null,
    },
  ],
};

describe("BugReportSchema", () => {
  it("accepts a complete draft", () => {
    const result = BugReportSchema.safeParse(validDraft);
    expect(result.success).toBe(true);
  });

  it("trims whitespace around required text", () => {
    const result = BugReportSchema.parse({
      ...validDraft,
      title: "  Checkout button unresponsive  ",
    });
    expect(result.title).toBe("Checkout button unresponsive");
  });

  it("rejects an empty title with the centralized message", () => {
    const result = BugReportSchema.safeParse({
      ...validDraft,
      title: "   ",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(LABELS.bugTitleRequired);
    }
  });

  it("rejects a description over the field limit", () => {
    const result = BugReportSchema.safeParse({
      ...validDraft,
      description: "x".repeat(BUG_DESCRIPTION_MAX + 1),
    });
    expect(result.success).toBe(false);
  });

  it("allows empty steps (optional field)", () => {
    const result = BugReportSchema.safeParse({
      ...validDraft,
      steps: "",
    });
    expect(result.success).toBe(true);
  });

  it("flags untyped attachments on the attachments path", () => {
    const result = BugReportSchema.safeParse({
      ...validDraft,
      attachments: [
        { url: "https://cdn.test/rec.mp4", type: null, durationSeconds: 12 },
      ],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path.join(".")).toContain("attachments");
    }
  });
});
