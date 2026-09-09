import { TableCellImage } from "@/shared/components/TableCellImage.component";
import { adminDataListViewStyles } from "../../../styles/shared/adminDataListView.styles";

interface TableCellImagesListProps {
  urls: string[];
  alt: string;
}

export function TableCellImagesList({ urls, alt }: TableCellImagesListProps) {
  const visibleUrls = urls.slice(0, 4);

  return (
    <div className={adminDataListViewStyles.imageList}>
      {visibleUrls.map((url) => (
        <TableCellImage key={url} src={url} alt={alt} />
      ))}
    </div>
  );
}
