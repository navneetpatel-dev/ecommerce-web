import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TableExportDropdown } from "../TableExportDropdown.component";
import type { DataTableColumn } from "@/shared/types/data-table/types";

type Product = { id: string; name: string; price: string };

const columns: DataTableColumn<Product>[] = [
  { id: "name", header: "Product", accessor: "name" },
  { id: "price", header: "Price", accessor: "price" },
];

const rows: Product[] = [
  { id: "1", name: "Laptop", price: "$999" },
  { id: "2", name: "Mouse", price: "$29" },
];

describe("TableExportDropdown", () => {
  it("renders export button and shows format options when clicked", async () => {
    const user = userEvent.setup();

    render(<TableExportDropdown columns={columns} rows={rows} />);

    const exportBtn = screen.getByRole("button", { name: "Export table data" });
    expect(exportBtn).toBeInTheDocument();

    await user.click(exportBtn);

    expect(screen.getByText("CSV (.csv)")).toBeInTheDocument();
    expect(screen.getByText("Excel Compatible (.csv)")).toBeInTheDocument();
    expect(screen.getByText("JSON (.json)")).toBeInTheDocument();
    expect(screen.getByText("TSV for Sheets (.tsv)")).toBeInTheDocument();
  });

  it("calls custom onExport with selected rows when selection is active", async () => {
    const user = userEvent.setup();
    const handleExport = vi.fn();

    render(
      <TableExportDropdown
        columns={columns}
        rows={rows}
        selectedIds={["1"]}
        onExport={handleExport}
      />,
    );

    const exportBtn = screen.getByRole("button", { name: "Export table data" });
    await user.click(exportBtn);

    const csvOption = screen.getByText("CSV (.csv)");
    await user.click(csvOption);

    expect(handleExport).toHaveBeenCalledWith("csv", [rows[0]]);
  });
});
