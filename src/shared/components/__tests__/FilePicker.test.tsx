import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilePicker, formatFileSize } from "../FilePicker.component";

describe("FilePicker", () => {
  describe("formatFileSize", () => {
    it("formats bytes, kilobytes, and megabytes properly", () => {
      expect(formatFileSize(500)).toBe("500 B");
      expect(formatFileSize(1024)).toBe("1.0 KB");
      expect(formatFileSize(1024 * 150)).toBe("150.0 KB");
      expect(formatFileSize(2 * 1024 * 1024)).toBe("2.0 MB");
    });
  });

  it("renders dropzone state when no file is selected", () => {
    render(
      <FilePicker
        label="Upload document"
        hint="Max 2 MB"
        value={null}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Upload document")).toBeInTheDocument();
    expect(screen.getByText("Click to choose file")).toBeInTheDocument();
    expect(screen.getByText("Max 2 MB")).toBeInTheDocument();
  });

  it("renders selected file card with name, size and remove button", () => {
    const mockFile = new File(["dummy content"], "test-agents.csv", {
      type: "text/csv",
    });
    const handleChange = vi.fn();

    render(<FilePicker value={mockFile} onChange={handleChange} />);

    expect(screen.getByText("test-agents.csv")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove selected file")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Remove selected file"));
    expect(handleChange).toHaveBeenCalledWith(null);
  });

  it("rejects files exceeding maxBytes limit with clear error", async () => {
    const handleChange = vi.fn();
    const handleError = vi.fn();

    // Create a 3MB mock file
    const largeFile = new File(
      [new Uint8Array(3 * 1024 * 1024)],
      "oversized.csv",
      {
        type: "text/csv",
      },
    );

    const { container } = render(
      <FilePicker
        maxBytes={2 * 1024 * 1024}
        value={null}
        onChange={handleChange}
        onError={handleError}
      />,
    );

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    Object.defineProperty(input, "files", {
      value: [largeFile],
      writable: true,
    });
    fireEvent.change(input);

    expect(
      await screen.findByText(/File size exceeds the 2.0 MB limit/i),
    ).toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalledWith(largeFile);
    expect(handleError).toHaveBeenCalled();
  });
});
