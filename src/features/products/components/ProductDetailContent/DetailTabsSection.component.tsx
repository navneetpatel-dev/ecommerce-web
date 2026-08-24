"use client";

import { ProductInfo } from "../ProductInfo.component";
import { ProductHighlights } from "../ProductHighlights.component";
import { ProductSpecifications } from "../ProductSpecifications.component";
import { ProductReviewsContainer } from "@/features/reviews";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { ProductDetail, ProductVariant } from "@/shared/api/types";

interface DetailTabsSectionProps {
  product: ProductDetail;
  detailTab: string;
  onTabChange: (tab: string) => void;
  resolvedVariant: ProductVariant | null;
  categoryName: string | null;
  displayStock: number;
  reviewCount: number;
}

export function DetailTabsSection({
  product,
  detailTab,
  onTabChange,
  resolvedVariant,
  categoryName,
  displayStock,
  reviewCount,
}: DetailTabsSectionProps) {
  return (
    <div className="mt-12 border-t border-line pt-8 md:mt-16 md:pt-10">
      <Tabs value={detailTab} onValueChange={onTabChange}>
        <TabsList className="w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-line bg-transparent p-0">
          <TabsTrigger
            value="description"
            className="rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {LABELS.description}
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {LABELS.specifications}
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {formatLabel(LABELS.reviewsWithCount, { count: reviewCount })}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="py-6 md:py-8">
          <div className="max-w-3xl space-y-8">
            <ProductInfo product={product} />
            {product.videoUrl ? (
              <div className="space-y-2">
                <p className="text-body-sm font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  {LABELS.productVideo}
                </p>
                <video
                  src={product.videoUrl}
                  controls
                  className="w-full rounded-xl border border-line bg-paper"
                  aria-label={LABELS.productVideo}
                />
              </div>
            ) : null}
            {product.highlights?.length ? (
              <ProductHighlights highlights={product.highlights} />
            ) : null}
          </div>
        </TabsContent>
        <TabsContent value="specifications" className="py-6 md:py-8">
          <ProductSpecifications
            specs={product.specs}
            matchedVariant={resolvedVariant}
            categoryName={categoryName}
            secondaryCategories={product.secondaryCategories}
            displayStock={displayStock}
          />
        </TabsContent>
        <TabsContent value="reviews" className="py-6 md:py-8" id="reviews">
          <ProductReviewsContainer
            productId={product.id}
            enabled={detailTab === "reviews"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
