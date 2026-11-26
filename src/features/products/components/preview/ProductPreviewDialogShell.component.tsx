"use client";

import type { MouseEvent, ReactNode } from "react";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { productPreviewStyles as styles } from "../../styles/preview/productPreview.styles";

interface ProductPreviewDialogShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A short note above the page (for example, that the product is not live yet). */
  notice?: ReactNode;
  children: ReactNode;
}

/**
 * A preview is not a page: a link in it (vendor, category, breadcrumb) must not take the person away
 * from the dialog they opened it from, which on the Products page is kept open by the address.
 */
export function keepPreviewOnPage(event: MouseEvent<HTMLElement>) {
  if ((event.target as HTMLElement).closest("a[href]")) event.preventDefault();
}

/**
 * The frame both customer previews share: a title with a one-line explanation, an optional notice,
 * and the product page. It is its own dialog, so closing it (the cross, Escape, a click outside)
 * closes only the preview, never a dialog it was opened from.
 */
export function ProductPreviewDialogShell({
  open,
  onOpenChange,
  notice,
  children,
}: ProductPreviewDialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>
            <Eye className={styles.titleIcon} aria-hidden />
            {LABELS.customerPreviewTitle}
          </DialogTitle>
          <DialogDescription className={styles.description}>
            {LABELS.customerPreviewBody}
          </DialogDescription>
        </DialogHeader>
        {notice}
        <div className={styles.page} onClickCapture={keepPreviewOnPage}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
