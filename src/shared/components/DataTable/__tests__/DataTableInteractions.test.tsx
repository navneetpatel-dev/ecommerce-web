import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "../DataTable.component";
import { columns, rows } from "./dataTable.fixtures";

describe("DataTable enhanced features: selection, keyboard, export and paging", () => {
  beforeEach(() => {
    localStorage.clear();
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
});
