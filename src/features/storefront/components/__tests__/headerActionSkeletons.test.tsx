import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StorefrontActionButtons } from "../Header/StorefrontActionButtons.component";
import {
  AccountMenuSkeleton,
  DesktopPrimaryNavSkeleton,
  HeaderMenuButtonSkeleton,
  HeaderSearchButtonSkeleton,
} from "../Header/HeaderActionSkeletons.component";
import { MobileTabBar } from "@/shared/components/layout/MobileTabBar.component";
import { ACCOUNT_TRIGGER_BOX } from "../Header/headerShared";

const baseProps = {
  isTransparent: false,
  cartItemCount: 3,
  wishlistItemCount: 2,
  walletBalance: 620,
  onOpenCart: vi.fn(),
  onOpenMobileSearch: vi.fn(),
};

describe("StorefrontActionButtons loading state", () => {
  it("renders the icon buttons with their counts once loaded", () => {
    render(<StorefrontActionButtons {...baseProps} />);

    expect(screen.getByLabelText("Cart, 3")).toBeInTheDocument();
    expect(screen.getByLabelText("Wishlist, 2")).toBeInTheDocument();
  });

  it("hides the count-backed buttons while the counts are still resolving", () => {
    render(<StorefrontActionButtons {...baseProps} isLoading />);

    // Placeholders stand in so badges do not pop in from zero.
    expect(screen.queryByLabelText("Cart, 3")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Wishlist, 2")).not.toBeInTheDocument();
  });

  it("keeps the search button, which needs no data", () => {
    render(<StorefrontActionButtons {...baseProps} isLoading />);

    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });
});

describe("AccountMenuSkeleton", () => {
  it("uses the same box as the real trigger so the navbar does not shift", () => {
    const { container } = render(<AccountMenuSkeleton />);
    const box = container.firstElementChild as HTMLElement;

    // Geometry comes from the shared constant, never hand-copied.
    for (const cls of ACCOUNT_TRIGGER_BOX.split(" ")) {
      expect(box.className).toContain(cls);
    }
  });

  it("reserves the chevron slot the pill shows from sm up", () => {
    const { container } = render(<AccountMenuSkeleton />);
    expect(container.querySelector(".sm\\:block")).not.toBeNull();
  });
});

describe("DesktopPrimaryNavSkeleton", () => {
  const primaryLinks = [
    { href: "/products", label: "Shop" },
    { href: "/products?sort=newest", label: "New Arrivals" },
    { href: "/products?sort=rating", label: "Top Rated" },
  ] as const;

  it("reserves each link's real width by rendering its label invisibly", () => {
    render(<DesktopPrimaryNavSkeleton primaryLinks={primaryLinks} />);

    // Present in the DOM for width, hidden from the accessibility tree.
    for (const link of primaryLinks) {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    }
  });

  it("hides the placeholder nav from assistive tech", () => {
    render(<DesktopPrimaryNavSkeleton primaryLinks={primaryLinks} />);
    const nav = screen.getByTestId("primary-nav-skeleton");

    expect(nav).toHaveAttribute("aria-hidden", "true");
  });
});

describe("responsive skeleton coverage", () => {
  it("shows the hamburger placeholder only below xl, like the button it replaces", () => {
    const { container } = render(<HeaderMenuButtonSkeleton />);
    const box = container.firstElementChild as HTMLElement;

    expect(box.className).toContain("xl:hidden");
    expect(box.className).toContain("max-sm:h-9");
  });

  it("shows the search placeholder only between lg and xl, like its button", () => {
    const { container } = render(<HeaderSearchButtonSkeleton />);
    const box = container.firstElementChild as HTMLElement;

    expect(box.className).toContain("lg:block");
    expect(box.className).toContain("xl:hidden");
  });

  it("skeletons the search bar itself at xl and up", () => {
    const { container } = render(
      <DesktopPrimaryNavSkeleton primaryLinks={[]} />,
    );
    const searchSlot = container.querySelector(".max-w-xl");

    expect(searchSlot).not.toBeNull();
    expect(searchSlot?.querySelector(".rounded-full")).not.toBeNull();
  });
});

describe("MobileTabBar loading state", () => {
  const tabProps = {
    currentUser: null,
    onOpenCart: vi.fn(),
    onOpenSearch: vi.fn(),
    cartItemCount: 4,
  };

  it("renders the real tabs once resolved", () => {
    render(<MobileTabBar {...tabProps} />);

    expect(screen.getByLabelText("Cart, 4")).toBeInTheDocument();
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("replaces the session-dependent tabs while loading", () => {
    render(<MobileTabBar {...tabProps} isLoading />);

    expect(screen.queryByLabelText("Cart, 4")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Search")).not.toBeInTheDocument();
    // Home is valid for everyone, so it stays usable throughout.
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
