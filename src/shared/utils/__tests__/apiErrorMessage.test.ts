import { describe, expect, it } from "vitest";
import {
  apiErrorFromFailureBody,
  getApiErrorMessage,
  looksLikeInternalErrorMessage,
  parseApiFieldErrors,
  sanitizeUserFacingMessage,
} from "../apiErrorMessage";
import { ApiError } from "@/shared/types/apiError.types";
import { ERROR_CODES } from "@/shared/constants/errors";
import { LABELS } from "@/shared/constants/labels";

describe("looksLikeInternalErrorMessage", () => {
  it("flags stack-frame-like text", () => {
    expect(looksLikeInternalErrorMessage("at src/app/api/route.ts:10:5")).toBe(
      true,
    );
  });
  it("allows normal user-facing copy", () => {
    expect(looksLikeInternalErrorMessage("Coupon code has expired")).toBe(
      false,
    );
  });
});

describe("sanitizeUserFacingMessage", () => {
  it("uses the fallback for internal-looking messages", () => {
    expect(
      sanitizeUserFacingMessage("Error: at src/x.ts:1:1", LABELS.uploadFailed),
    ).toBe(LABELS.uploadFailed);
  });
  it("passes through safe copy", () => {
    expect(sanitizeUserFacingMessage("Expired code", "fallback")).toBe(
      "Expired code",
    );
  });
  it("uses the actionable fallback for browser network errors", () => {
    expect(sanitizeUserFacingMessage("Failed to fetch", "Try again")).toBe(
      "Try again",
    );
  });
});

describe("apiErrorFromFailureBody", () => {
  it("parses API failure envelope into ApiError with code", () => {
    const err = apiErrorFromFailureBody(
      {
        success: false,
        error: { code: "RATE_LIMITED", message: "Too many requests" },
      },
      429,
    );
    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toBe(ERROR_CODES.RATE_LIMITED);
    expect(err.message).toBe("Too many requests");
  });

  it("returns RATE_LIMITED for non-JSON 429 responses", () => {
    const err = apiErrorFromFailureBody(null, 429);
    expect(err.code).toBe(ERROR_CODES.RATE_LIMITED);
  });

  it("returns REQUEST_FAILED for unknown non-JSON errors", () => {
    const err = apiErrorFromFailureBody(null, 500);
    expect(err.code).toBe(ERROR_CODES.REQUEST_FAILED);
  });
});

describe("getApiErrorMessage", () => {
  it("returns the typed message for a known error code", () => {
    const err = new ApiError("UPLOAD_FAILED", "raw server text");
    expect(getApiErrorMessage(err, "fallback")).toBe(LABELS.uploadFailed);
  });
  it("returns the fallback for unknown errors without leaking internals", () => {
    expect(
      getApiErrorMessage(new Error("S3 bucket arn:aws:s3:::x"), "fb"),
    ).toBe("fb");
  });

  it("reads flat field maps from service validation errors", () => {
    const err = new ApiError("VALIDATION_ERROR", "Validation failed", {
      email: ["Invalid credentials"],
    });
    expect(getApiErrorMessage(err, "fallback")).toBe("Invalid credentials");
  });
});

describe("parseApiFieldErrors", () => {
  it("parses zod flatten fieldErrors", () => {
    expect(
      parseApiFieldErrors({
        fieldErrors: { email: ["Invalid email"] },
        formErrors: [],
      }),
    ).toEqual({ email: "Invalid email" });
  });

  it("parses flat service field maps", () => {
    expect(
      parseApiFieldErrors({
        currentPassword: ["Current password is incorrect"],
      }),
    ).toEqual({ currentPassword: "Current password is incorrect" });
  });
});
