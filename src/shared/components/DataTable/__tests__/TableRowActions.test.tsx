import { useEffect, useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Archive, Eye, Package, Pencil, Trash2 } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { RowActionButton } from "../RowActions/RowActionButton.component";
import { TableRowActions } from "../TableRowActions.component";
import { itemNames, openMenu, queryMenu } from "./rowMenuTestHelpers";

/** Appears after the first paint, as permission-gated actions do. */
function LateAction() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(timer);
  }, []);
  return ready ? <RowActionButton icon={Package} label="Late" /> : null;
}

describe("TableRowActions", () => {
  it("shows View and Edit as tiles, then the list with Delete last", async () => {
    const user = userEvent.setup();
    render(
      <TableRowActions>
        <RowActionButton kind="view" icon={Eye} label="View" />
        <RowActionButton kind="danger" icon={Trash2} label="Delete" />
        <LateAction />
        <RowActionButton kind="edit" icon={Pencil} label="Edit" />
        <RowActionButton icon={Archive} label="Archive" />
      </TableRowActions>,
    );

    const menu = await openMenu(user);
    await within(menu).findByRole("button", { name: "Late" });

    expect(itemNames(menu)).toEqual([
      "View",
      "Edit",
      "Late",
      "Archive",
      "Delete",
    ]);
    expect(within(menu).getByRole("separator")).toBeInTheDocument();
    await waitFor(() =>
      expect(within(menu).getByRole("button", { name: "View" })).toHaveFocus(),
    );
  });

  it("has no divider when there are no tiles", async () => {
    const user = userEvent.setup();
    render(
      <TableRowActions>
        <RowActionButton icon={Archive} label="Archive" />
        {null}
      </TableRowActions>,
    );

    const menu = await openMenu(user);

    expect(within(menu).queryByRole("separator")).not.toBeInTheDocument();
  });

  it("shows a running action on the menu button, also after reopening", async () => {
    const user = userEvent.setup();
    function Download() {
      const [loading, setLoading] = useState(false);
      const start = () => setLoading(true);
      return (
        <RowActionButton
          icon={Package}
          label="Download"
          loading={loading}
          onClick={start}
        />
      );
    }
    render(
      <TableRowActions>
        <Download />
      </TableRowActions>,
    );

    await openMenu(user);
    await user.click(screen.getByRole("button", { name: "Download" }));

    const trigger = screen.getByRole("button", { name: "More actions" });
    expect(trigger).toHaveAttribute("aria-busy", "true");
    expect(queryMenu()).not.toBeInTheDocument();

    const menu = await openMenu(user);
    expect(
      within(menu).getByRole("button", { name: "Download" }),
    ).toBeDisabled();
  });

  it("does not run a disabled action", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    render(
      <TableRowActions>
        <RowActionButton
          icon={Package}
          label="Approve"
          disabled
          disabledHint="Documents missing"
          onClick={onClick}
        />
      </TableRowActions>,
    );

    const menu = await openMenu(user);
    const approve = within(menu).getByRole("button", { name: "Approve" });
    await user.click(approve);

    expect(approve).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
    expect(queryMenu()).toBeInTheDocument();
  });

  it("renders an ordinary button outside a menu", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<RowActionButton icon={Eye} label="Preview" onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "Preview" }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
