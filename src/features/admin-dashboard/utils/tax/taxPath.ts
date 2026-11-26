import { PATHS } from "@/shared/constants/paths/paths";

/** The Tax page showing one category: its rate, where it comes from, and its rule. */
export const taxPathForCategory = (categoryId: string) =>
  `${PATHS.admin.tax}?categoryId=${encodeURIComponent(categoryId)}`;
