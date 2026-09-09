import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/features/products";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { PATHS } from "@/shared/constants/paths/paths";
import type { ProductListItem } from "@/shared/api/types";
import { trendingSectionStyles as styles } from "./trendingSection.styles";

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
            Featured this week
          </TextEyebrow>
          <h2 className={styles.title}>Trending now</h2>
        </div>
        <Link href={PATHS.productsTrending} className={styles.viewAllLink}>
          View all <ArrowRight className={styles.arrowIcon} />
        </Link>
      </div>
      <ProductGrid products={products} loading={isLoading} skeletonCount={8} />
    </section>
  );
}
