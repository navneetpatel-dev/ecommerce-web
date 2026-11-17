import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "../DataTable.component";
import type { DataTableColumn } from "@/shared/types/data-table/types";

type Item = { id: string; name: string; sku: string; price: string };

const columns: DataTableColumn<Item>[] = [
  { id: "name", header: "Product Name", accessor: "name" },
  { id: "sku", header: "SKU Code", accessor: "sku" },
  { id: "price", header: "Price", accessor: "price" },
];

const rows: Item[] = [
  { id: "1", name: "Keyboard", sku: "KB-01", price: "$50" },
  { id: "2", name: "Mouse", sku: "MS-02", price: "$25" },
];

describe("DataTable enhanced features", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Column visibility", () => {
    it("renders column visibility dropdown when enableColumnVisibility is true", async () => {
      const user = userEvent.setup();

      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          enableColumnVisibility
        />,
      );

      const colBtn = screen.getByRole("button", {
        name: "Toggle visible columns",
      });
      expect(colBtn).toBeInTheDocument();

      await user.click(colBtn);

      // Popover should open with list of columns
      expect(screen.getByText("Display Columns")).toBeInTheDocument();
      const popover = screen.getByRole("dialog");
      expect(within(popover).getByText("SKU Code")).toBeInTheDocument();
      expect(within(popover).getByText("Price")).toBeInTheDocument();
    });

    it("hides a column when unchecked in dropdown", async () => {
      const user = userEvent.setup();

      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          enableColumnVisibility
        />,
      );

      expect(
        screen.getByRole("columnheader", { name: "SKU Code" }),
      ).toBeInTheDocument();

      const colBtn = screen.getByRole("button", {
        name: "Toggle visible columns",
      });
      await user.click(colBtn);

      // Click SKU Code checkbox in popover
      const popover = screen.getByRole("dialog");
      const skuCheckbox = within(popover).getByRole("checkbox", {
        name: "Toggle column SKU Code",
      });
      await user.click(skuCheckbox);

      // SKU Code column header should now be hidden
      expect(
        screen.queryByRole("columnheader", { name: "SKU Code" }),
      ).not.toBeInTheDocument();
      // Product Name should still be visible
      expect(
        screen.getByRole("columnheader", { name: "Product Name" }),
      ).toBeInTheDocument();
    });
  });

  describe("Row density toggle", () => {
    it("toggles between comfortable and compact density", async () => {
      const user = userEvent.setup();
      const onDensityChange = vi.fn();

      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          enableDensityToggle
          onDensityChange={onDensityChange}
        />,
      );

      const densityBtn = screen.getByRole("button", {
        name: /Row density: comfortable/i,
      });
      expect(densityBtn).toBeInTheDocument();

      await user.click(densityBtn);
      expect(onDensityChange).toHaveBeenCalledWith("compact");
    });
  });

  describe("Row selection and FloatingBulkActionBar", () => {
    it("allows selecting individual rows and selecting all rows", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          selectable
          onSelectionChange={onSelectionChange}
          bulkActions={(selected, clear) => (
            <button type="button" onClick={clear}>
              Bulk Export ({selected.length})
            </button>
          )}
        />,
      );

      // Select row 1
      const row1Checkbox = screen.getByLabelText("Select row 1");
      await user.click(row1Checkbox);
      expect(onSelectionChange).toHaveBeenCalledWith(["1"]);

      // Select all
      const selectAllCheckbox = screen.getByLabelText("Select all rows");
      await user.click(selectAllCheckbox);
      expect(onSelectionChange).toHaveBeenCalledWith(["1", "2"]);
    });

    it("renders FloatingBulkActionBar when rows are selected and allows clear", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          selectable
          selectedIds={["1", "2"]}
          onSelectionChange={onSelectionChange}
          bulkActions={(selected, clear) => (
            <button type="button" onClick={clear}>
              Bulk Export ({selected.length})
            </button>
          )}
        />,
      );

      expect(
        screen.getByRole("region", { name: "Bulk actions" }),
      ).toBeInTheDocument();
      expect(screen.getByText("Bulk Export (2)")).toBeInTheDocument();

      const clearBtn = screen.getByRole("button", { name: "Clear selection" });
      await user.click(clearBtn);
      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });
  });

  describe("Keyboard navigation", () => {
    it("navigates rows with j/k keys and selects with x key", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      const onRowClick = vi.fn();

      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          selectable
          onSelectionChange={onSelectionChange}
          onRowClick={onRowClick}
        />,
      );

      // Press 'j' to focus first row
      await user.keyboard("j");
      const tableRows = screen.getAllByRole("row");
      // Row 0 is header, Row 1 is first data row
      expect(tableRows[1]).toHaveAttribute("data-focused", "true");

      // Press 'x' to toggle selection on focused row
      await user.keyboard("x");
      expect(onSelectionChange).toHaveBeenCalledWith(["1"]);

      // Press 'j' to move to second row
      await user.keyboard("j");
      expect(tableRows[2]).toHaveAttribute("data-focused", "true");

      // Press 'Enter' to activate row
      await user.keyboard("{Enter}");
      expect(onRowClick).toHaveBeenCalledWith(rows[1], 1);
    });
  });

  describe("Table export dropdown", () => {
    it("renders export dropdown when enableExport is true", () => {
      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          enableExport
        />,
      );

      expect(
        screen.getByRole("button", { name: "Export table data" }),
      ).toBeInTheDocument();
    });
  });

  describe("Pagination page size", () => {
    it("renders page size selector when provided in pagination", () => {
      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          pagination={{
            page: 1,
            totalPages: 5,
            onPageChange: vi.fn(),
            pageSize: 25,
            onPageSizeChange: vi.fn(),
          }}
        />,
      );

      expect(screen.getByText("Rows per page:")).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: "Select rows per page" }),
      ).toBeInTheDocument();
    });
  });

  describe("Column multi-sort", () => {
    it("sorts rows when clicking a column header", async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();

      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          enableSorting
          onSortChange={onSortChange}
        />,
      );

      const nameCol = screen.getByRole("columnheader", {
        name: /Product Name/i,
      });
      expect(nameCol).toHaveAttribute("aria-sort", "none");

      // First click: asc
      await user.click(nameCol);
      expect(onSortChange).toHaveBeenCalledWith([
        { columnId: "name", direction: "asc" },
      ]);
      expect(nameCol).toHaveAttribute("aria-sort", "ascending");

      // Second click: desc
      await user.click(nameCol);
      expect(onSortChange).toHaveBeenCalledWith([
        { columnId: "name", direction: "desc" },
      ]);
      expect(nameCol).toHaveAttribute("aria-sort", "descending");
    });
  });

  describe("Fullscreen zen mode", () => {
    it("toggles fullscreen on button click and exits on Escape", async () => {
      const user = userEvent.setup();

      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          enableFullscreen
        />,
      );

      const fullscreenBtn = screen.getByRole("button", {
        name: /Enter fullscreen/i,
      });
      expect(fullscreenBtn).toBeInTheDocument();

      await user.click(fullscreenBtn);

      // Now in fullscreen mode
      expect(
        screen.getByRole("button", { name: /Exit fullscreen/i }),
      ).toBeInTheDocument();

      // Press Escape to exit
      await user.keyboard("{Escape}");
      expect(
        screen.getByRole("button", { name: /Enter fullscreen/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Column reordering", () => {
    it("reorders columns when clicking Move Down", async () => {
      const user = userEvent.setup();

      render(
        <DataTable
          title="Products"
          columns={columns}
          rows={rows}
          enableColumnVisibility
        />,
      );

      const colBtn = screen.getByRole("button", {
        name: "Toggle visible columns",
      });
      await user.click(colBtn);

      const moveDownBtn = screen.getByRole("button", {
        name: "Move column Product Name down",
      });
      await user.click(moveDownBtn);

      // The first column header should now be SKU Code instead of Product Name
      const headers = screen.getAllByRole("columnheader");
      expect(headers[0]).toHaveTextContent("SKU Code");
      expect(headers[1]).toHaveTextContent("Product Name");
    });
  });
});
