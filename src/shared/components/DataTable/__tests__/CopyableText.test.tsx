import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { CopyableText } from "../CopyableText.component";

describe("CopyableText", () => {
  const writeTextMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    writeTextMock.mockClear();
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText: writeTextMock,
      },
    });
  });

  it("renders the text value", () => {
    render(<CopyableText value="ORD-1002" />);
    expect(screen.getByText("ORD-1002")).toBeInTheDocument();
  });

  it("copies value to clipboard and shows copied feedback on click", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<CopyableText value="ORD-1002" onCopy={onCopy} />);

    const copyBtn = screen.getByRole("button", { name: /copy ord-1002/i });
    expect(copyBtn).toBeInTheDocument();

    await user.click(copyBtn);

    expect(onCopy).toHaveBeenCalledWith("ORD-1002");
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("stops event propagation on click", async () => {
    const user = userEvent.setup();
    const parentClick = vi.fn();

    render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={parentClick}>
        <CopyableText value="SKU-999" />
      </div>,
    );

    const copyBtn = screen.getByRole("button", { name: /copy sku-999/i });
    await user.click(copyBtn);

    expect(parentClick).not.toHaveBeenCalled();
  });
});
