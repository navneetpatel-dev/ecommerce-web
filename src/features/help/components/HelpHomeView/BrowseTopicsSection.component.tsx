"use client";

import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { HELP_CATEGORIES } from "../../constants/helpContent";
import { CategoryCard } from "./CategoryCard.component";
import { helpHomeViewStyles as styles } from "./helpHomeView.styles";

export function BrowseTopicsSection() {
  const categoryElements = HELP_CATEGORIES.map((category) => (
    <CategoryCard key={category.id} category={category} />
  ));

  return (
    <section className={styles.browseSection}>
      <TextEyebrow>{LABELS.helpBrowseTopicsEyebrow}</TextEyebrow>
      <ul className={styles.browseGrid}>{categoryElements}</ul>
    </section>
  );
}
