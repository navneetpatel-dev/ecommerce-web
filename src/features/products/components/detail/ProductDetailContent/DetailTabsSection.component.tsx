"use client";

import { ProductInfo } from "../ProductInfo.component";
import { ProductHighlights } from "../ProductHighlights.component";
import { ProductSpecifications } from "../../specs/ProductSpecifications.component";
import { ProductReviewsContainer } from "@/features/reviews";
import { ProductQnaContainer } from "@/features/productQna";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductDetail, ProductVariant } from "@/shared/api/types";
import { PRODUCT_DETAIL_CONTENT_STYLES } from "./productDetailContent.styles";

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
    <div className={PRODUCT_DETAIL_CONTENT_STYLES.tabsContainer}>
      <Tabs value={detailTab} onValueChange={onTabChange}>
        <TabsList className={PRODUCT_DETAIL_CONTENT_STYLES.tabsList}>
          <TabsTrigger
            value="description"
            className={PRODUCT_DETAIL_CONTENT_STYLES.tabTrigger}
          >
            {LABELS.description}
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className={PRODUCT_DETAIL_CONTENT_STYLES.tabTrigger}
          >
            {LABELS.specifications}
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className={PRODUCT_DETAIL_CONTENT_STYLES.tabTrigger}
          >
            {formatLabel(LABELS.reviewsWithCount, { count: reviewCount })}
          </TabsTrigger>
          <TabsTrigger
            value="qna"
            className={PRODUCT_DETAIL_CONTENT_STYLES.tabTrigger}
          >
            {LABELS.questionsAndAnswers}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="description"
          className={PRODUCT_DETAIL_CONTENT_STYLES.tabContent}
        >
          <div className={PRODUCT_DETAIL_CONTENT_STYLES.descriptionWrapper}>
            <ProductInfo product={product} />
            {product.videoUrl ? (
              <div className={PRODUCT_DETAIL_CONTENT_STYLES.videoSection}>
                <p className={PRODUCT_DETAIL_CONTENT_STYLES.videoLabel}>
                  {LABELS.productVideo}
                </p>
                <video
                  src={product.videoUrl}
                  controls
                  className={PRODUCT_DETAIL_CONTENT_STYLES.videoElement}
                  aria-label={LABELS.productVideo}
                />
              </div>
            ) : null}
            {product.highlights?.length ? (
              <ProductHighlights highlights={product.highlights} />
            ) : null}
          </div>
        </TabsContent>
        <TabsContent
          value="specifications"
          className={PRODUCT_DETAIL_CONTENT_STYLES.tabContent}
        >
          <ProductSpecifications
            specs={product.specs}
            matchedVariant={resolvedVariant}
            categoryName={categoryName}
            secondaryCategories={product.secondaryCategories}
            displayStock={displayStock}
          />
        </TabsContent>
        <TabsContent
          value="reviews"
          className={PRODUCT_DETAIL_CONTENT_STYLES.tabContent}
          id="reviews"
        >
          <ProductReviewsContainer
            productId={product.id}
            enabled={detailTab === "reviews"}
          />
        </TabsContent>
        <TabsContent
          value="qna"
          className={PRODUCT_DETAIL_CONTENT_STYLES.tabContent}
          id="qna"
        >
          <ProductQnaContainer
            productId={product.id}
            enabled={detailTab === "qna"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
