import { screen, within } from "@testing-library/react";
import type userEvent from "@testing-library/user-event";

type User = ReturnType<typeof userEvent.setup>;

export const openMenu = async (user: User) => {
  await user.click(screen.getByRole("button", { name: "More actions" }));
  return screen.getByRole("dialog", { name: "More actions" });
};

export const queryMenu = () =>
  screen.queryByRole("dialog", { name: "More actions" });

export const itemNames = (menu: HTMLElement) =>
  within(menu)
    .getAllByRole("button")
    .map((button) => button.textContent);
