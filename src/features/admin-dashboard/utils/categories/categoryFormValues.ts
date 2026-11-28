import {
  CATEGORY_STATUS,
  type CategoryStatus,
} from "@/shared/constants/statuses";
import type { CategoryFormInput } from "../../schemas/categories/categories.schema";

export interface CategoryData {
  id: string;
  name: string;
  parentId?: string | null;
  imageUrl?: string | null;
  status?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  commissionRate?: number | null;
  returnWindowDays?: number | null;
  codEnabled?: boolean;
  defaultWarrantyMonths?: number | null;
  defaultWarrantyType?: string | null;
}

const text = (value: string | number | null | undefined) =>
  value == null ? "" : String(value);

/** The edit form's values for a saved category. */
export function categoryFormValues(category: CategoryData): CategoryFormInput {
  return {
    name: category.name,
    parentId: category.parentId ?? "",
    imageUrl: category.imageUrl ?? "",
    status: (category.status as CategoryStatus) || CATEGORY_STATUS.ACTIVE,
    seoTitle: category.seoTitle ?? "",
    seoDescription: category.seoDescription ?? "",
    commissionRate: text(category.commissionRate),
    returnWindowDays: text(category.returnWindowDays),
    codEnabled: category.codEnabled !== false,
    defaultWarrantyMonths: text(category.defaultWarrantyMonths),
    defaultWarrantyType: category.defaultWarrantyType ?? "",
  };
}
