import type { CategoryRateChange } from "@/features/categories";
import type { CategoryFormInput } from "../../schemas/categories/categories.schema";
import type { CategoryData } from "./categoryFormValues";

const rate = (value: string | number | null | undefined) =>
  value == null || String(value).trim() === "" ? null : Number(value);

/**
 * What an edit of a category would change about what vendors are charged: a new commission rate, a
 * new parent, or both. Null when neither differs from the saved category.
 */
export function categoryEditRateChange(
  category: CategoryData,
  values: Pick<CategoryFormInput, "parentId" | "commissionRate">,
): CategoryRateChange | null {
  const moved = (values.parentId ?? "") !== (category.parentId ?? "");
  const next = rate(values.commissionRate);
  const repriced =
    !Number.isNaN(next) && next !== rate(category.commissionRate);
  if (repriced) {
    return {
      kind: "edit",
      categoryId: category.id,
      commissionRate: next == null ? undefined : String(next),
      parentId: moved ? values.parentId || "none" : undefined,
    };
  }
  if (!moved) return null;
  return {
    kind: "reparent",
    categoryId: category.id,
    parentId: values.parentId || undefined,
  };
}
