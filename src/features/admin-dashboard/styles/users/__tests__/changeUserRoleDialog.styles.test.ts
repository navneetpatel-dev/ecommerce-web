import { describe, expect, it } from "vitest";
import { changeUserRoleDialogStyles } from "../changeUserRoleDialog.styles";

/**
 * The role picker is a native `<select>`, so iOS zooms the page on focus when
 * it renders under 16px — the same trap the shared text fields avoid.
 */
describe("changeUserRoleDialog field sizes", () => {
  it("renders the native selects at 16px on phones", () => {
    expect(changeUserRoleDialogStyles.selectInput).toMatch(
      /text-\[1rem\]\s+sm:text-body-sm(\s|$)/,
    );
  });
});
