import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import type { Category, ProductDetail } from "@/shared/api/types";

type CatNode = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export function getProductBreadcrumbItems(
  product: ProductDetail,
  categories: Category[],
): Array<{ label: string; href?: string }> {
  const byId = new Map<string, Category>();
  const index = (nodes: Category[]) => {
    for (const node of nodes) {
      byId.set(node.id, node);
      if (node.children?.length) index(node.children);
    }
  };
  index(categories);

  const chain: CatNode[] = [];
  const nested = (
    product as ProductDetail & {
      category?: CatNode & {
        parent?: (CatNode & { parent?: CatNode | null }) | null;
      };
    }
  ).category;

  if (nested?.name) {
    let cursor: (CatNode & { parent?: CatNode | null }) | null | undefined =
      nested;
    while (cursor) {
      chain.unshift({
        id: cursor.id,
        name: cursor.name,
        slug: cursor.slug,
        parentId: cursor.parentId ?? null,
      });
      cursor = cursor.parent ?? null;
    }
  } else if (product.categoryId) {
    let cursorId: string | null = product.categoryId;
    while (cursorId) {
      const node = byId.get(cursorId);
      if (!node) break;
      chain.unshift({
        id: node.id,
        name: node.name,
        slug: node.slug,
        parentId: node.parentId,
      });
      cursorId = node.parentId;
    }
  }

  return chain.map((node, index) => ({
    label: node.name,
    href: PATHS.category(
      ...chain.slice(0, index + 1).map((item) => item.slug),
    ),
  }));
}

export function useProductDetailBreadcrumbs(
  product: ProductDetail | undefined,
  categories: Category[],
): Array<{ label: string; href?: string }> {
  if (!product) return [];
  return [
    { label: LABELS.allProducts, href: PATHS.products },
    ...getProductBreadcrumbItems(product, categories),
    { label: product.name },
  ];
}
