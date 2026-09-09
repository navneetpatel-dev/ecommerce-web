import { MediaImage } from "@/shared/components/MediaImage.component";
import { categoryCardStyles } from "../../styles/browse/categoryCard.styles";
import { CategoryMosaicCell } from "./CategoryMosaicCell.component";

interface CategoryMosaicProps {
  urls: string[];
}

export function CategoryMosaic({ urls }: CategoryMosaicProps) {
  if (urls.length === 1) {
    return (
      <MediaImage
        src={urls[0]}
        alt=""
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
        imageClassName={categoryCardStyles.mosaicImage}
      />
    );
  }

  const cells = [...urls];
  while (cells.length < 4) {
    cells.push(cells[cells.length % urls.length]!);
  }

  return (
    <div className={categoryCardStyles.mosaicGrid}>
      {cells.slice(0, 4).map((url, index) => (
        <CategoryMosaicCell key={`${url}-${index}`} url={url} />
      ))}
    </div>
  );
}
