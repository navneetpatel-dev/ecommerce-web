"use client";

import { useMemo } from "react";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";

type BreadcrumbNode = { name: string; slug: string };

export function useCategoryBreadcrumbs(
  trail: BreadcrumbNode[] | undefined,
): Array<{ label: string; href: string }> {
  return useMemo(() => {
    const nodes = trail ?? [];
    return [
      { label: LABELS.allCategories, href: PATHS.categories },
      ...nodes.map((node, index) => {
        const slugs = nodes.slice(0, index + 1).map((item) => item.slug);
        return {
          label: node.name,
          href: PATHS.category(...slugs),
        };
      }),
    ];
  }, [trail]);
}
