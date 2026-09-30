"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Category } from "@/shared/api/types";

/** Child pills a drawer tile shows before the "+N" more link. */
export const MAX_VISIBLE_CHILDREN = 5;

export interface MobileNavDepartmentDropdown {
  department: Category;
  /** Children shown as pills when the dropdown is open. */
  visibleChildren: Category[];
  hiddenCount: number;
  childCountLabel: string | null;
}

/**
 * Drawer category dropdowns (Rule 3: the disclosure state lives in a hook).
 *
 * Both levels start collapsed: the drawer opens as a tidy menu — "Categories" with its count
 * — and each department drops its subcategory pills down when it is tapped. Only one
 * department stays open at a time, so the 288px column never grows a second open panel; ids
 * are exposed for the `aria-controls`/`id` pair every toggle needs.
 */
export function useMobileNavCategories(categories: Category[]) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleCategories = useCallback(() => setOpen((value) => !value), []);

  const toggleDepartment = useCallback((departmentId: string) => {
    // Opening one closes whichever was open before.
    setExpandedId((current) =>
      current === departmentId ? null : departmentId,
    );
  }, []);

  const departments = useMemo(
    () =>
      categories.map((department) => {
        const children = department.children ?? [];
        const visibleChildren = children.slice(0, MAX_VISIBLE_CHILDREN);
        return {
          department,
          visibleChildren,
          hiddenCount: children.length - visibleChildren.length,
          childCountLabel: children.length
            ? formatLabel(
                children.length === 1
                  ? LABELS.categoryChildCountSingular
                  : LABELS.categoryChildCountPlural,
                { count: children.length },
              )
            : null,
        };
      }),
    [categories],
  );

  return {
    open,
    toggleCategories,
    expandedId,
    toggleDepartment,
    departments,
    count: categories.length,
    listId: `${baseId}-departments`,
    panelId: (departmentId: string) => `${baseId}-${departmentId}`,
  };
}
