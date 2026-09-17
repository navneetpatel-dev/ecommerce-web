import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ImportResultsPanel } from "../ImportResultsPanel.component";

describe("ImportResultsPanel", () => {
  it("shows a row-scoped message for the failing row only", () => {
    render(
      <ImportResultsPanel
        results={[
          { row: 1, email: "ok@example.com", success: true, error: null },
          {
            row: 5,
            email: "dup@example.com",
            success: false,
            error: "Email already registered",
          },
        ]}
        onUploadAnother={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByText("Row 1: ok@example.com")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Row 5: dup@example.com")).toBeInTheDocument();
    expect(screen.getByText("This email is already in use")).toBeInTheDocument();
    expect(screen.queryByText("Email already registered")).not.toBeInTheDocument();
  });
});
