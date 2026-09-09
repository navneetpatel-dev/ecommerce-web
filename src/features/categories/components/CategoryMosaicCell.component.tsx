import { MediaImage } from "@/shared/components/MediaImage.component";
import { categoryCardStyles } from "./categoryCard.styles";

interface CategoryMosaicCellProps {
  url: string;
}

export function CategoryMosaicCell({ url }: CategoryMosaicCellProps) {
  return (
    <div className={categoryCardStyles.mosaicCell}>
      <MediaImage
        src={url}
        alt=""
        sizes="(max-width: 640px) 25vw, (max-width: 1280px) 12vw, 10vw"
        imageClassName={categoryCardStyles.mosaicImage}
      />
    </div>
  );
}
