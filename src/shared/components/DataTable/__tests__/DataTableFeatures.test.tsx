import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "../DataTable.component";
import { columns, rows } from "./dataTable.fixtures";

describe("DataTable enhanced features: layout and sorting", () => {
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
