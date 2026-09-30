import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Category } from "@/shared/api/types";
import { MobileNavCategoryTree } from "../MobileNavCategoryTree.component";

function category(
  partial: Partial<Category> & Pick<Category, "id" | "name" | "slug">,
): Category {
  return { ...partial } as Category;
}

function department(name: string, childNames: string[]): Category {
  const slug = name.toLowerCase();
  return category({
    id: `dept-${slug}`,
    name,
    slug,
    path: slug,
    children: childNames.map((childName) => {
      const childSlug = `${slug}-${childName.toLowerCase().replace(/\s/g, "-")}`;
      return category({
        id: `cat-${childSlug}`,
        name: childName,
        slug: childSlug,
        path: childSlug,
      });
    }),
  });
}

const categories = [
  department("Automotive", ["Accessories", "Car Parts"]),
  department("Beauty", ["Makeup", "Skincare"]),
];

/**
 * The categories are dropdowns in the drawer: nothing is listed until "Categories" is tapped,
 * and each department then drops its own subcategory pills down on its own tap — the navbar's
 * tiles, disclosed, so a 288px column never has to render the whole tree.
 */
describe("MobileNavCategoryTree dropdowns", () => {
  it("keeps the departments collapsed until the categories row is tapped", async () => {
    const user = userEvent.setup();
    render(
      <MobileNavCategoryTree categories={categories} onNavigate={vi.fn()} />,
    );

    const toggle = screen.getByRole("button", { name: /Categories/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("button", { name: /Automotive/ }),
    ).not.toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: /Automotive/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Beauty/ })).toBeInTheDocument();
    // Still collapsed one level down: the tiles show names, not their children yet.
    expect(
      screen.queryByRole("link", { name: "Makeup" }),
    ).not.toBeInTheDocument();
  });

  it("drops a department's subcategory pills down when its tile is tapped", async () => {
    const user = userEvent.setup();
    render(
      <MobileNavCategoryTree categories={categories} onNavigate={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: /Categories/ }));

    const tile = screen.getByRole("button", { name: /Automotive/ });
    expect(tile).toHaveAttribute("aria-expanded", "false");

    await user.click(tile);

    expect(tile).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Car Parts" })).toHaveAttribute(
      "href",
      "/category/automotive-car-parts",
    );
    // The tile also links on to the department page for the deeper level.
    expect(
      screen.getByRole("link", { name: /View all Automotive/ }),
    ).toHaveAttribute("href", "/category/automotive");

    await user.click(tile);
    expect(tile).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("link", { name: "Car Parts" }),
    ).not.toBeInTheDocument();
  });

  it("collapses a department's children past the pill cap into a +N link", async () => {
    const user = userEvent.setup();
    render(
      <MobileNavCategoryTree
        categories={[department("Books", ["A", "B", "C", "D", "E", "F", "G"])]}
        onNavigate={vi.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Categories/ }));
    await user.click(screen.getByRole("button", { name: /Books/ }));

    expect(screen.getAllByRole("link", { name: /^[A-E]$/ })).toHaveLength(5);
    expect(screen.getByRole("link", { name: "+2" })).toHaveAttribute(
      "href",
      "/category/books",
    );
  });

  it("shows the category count as a pill beside the title", async () => {
    render(
      <MobileNavCategoryTree categories={categories} onNavigate={vi.fn()} />,
    );

    const pill = screen.getByText("2");
    expect(pill).toBeInTheDocument();
    // The visible pill is a bare number; "2 categories" is what assistive tech hears, so the
    // header never grows a line of prose under the title.
    expect(pill).toHaveTextContent("2");
    expect(screen.getByText("2 categories")).toBeInTheDocument();
    expect(screen.queryByText(/departments/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View all/ })).toHaveAttribute(
      "href",
      "/categories",
    );
  });

  it("keeps only one category open at a time", async () => {
    const user = userEvent.setup();
    render(
      <MobileNavCategoryTree categories={categories} onNavigate={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: /Categories/ }));

    const automotive = screen.getByRole("button", { name: /Automotive/ });
    const beauty = screen.getByRole("button", { name: /Beauty/ });

    await user.click(automotive);
    expect(automotive).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Car Parts" })).toBeInTheDocument();

    await user.click(beauty);

    expect(beauty).toHaveAttribute("aria-expanded", "true");
    expect(automotive).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("link", { name: "Makeup" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Car Parts" }),
    ).not.toBeInTheDocument();
  });

  it("captions each open category with its subcategory count", async () => {
    const user = userEvent.setup();
    render(
      <MobileNavCategoryTree categories={categories} onNavigate={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: /Categories/ }));
    await user.click(screen.getByRole("button", { name: /Automotive/ }));

    expect(screen.getAllByText("2 subcategories")).toHaveLength(2);
  });

  it("shows the empty copy, and no list, when there are no categories", () => {
    render(<MobileNavCategoryTree categories={[]} onNavigate={vi.fn()} />);

    expect(screen.getByText("No categories yet")).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /View all/ }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("closes the drawer when a subcategory pill is picked", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <MobileNavCategoryTree categories={categories} onNavigate={onNavigate} />,
    );
    await user.click(screen.getByRole("button", { name: /Categories/ }));
    await user.click(screen.getByRole("button", { name: /Beauty/ }));

    await user.click(screen.getByRole("link", { name: "Makeup" }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
