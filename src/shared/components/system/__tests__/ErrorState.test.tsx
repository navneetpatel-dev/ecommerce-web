import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LABELS } from "@/shared/constants/labels";
import { ErrorState } from "../ErrorState.component";

describe("ErrorState", () => {
  it("renders the heading at the requested level with the message", () => {
    render(
      <ErrorState
        headingLevel="h1"
        heading="We couldn't load this product"
        message="Please try again."
      />,
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "We couldn't load this product",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Please try again.")).toBeInTheDocument();
    expect(screen.getByText(LABELS.errorStateEyebrow)).toBeInTheDocument();
  });

  it("offers retry and home actions when onRetry is given", () => {
    const onRetry = vi.fn();
    render(<ErrorState heading="Oops" message="Failed" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button", { name: LABELS.retry }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: LABELS.backToHome }),
    ).toBeInTheDocument();
  });

  it("renders a custom action and the not-found eyebrow without onRetry", () => {
    render(
      <ErrorState
        variant="notFound"
        heading="Gone"
        message="Missing"
        action={<button type="button">Home</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: LABELS.retry })).toBeNull();
    expect(screen.getByText(LABELS.notFoundStateEyebrow)).toBeInTheDocument();
  });

  it("shows the error reference for support when a digest exists", () => {
    render(<ErrorState heading="Oops" message="Failed" reference="abc123" />);
    expect(screen.getByText("abc123")).toBeInTheDocument();
  });
});
