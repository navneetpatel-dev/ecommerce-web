import { describe, expect, it } from "vitest";
import { inputStyles } from "../input.styles";
import { textareaStyles } from "../textarea.styles";
import { numberInputStyles } from "../../forms/numberInput.styles";
import { otpInputStyles } from "../../forms/otpInput.styles";

/** 16px on phones; iOS Safari zooms the page for any focused field under it. */
const SIXTEEN_PX_THEN_SMALLER =
  /text-\[1rem\]\s+sm:text-(body|body-sm|body-xs)(\s|$)/;

/**
 * Text fields only: a Radix `Select` trigger is a button and a custom
 * dropdown is not zoomed by iOS, so those keep the smaller body size. The
 * native `<select>` in the admin role dialog is covered by that feature's own
 * test, since `shared/` may not import from `features/` (Rule 15).
 */
const textFields = [
  ["Input", inputStyles.base],
  ["Textarea", textareaStyles.base],
  ["NumberInput", numberInputStyles.input],
  ["OtpInput", otpInputStyles.input],
] as const;

describe("text field font sizes", () => {
  it.each(textFields)(
    "%s renders at 16px on phones so iOS does not zoom on focus",
    (_name, className) => {
      expect(className).toMatch(SIXTEEN_PX_THEN_SMALLER);
    },
  );

  it.each(textFields)(
    "%s never uses the bare 15px body token as its only size",
    (_name, className) => {
      expect(className).not.toMatch(/(^|\s)text-(body|body-sm|body-xs)(\s|$)/);
    },
  );
});
