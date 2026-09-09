import { memo } from "react";
import Link from "next/link";
import { PATHS } from "@/shared/constants/paths";
import { PRODUCT_SPECIFICATIONS_STYLES } from "./productSpecifications.styles";

interface SecondaryCategory {
  id: string;
  name: string;
  slug: string;
}

interface SecondaryCategoryChipProps {
  category: SecondaryCategory;
}

export const SecondaryCategoryChip = memo(function SecondaryCategoryChip({
  category,
}: SecondaryCategoryChipProps) {
  return (
    <Link
      href={PATHS.category(category.slug)}
      className={PRODUCT_SPECIFICATIONS_STYLES.categoryChip}
    >
      {category.name}
    </Link>
  );
});
