import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NumberInput } from "../NumberInput.component";

function renderInput(props: Partial<Parameters<typeof NumberInput>[0]> = {}) {
  return render(
    <NumberInput
      id="qty"
      value={2}
      min={1}
      max={5}
      onChange={vi.fn()}
      {...props}
    />,
  );
}

/**
 * The field is a `type="text"` input that answers ArrowUp/ArrowDown, so it has
 * to *say* it is a spinbutton — otherwise assistive tech has no way to know the
 * arrow keys do anything, and the visual steppers are out of the tab order.
 */
describe("NumberInput spinbutton semantics", () => {
  it("announces itself as a spinbutton with its bounds", () => {
    renderInput();

    const field = screen.getByRole("spinbutton", { name: "" });
    expect(field).toHaveAttribute("aria-valuenow", "2");
    expect(field).toHaveAttribute("aria-valuemin", "1");
    expect(field).toHaveAttribute("aria-valuemax", "5");
  });

  it("steps with the arrow keys", () => {
    const onChange = vi.fn();
    renderInput({ onChange });

    const field = screen.getByRole("spinbutton");
    fireEvent.keyDown(field, { key: "ArrowUp" });

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("does not claim a value the customer never entered", () => {
    renderInput({ value: undefined });

    expect(screen.getByRole("spinbutton")).not.toHaveAttribute("aria-valuenow");
  });
});
