import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecordDetailListView } from "../RecordDetailListView.component";

describe("RecordDetailListView", () => {
  it("renders categoryIds as copyable monospace rows", () => {
    const id = "03b75f36-b53b-4169-a812-69194e8c83c7";
    render(<RecordDetailListView fieldKey="categoryIds" items={[id]} />);

    expect(screen.getByText(id)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: `Copy ${id}` }),
    ).toBeInTheDocument();
  });

  it("groups permissionKeys by resource with action badges and copy-all", () => {
    render(
      <RecordDetailListView
        fieldKey="permissionKeys"
        items={["product.manage", "product.approve", "analytics.view"]}
      />,
    );

    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "manage" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "approve" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "view" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy all Permission Keys" }),
    ).toBeInTheDocument();
  });
});
