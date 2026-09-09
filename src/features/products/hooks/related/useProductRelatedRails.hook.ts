import { useInView } from "@/shared/hooks/scroll/useInView.hook";
import {
  useProductList,
  useFrequentlyBoughtTogether,
} from "../../api/listing/products.queries";
import { useRecentlyViewed } from "./useRecentlyViewed.hook";

interface UseProductRelatedRailsParams {
  productId: string;
  categoryId?: string | null;
  vendorId?: string | null;
}

export function useProductRelatedRails({
  productId,
  categoryId,
  vendorId,
}: UseProductRelatedRailsParams) {
  const { ref, inView } = useInView<HTMLDivElement>({
    rootMargin: "320px 0px",
  });

  const related = useProductList(
    {
      categoryId: categoryId ?? undefined,
      excludeProductId: productId,
      includeDescendants: true,
      limit: 8,
      sort: "popular",
    },
    { enabled: Boolean(categoryId) && inView },
  );

  const fromSeller = useProductList(
    {
      vendorId: vendorId ?? undefined,
      excludeProductId: productId,
      limit: 8,
      sort: "newest",
    },
    { enabled: Boolean(vendorId) && inView },
  );

  const frequentlyBoughtTogether = useFrequentlyBoughtTogether(productId, {
    enabled: inView,
  });

  const recentlyViewed = useRecentlyViewed(8);
  const recent = recentlyViewed.products.filter(
    (item) => item.id !== productId,
  );

  const relatedItems = related.data?.items ?? [];
  const sellerItems = fromSeller.data?.items ?? [];
  const fbtItems = frequentlyBoughtTogether.data ?? [];

  return {
    ref,
    fbtItems,
    fbtLoading: frequentlyBoughtTogether.isLoading,
    relatedItems,
    relatedLoading: related.isLoading,
    sellerItems,
    sellerLoading: fromSeller.isLoading,
    recent,
    showFbt: frequentlyBoughtTogether.isLoading || fbtItems.length > 0,
    showRelated:
      Boolean(categoryId) && (related.isLoading || relatedItems.length > 0),
    showSeller:
      Boolean(vendorId) && (fromSeller.isLoading || sellerItems.length > 0),
  };
}
