import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import type { StaffMember } from "../../../api/vendorStaff.api";
import { CommissionInvoiceTableRow } from "../../commission/CommissionInvoicesTable/CommissionInvoiceTableRow.component";
import { StaffMembersTable } from "../../team/StaffMembersTable.component";
import { VendorReturnRestockAction } from "../../returns/VendorReturnsTable/VendorReturnRestockAction.component";
import { SubOrderActions } from "../VendorOrdersTable/SubOrderActions.component";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";

type User = ReturnType<typeof userEvent.setup>;

async function openMenu(user: User) {
  await user.click(screen.getByRole("button", { name: "More actions" }));
  return screen.getByRole("dialog", { name: "More actions" });
}

const inTable = (row: React.ReactNode) =>
  render(
    <table>
      <tbody>{row}</tbody>
    </table>,
  );

const member: StaffMember = {
  id: "m1",
  name: "Asha",
  email: "asha@example.com",
  isOwner: false,
  status: "ACTIVE",
  roleName: "Staff",
  createdAt: "2026-01-01T00:00:00Z",
};

describe("vendor row menus", () => {
  it("removes a staff member from the menu", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<StaffMembersTable members={[member]} onRemove={onRemove} />);

    // Both the table and the phone cards are in the DOM; CSS shows one.
    await user.click(
      screen.getAllByRole("button", { name: "More actions" })[0]!,
    );
    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(onRemove).toHaveBeenCalledWith(member);
  });

  it("gives the owner no menu", () => {
    render(
      <StaffMembersTable
        members={[{ ...member, isOwner: true }]}
        onRemove={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "More actions" }),
    ).not.toBeInTheDocument();
  });

  it("downloads a commission invoice from the menu", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    const invoice = {
      id: "i1",
      number: "INV-1",
      formattedAmount: "10",
      formattedDate: "1 Jan",
      isDownloading: false,
    };
    inTable(
      <CommissionInvoiceTableRow
        invoice={invoice as never}
        onDownload={onDownload}
      />,
    );

    const menu = await openMenu(user);
    await user.click(within(menu).getByRole("button", { name: /download/i }));

    expect(onDownload).toHaveBeenCalledWith("i1");
  });

  it("opens the dispute dialog from a return's menu", async () => {
    const user = userEvent.setup();
    const row = {
      id: "r1",
      productLabel: "Phone",
      canRestock: true,
      canDispute: true,
      restocked: false,
      isDisputed: false,
    } as VendorReturnRowViewModel;
    render(
      <QueryClientProvider client={new QueryClient()}>
        <VendorReturnRestockAction row={row} />
      </QueryClientProvider>,
    );

    const menu = await openMenu(user);
    await user.click(within(menu).getByRole("button", { name: "Dispute" }));

    expect(
      screen.queryByRole("dialog", { name: "More actions" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("moves focus into the status editor and back to the menu", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [updatingId, setUpdatingId] = useState<string | null>(null);
      return (
        <SubOrderActions
          subOrderId="s1"
          status="PENDING"
          updatingId={updatingId}
          onSetUpdatingId={setUpdatingId}
          onStatusChange={vi.fn()}
        />
      );
    }
    render(<Harness />);

    const menu = await openMenu(user);
    await user.click(within(menu).getByRole("button", { name: "Update" }));

    await waitFor(() => expect(document.activeElement).not.toBe(document.body));
    await user.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "More actions" }),
      ).toHaveFocus(),
    );
  });
});
