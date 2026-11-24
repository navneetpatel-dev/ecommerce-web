import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "../DataTable.component";
import type { DataTableColumn } from "@/shared/types/data-table/types";

type Item = { id: string; name: string; status: string };

const columns: DataTableColumn<Item>[] = [
  { id: "name", header: "Name", accessor: "name" },
  { id: "status", header: "Status", accessor: "status" },
];

const rows: Item[] = [
  { id: "row-1", name: "Alpha", status: "ACTIVE" },
  { id: "row-2", name: "Beta", status: "PENDING" },
];

describe("DataTable on-demand detail fetching", () => {
  it("fetches and displays full details on row click", async () => {
    const user = userEvent.setup();
    const fetchRowDetail = vi.fn().mockImplementation(async (item: Item) => ({
      id: item.id,
      name: item.name,
      description: `Full detailed description for ${item.name}`,
      extraField: "SecretDetails",
    }));

    render(
      <DataTable
        title="Items"
        columns={columns}
        rows={rows}
        rowDetails
        fetchRowDetail={fetchRowDetail}
      />,
    );

    const firstRowCell = screen.getAllByText("Alpha")[0];
    await user.click(firstRowCell);

    expect(fetchRowDetail).toHaveBeenCalledWith(rows[0]);

    await waitFor(() => {
      expect(screen.getByText("SecretDetails")).toBeInTheDocument();
    });
  });

  it("reuses cached details when the same row is reopened", async () => {
    const user = userEvent.setup();
    const fetchRowDetail = vi.fn().mockImplementation(async (item: Item) => ({
      id: item.id,
      name: item.name,
      details: "CachedValue",
    }));

    render(
      <DataTable
        title="Items"
        columns={columns}
        rows={rows}
        rowDetails
        fetchRowDetail={fetchRowDetail}
      />,
    );

    await user.click(screen.getAllByText("Alpha")[0]);
    await waitFor(() => {
      expect(screen.getByText("CachedValue")).toBeInTheDocument();
    });
    expect(fetchRowDetail).toHaveBeenCalledTimes(1);

    // Close dialog
    const closeBtn = screen.getByRole("button", { name: /close/i });
    await user.click(closeBtn);

    // Reopen row
    await user.click(screen.getAllByText("Alpha")[0]);
    await waitFor(() => {
      expect(screen.getByText("CachedValue")).toBeInTheDocument();
    });
    // Should still be called only once
    expect(fetchRowDetail).toHaveBeenCalledTimes(1);
  });
});
