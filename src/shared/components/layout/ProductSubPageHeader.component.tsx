import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { productSubPageStyles as styles } from "@/shared/styles/layout/productSubPage.styles";

interface ProductSubPageHeaderProps {
  productHref: string;
  productName: string;
  imageUrl?: string | null;
  eyebrow: string;
  title: string;
}

/** Back-to-product link + product thumbnail + page h1, for the reviews / questions pages. */
export function ProductSubPageHeader({
  productHref,
  productName,
  imageUrl,
  eyebrow,
  title,
}: ProductSubPageHeaderProps) {
  return (
    <>
      <Link href={productHref} className={styles.backLink}>
        <ArrowLeft className={styles.backIcon} aria-hidden />
        {LABELS.backToProduct}
      </Link>
      <header className={styles.header}>
        <Link
          href={productHref}
          className={styles.headerThumb}
          tabIndex={-1}
          aria-hidden
        >
          <MediaImage
            src={imageUrl}
            alt={productName}
            sizes="64px"
            imageClassName={styles.headerThumbImage}
          />
        </Link>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </header>
    </>
  );
}
