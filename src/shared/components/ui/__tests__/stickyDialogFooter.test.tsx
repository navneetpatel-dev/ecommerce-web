import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormActions } from "@/shared/components/forms/FormActions.component";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../dialog";

const globalsCss = readFileSync(
  path.resolve(__dirname, "../../../styles/globals.css"),
  "utf8",
);

describe("action rows stay pinned to the bottom of a dialog", () => {
  it("the dialog body is the scroll area and carries the hook the stylesheet pins footers by", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>T</DialogTitle>
          <p>body text</p>
          <DialogFooter>
            <button type="button">OK</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );
    const body = screen.getByText("body text").parentElement!;
    expect(body.className).toMatch(/\bdialog-body\b/);
    expect(body.className).toMatch(/overflow-y-auto/);
    expect(screen.getByText("OK").parentElement).toHaveClass("dialog-footer");
  });

  it("FormActions rows are recognised too, and the body gives no bottom padding to a dialog that has one", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>T</DialogTitle>
          <form>
            <FormActions>
              <button type="button">Save</button>
            </FormActions>
          </form>
        </DialogContent>
      </Dialog>,
    );
    const row = screen.getByText("Save").closest("[data-form-actions]");
    expect(row).not.toBeNull();
    const body = screen.getByText("Save").closest(".dialog-body")!;
    expect(body.className).not.toMatch(/\bpb-/);
  });

  it("the stylesheet pins both kinds of row inside a dialog body and restores bottom padding when there is none", () => {
    expect(globalsCss).toMatch(
      /\.dialog-body :is\(\.dialog-footer, \[data-form-actions\]\)\s*\{[^}]*position:\s*sticky;[^}]*bottom:\s*0/,
    );
    expect(globalsCss).toMatch(
      /\.dialog-body:not\(:has\(:is\(\.dialog-footer, \[data-form-actions\]\)\)\)\s*\{[^}]*padding-bottom/,
    );
  });
});
