import { describe, expect, it } from "vitest";
import { ApiError } from "@/shared/types/apiError.types";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "../applyApiFormErrors";

describe("getFormLevelApiError", () => {
  it("returns null when field errors exist on the API error", () => {
    const err = new ApiError("VALIDATION_ERROR", "Validation failed", {
      fieldErrors: { email: ["Invalid email"] },
      formErrors: [],
    });
    expect(getFormLevelApiError(err, "fallback")).toBeNull();
  });

  it("returns a sanitized message when no field errors exist", () => {
    const err = new ApiError("FORBIDDEN", "You do not have permission");
    expect(getFormLevelApiError(err, "fallback")).toBe(
      "You do not have permission",
    );
  });
});

describe("applyApiErrorsToManualForm", () => {
  it("maps API field keys through an optional field map", () => {
    const err = new ApiError("VALIDATION_ERROR", "Validation failed", {
      fieldErrors: { couponCode: ["Expired"] },
      formErrors: [],
    });
    const next: Record<string, string> = {};
    const mapped = applyApiErrorsToManualForm(
      err,
      (errors) => Object.assign(next, errors),
      { couponCode: "code" },
    );
    expect(mapped).toBe(true);
    expect(next).toEqual({ code: "Expired" });
  });

  it("returns false for non-ApiError values", () => {
    const next: Record<string, string> = {};
    expect(
      applyApiErrorsToManualForm(new Error("nope"), (e) =>
        Object.assign(next, e),
      ),
    ).toBe(false);
    expect(next).toEqual({});
  });
});
