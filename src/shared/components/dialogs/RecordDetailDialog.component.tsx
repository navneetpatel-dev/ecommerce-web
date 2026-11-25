"use client";

import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { RecordDetailSkeleton } from "@/shared/components/dialogs/RecordDetailSkeleton.component";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import {
  buildRecordDetailFields,
  getRecordDetailTitle,
} from "@/shared/utils/formatting/recordDetails";
import { categorizeDetailFields } from "@/shared/utils/formatting/recordDetailCategorize";
import { recordDetailDialogStyles as styles } from "../../styles/dialogs/dialogComponents.styles";
import { RecordDetailHeader } from "./RecordDetailHeader.component";
import { RecordDetailHighlights } from "./RecordDetailHighlights.component";
import { RecordDetailSpotlight } from "./RecordDetailSpotlight.component";
import {
  RecordDetailFieldGrid,
  type RecordDetailFieldLinks,
} from "./RecordDetailFieldGrid.component";
import { RecordDetailObjectView } from "./RecordDetailObjectView.component";
import { RecordDetailListView } from "./RecordDetailListView.component";
import { RecordDetailImage } from "./RecordDetailImage.component";
import { RecordDetailSystemSection } from "./RecordDetailSystemSection.component";
import {
  isProductRecord,
  ProductRecordDetailView,
} from "./product-view/ProductRecordDetailView.component";

interface RecordDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: Record<string, unknown> | null;
  loading?: boolean;
  error?: string | null;
  fieldLinks?: RecordDetailFieldLinks;
}

export function RecordDetailDialog({
  open,
  onOpenChange,
  record,
  loading = false,
  error = null,
  fieldLinks,
}: RecordDetailDialogProps) {
  const isProduct = useMemo(
    () => (record ? isProductRecord(record) : false),
    [record],
  );

  const fields = useMemo(
    () => (record ? buildRecordDetailFields(record) : []),
    [record],
  );
  const title = useMemo(
    () => (record ? getRecordDetailTitle(record) : LABELS.recordDetails),
    [record],
  );

  const { media, spotlight, properties, objects, arrays, system } = useMemo(
    () => categorizeDetailFields(fields),
    [fields],
  );

  const isEmpty = fields.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.content}>
        {record && !isProduct && (
          <RecordDetailHeader record={record} title={title} />
        )}

        <div className={styles.scrollBody}>
          {loading ? (
            <RecordDetailSkeleton />
          ) : isEmpty ? (
            <p className={styles.emptyText}>{LABELS.noDetailFields}</p>
          ) : isProduct ? (
            <ProductRecordDetailView product={record!} />
          ) : (
            <>
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-caption text-amber-700 dark:text-amber-400">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>Showing cached summary ({error})</span>
                </div>
              )}

              {media.map((m) => (
                <div key={m.key} className="space-y-2">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    {m.label}
                  </span>
                  <RecordDetailImage
                    value={m.value}
                    alt={m.label}
                    fieldKey={m.key}
                  />
                </div>
              ))}

              {record && <RecordDetailHighlights record={record} />}

              <RecordDetailSpotlight fields={spotlight} />

              <RecordDetailFieldGrid
                fields={properties}
                record={record}
                fieldLinks={fieldLinks}
                onNavigate={() => onOpenChange(false)}
              />

              {objects.map((obj) => (
                <RecordDetailObjectView
                  key={obj.key}
                  value={obj.value as Record<string, unknown>}
                  fieldKey={obj.key}
                />
              ))}

              {arrays.map((arr) => (
                <RecordDetailListView
                  key={arr.key}
                  items={arr.value as unknown[]}
                  fieldKey={arr.key}
                />
              ))}

              <RecordDetailSystemSection fields={system} />
            </>
          )}
        </div>

        <div className={styles.footer}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {LABELS.done}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
