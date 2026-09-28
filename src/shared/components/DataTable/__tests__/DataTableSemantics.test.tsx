import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DataTable } from "../DataTable.component";
import type { DataTableColumn } from "@/shared/types/data-table/types";

type Row = { id: string; name: string; amount: string };

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Coupon", accessor: "name" },
  { id: "amount", header: "Discount", accessor: "amount" },
];

const rows: Row[] = [{ id: "1", name: "SAVE10", amount: "10%" }];

/**
 * Dense dashboard tables are where assistive tech needs the most structure:
 * without a name the table is announced as an anonymous grid, and without
 * `scope` the header cells are guessed from layout (WCAG 1.3.1).
 */
describe("DataTable semantics", () => {
  it("names the table after its section title", () => {
    render(<DataTable title="Coupons" columns={columns} rows={rows} />);

    expect(screen.getByRole("table", { name: "Coupons" })).toBeInTheDocument();
  });

  it("marks every header cell as a column header", () => {
    render(<DataTable title="Coupons" columns={columns} rows={rows} />);

    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(2);
    for (const header of headers) {
      expect(header).toHaveAttribute("scope", "col");
    }
  });

  it("scopes the actions column header too", () => {
    render(
      <DataTable
        title="Coupons"
        columns={columns}
        rows={rows}
        actions={() => <button type="button">Edit</button>}
      />,
    );

    const headers = screen.getAllByRole("columnheader");
    expect(headers).toHaveLength(3);
    expect(headers[2]).toHaveAttribute("scope", "col");
  });

  it("omits the name when the title is not plain text", () => {
    render(
      <DataTable title={<span>Coupons</span>} columns={columns} rows={rows} />,
    );

    expect(screen.getByRole("table")).not.toHaveAttribute("aria-label");
  });
});
