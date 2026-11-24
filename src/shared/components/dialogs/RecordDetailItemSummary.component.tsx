"use client";

import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import {
  fieldLabel,
  isMoneyKey,
} from "@/shared/utils/formatting/recordDetails";
import { extractImageUrls } from "@/shared/utils/media/imageField";

function getItemHeading(item: Record<string, unknown>): string | null {
  for (const k of [
    "productName",
    "name",
    "title",
    "businessName",
    "action",
    "code",
  ]) {
    const val = item[k];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return null;
}

function getItemImage(item: Record<string, unknown>): string | null {
  for (const k of ["imageUrl", "thumbnail", "image", "photoUrl", "url"]) {
    const val = item[k];
    if (typeof val === "string" && extractImageUrls(val).length > 0) {
      return val.trim();
    }
  }
  return null;
}

export function hasItemSummary(item: Record<string, unknown>): boolean {
  return Boolean(getItemHeading(item) || getItemImage(item));
}

export function RecordDetailItemSummary({
  item,
}: {
  item: Record<string, unknown>;
}) {
  const heading = getItemHeading(item);
  const imageUrl = getItemImage(item);
  const qty = item.quantity != null ? Number(item.quantity) : null;
  const price = item.displayUnitPrice ?? item.unitPrice ?? item.price;
  const lineTotal = item.lineTotal ?? item.total;

  const otherEntries = Object.entries(item).filter(
    ([k]) =>
      !k.endsWith("Id") &&
      k !== "id" &&
      k !== "productName" &&
      k !== "name" &&
      k !== "title" &&
      k !== "imageUrl" &&
      k !== "url" &&
      k !== "thumbnail" &&
      k !== "quantity" &&
      k !== "unitPrice" &&
      k !== "displayUnitPrice" &&
      k !== "price" &&
      k !== "lineTotal" &&
      k !== "total",
  );

  return (
    <div className="flex gap-3.5 items-start">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-line bg-paper">
        <MediaImage
          src={imageUrl}
          alt={heading ?? "Item image"}
          sizes="48px"
          imageClassName="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold text-ink text-body-sm">
            {heading ?? "Item"}
          </p>
          {lineTotal != null && (
            <span className="font-mono font-bold text-ink text-body-sm shrink-0">
              {formatInr(Number(lineTotal))}
            </span>
          )}
        </div>

        {qty != null && price != null && (
          <p className="text-[11px] text-ink-muted">
            <span className="font-medium text-ink">Qty: {qty}</span> ×{" "}
            {formatInr(Number(price))}
          </p>
        )}

        {otherEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {otherEntries.slice(0, 4).map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center rounded-md bg-paper px-2 py-0.5 text-[10px] text-ink-muted border border-line/70"
              >
                <strong className="mr-1 text-ink">{fieldLabel(k)}:</strong>{" "}
                {isMoneyKey(k)
                  ? formatInr(Number(v))
                  : typeof v === "object"
                    ? "..."
                    : String(v)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
