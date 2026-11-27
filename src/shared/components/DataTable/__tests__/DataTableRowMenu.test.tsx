import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DataTable } from "../DataTable.component";
import type { DataTableColumn } from "@/shared/types/data-table/types";

type Row = { id: string; name: string };

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", accessor: "name" },
];
const rows: Row[] = [{ id: "1", name: "Phones" }];

describe("DataTable row menu", () => {
  it("offers the built-in View tile in both layouts", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        title="Categories"
        columns={columns}
        rows={rows}
        showViewButton
        rowDetails
      />,
    );
    const triggers = screen.getAllByRole("button", { name: "More actions" });
    expect(triggers).toHaveLength(2);

    for (const trigger of triggers) {
      await user.click(trigger);
      const menu = screen.getByRole("dialog", { name: "More actions" });
      expect(
        within(menu).getByRole("button", { name: "View" }),
      ).toHaveAttribute("data-row-action", "view");
      await user.keyboard("{Escape}");
    }
  });
});
