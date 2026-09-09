"use client";

import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { productDetailsMiscStyles } from "./productDetailsMisc.styles";

interface ProductSizeChartButtonProps {
  url: string;
  productName: string;
}

export function ProductSizeChartButton({
  url,
  productName,
}: ProductSizeChartButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={productDetailsMiscStyles.sizeChartButton}
        >
          {LABELS.sizeChart}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={productDetailsMiscStyles.sizeChartDialogContent}
      >
        <DialogHeader>
          <DialogTitle>{LABELS.sizeChart}</DialogTitle>
        </DialogHeader>
        <Image
          src={url}
          alt={formatLabel(LABELS.sizeChartForProduct, { name: productName })}
          width={1200}
          height={1600}
          sizes="(min-width: 48rem) 42rem, 100vw"
          className={productDetailsMiscStyles.sizeChartImage}
        />
      </DialogContent>
    </Dialog>
  );
}
