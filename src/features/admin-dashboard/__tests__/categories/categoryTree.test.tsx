import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { categoriesApi } from "@/features/categories";
import { LABELS } from "@/shared/constants/labels";
import {
  CategoryGstCell,
  CategoryNameCell,
} from "../../components/categories/CategoriesTable/CategoryCells.component";
import { ArchiveDescription } from "../../components/categories/AdminArchiveCategoryAction/ArchiveDescription.component";
import { useCategoriesReorder } from "../../hooks/categories/useCategoriesReorder.hook";

afterEach(() => vi.restoreAllMocks());

const cat = (id: string, parentId: string | null, over = {}) =>
  ({ id, name: id, slug: id, parentId, ...over }) as never;

describe("category tree cells", () => {
  it("indents by depth and shows a search result's path", () => {
    render(
      <CategoryNameCell
        category={cat("Pans", "c", { depth: 2, path: "Home › Cookware" })}
      />,
    );
    expect(screen.getByText("Home › Cookware")).toBeInTheDocument();
    expect(screen.getByText("Pans").parentElement).toHaveStyle({
      paddingLeft: "2.5rem",
    });
  });

  it("shows the GST with where it comes from", () => {
    render(
      <CategoryGstCell
        category={cat("a", null, {
          gst: { percent: 12, source: "inherited", fromCategoryName: "Home" },
        })}
      />,
    );
    expect(screen.getByText("12%")).toHaveAttribute(
      "title",
      "Inherited from Home",
    );
  });
});

describe("dragging a category", () => {
  const rows = [cat("a", null), cat("b", null), cat("c", "a")];
  const drag = (activeId: string, overId: string) =>
    ({ active: { id: activeId }, over: { id: overId } }) as never;

  it("moves it among siblings with an anchor (after when dragged down, before when up)", async () => {
    const move = vi.spyOn(categoriesApi, "move").mockResolvedValue({} as never);
    const { result } = renderHook(() => useCategoriesReorder(rows, vi.fn()));
    await act(() => result.current.onDragEnd(drag("a", "b")));
    expect(move).toHaveBeenCalledWith("a", { afterId: "b" });
    const fresh = renderHook(() => useCategoriesReorder(rows, vi.fn()));
    await act(() => fresh.result.current.onDragEnd(drag("b", "a")));
    expect(move).toHaveBeenLastCalledWith("b", { beforeId: "a" });
  });

  it("refuses to drop onto another parent's category, without calling the API", async () => {
    const move = vi.spyOn(categoriesApi, "move").mockResolvedValue({} as never);
    const { result } = renderHook(() => useCategoriesReorder(rows, vi.fn()));
    await act(() => result.current.onDragEnd(drag("a", "c")));
    expect(move).not.toHaveBeenCalled();
    expect(result.current.reorderError).toBe(LABELS.categoryReorderSameParent);
  });
});

describe("archive and delete confirmation text", () => {
  const impact = {
    categoryId: "c",
    childCount: 3,
    activeChildCount: 2,
    productCount: 7,
    ownTaxRule: { id: "r", gstPercentage: 12 },
    gstAfterRuleRemoved: null,
  };

  it("archive says what it touches, including active subcategories", async () => {
    vi.spyOn(categoriesApi, "impact").mockResolvedValue(impact);
    render(<ArchiveDescription categoryId="c" name="Home" />);
    await waitFor(() =>
      expect(
        screen.getByText(/Products: 7\. Subcategories: 3\./),
      ).toBeInTheDocument(),
    );
    expect(
      screen.getByText(/Active subcategories also archived: 2\./),
    ).toBeInTheDocument();
  });

  it("delete mentions the tax rule that goes with it", async () => {
    vi.spyOn(categoriesApi, "impact").mockResolvedValue(impact);
    render(<ArchiveDescription categoryId="c" name="Home" mode="delete" />);
    await waitFor(() =>
      expect(
        screen.getByText(/12% GST\) will be deleted with it/),
      ).toBeInTheDocument(),
    );
  });
});
