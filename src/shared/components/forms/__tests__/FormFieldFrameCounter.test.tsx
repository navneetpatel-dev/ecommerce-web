import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame } from "../FormFieldFrame.component";

describe("FormFieldFrame counter", () => {
  it("shows 'used / limit' and ties it to the field for screen readers", () => {
    render(
      <FormFieldFrame label="Name" counter={{ value: "Lamp", max: 200 }}>
        <Input defaultValue="Lamp" />
      </FormFieldFrame>,
    );
    expect(screen.getByText("4 / 200")).toBeInTheDocument();
    const describedBy = screen
      .getByRole("textbox")
      .getAttribute("aria-describedby");
    expect(describedBy).toContain(
      screen.getByText("4 / 200").closest("div")!.id,
    );
  });

  it("shows nothing when no counter is asked for", () => {
    render(
      <FormFieldFrame label="Name">
        <Input />
      </FormFieldFrame>,
    );
    expect(screen.queryByText(/ \/ /)).toBeNull();
  });
});
