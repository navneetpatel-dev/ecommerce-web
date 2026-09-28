import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormFieldFrame } from "../FormFieldFrame.component";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";

describe("FormFieldFrame control wiring", () => {
  it("associates the label, error and hint with the control", () => {
    render(
      <FormFieldFrame
        label="Email"
        error="Enter a valid email address"
        hint="We never share it"
      >
        <Input type="email" />
      </FormFieldFrame>,
    );

    const input = screen.getByLabelText("Email");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("aria-invalid", "true");

    // aria-describedby must point at nodes that actually exist, error first.
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    const ids = describedBy.split(" ").filter(Boolean);
    expect(ids).toHaveLength(2);
    for (const id of ids) {
      expect(document.getElementById(id)).not.toBeNull();
    }
    expect(screen.getByRole("alert")).toHaveAttribute("id", ids[0]);
  });

  it("omits aria-invalid and the error description when there is no error", () => {
    render(
      <FormFieldFrame label="Name">
        <Input />
      </FormFieldFrame>,
    );

    const input = screen.getByLabelText("Name");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("honours an explicit control id and still adds the description", () => {
    render(
      <FormFieldFrame
        label="Zone"
        htmlFor="shipping-zone-name"
        hint="Up to 40 chars"
      >
        <Input id="shipping-zone-name" />
      </FormFieldFrame>,
    );

    const input = screen.getByLabelText("Zone");
    expect(input).toHaveAttribute("id", "shipping-zone-name");
    expect(document.getElementById("shipping-zone-name-hint")).not.toBeNull();
  });

  it("wires textareas the same way", () => {
    render(
      <FormFieldFrame label="Reason" hint="Be specific">
        <Textarea />
      </FormFieldFrame>,
    );

    const textarea = screen.getByLabelText("Reason");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(
      document.getElementById(
        textarea.getAttribute("aria-describedby") as string,
      ),
    ).not.toBeNull();
  });

  it("keeps an explicit aria-describedby alongside the frame's ids", () => {
    render(
      <FormFieldFrame label="Coupon" hint="Optional">
        <Input aria-describedby="external-help" />
      </FormFieldFrame>,
    );

    const describedBy = screen
      .getByLabelText("Coupon")
      .getAttribute("aria-describedby");
    expect(describedBy?.startsWith("external-help")).toBe(true);
    expect(describedBy?.split(" ")).toHaveLength(2);
  });
});
