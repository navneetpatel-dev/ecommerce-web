import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/features/products";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import type { ProductListItem } from "@/shared/api/types";
import { trendingSectionStyles as styles } from "../../styles/trending/trendingSection.styles";

interface TrendingSectionProps {
  products?: ProductListItem[];
  isLoading?: boolean;
}

export function TrendingSection({ products, isLoading }: TrendingSectionProps) {
  return (
    <section>
      <div className={styles.header}>
        <div>
          <TextEyebrow className={styles.eyebrow}>
            {LABELS.featuredThisWeek}
          </TextEyebrow>
          <h2 className={styles.title}>{LABELS.trendingNow}</h2>
        </div>
        <Link href={PATHS.productsTrending} className={styles.viewAllLink}>
          {LABELS.viewAll} <ArrowRight className={styles.arrowIcon} />
        </Link>
      </div>
      <ProductGrid products={products} loading={isLoading} skeletonCount={8} />
    </section>
  );
}
