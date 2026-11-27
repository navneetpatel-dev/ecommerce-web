import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Archive, Package } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { RowActionButton } from "../RowActions/RowActionButton.component";
import { TableRowActions } from "../TableRowActions.component";
import { openMenu, queryMenu } from "./rowMenuTestHelpers";

/** An action component that owns its dialog, like the confirm and edit actions do. */
function ConfirmingAction({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  const show = () => setOpen(true);
  const confirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <RowActionButton icon={Archive} label="Archive" onClick={show} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Archive this?</DialogTitle>
          <RowActionButton icon={Archive} label="Yes" onClick={confirm} />
        </DialogContent>
      </Dialog>
    </>
  );
}

describe("TableRowActions dialogs", () => {
  it("closes the menu on select and keeps the action's dialog working", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onRowClick = vi.fn();
    render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={onRowClick}>
        <TableRowActions>
          <ConfirmingAction onConfirm={onConfirm} />
        </TableRowActions>
      </div>,
    );

    const menu = await openMenu(user);
    await user.click(within(menu).getByRole("button", { name: "Archive" }));

    expect(queryMenu()).not.toBeInTheDocument();
    const dialog = screen.getByRole("dialog", { name: "Archive this?" });
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement),
    );

    // A row action button inside a dialog is an ordinary button, not a menu entry.
    await user.click(within(dialog).getByRole("button", { name: "Yes" }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onRowClick).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("dialog", { name: "Archive this?" }),
    ).not.toBeInTheDocument();
  });

  it("returns focus to the menu button when the dialog is dismissed", async () => {
    const user = userEvent.setup();
    render(
      <TableRowActions>
        <ConfirmingAction onConfirm={vi.fn()} />
      </TableRowActions>,
    );

    const menu = await openMenu(user);
    await user.click(within(menu).getByRole("button", { name: "Archive" }));
    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "More actions" }),
      ).toHaveFocus(),
    );
  });

  it("works with a DialogTrigger around the action", async () => {
    const user = userEvent.setup();
    render(
      <TableRowActions>
        <Dialog>
          <DialogTrigger asChild>
            <RowActionButton kind="edit" icon={Package} label="Edit stock" />
          </DialogTrigger>
          <DialogContent aria-describedby={undefined}>
            <DialogTitle>Update stock</DialogTitle>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <input aria-label="Stock" autoFocus />
          </DialogContent>
        </Dialog>
      </TableRowActions>,
    );

    const menu = await openMenu(user);
    await user.click(within(menu).getByRole("button", { name: "Edit stock" }));

    await waitFor(() => expect(screen.getByLabelText("Stock")).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "More actions" }),
      ).toHaveFocus(),
    );
  });

  it("closes on Escape after another row's menu was used", async () => {
    const user = userEvent.setup();
    render(
      <>
        <TableRowActions>
          <RowActionButton icon={Archive} label="First" />
        </TableRowActions>
        <TableRowActions>
          <RowActionButton icon={Archive} label="Second" />
        </TableRowActions>
      </>,
    );
    const [first, second] = screen.getAllByRole("button", {
      name: "More actions",
    });

    await user.click(first!);
    await user.click(screen.getByRole("button", { name: "First" }));
    await user.click(second!);
    await user.keyboard("{Escape}");

    expect(queryMenu()).not.toBeInTheDocument();
  });
});
