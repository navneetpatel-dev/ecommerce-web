"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { RecordDetailImage } from "@/shared/components/dialogs/RecordDetailImage.component";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import {
  fieldLabel,
  isMoneyKey,
} from "@/shared/utils/formatting/recordDetails";
import { extractImageUrls } from "@/shared/utils/media/imageField";
import { RecordDetailObjectView } from "./RecordDetailObjectView.component";

interface RecordDetailListViewProps {
  items: unknown[];
  nestedLevel?: number;
}

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

function renderItemSummary(item: Record<string, unknown>): ReactNode {
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
    <div className="flex gap-3 items-start">
      {imageUrl && (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-line bg-paper">
          <Image
            src={imageUrl}
            alt={heading ?? "Item image"}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          {heading ? (
            <p className="truncate font-medium text-ink text-body-sm">
              {heading}
            </p>
          ) : (
            <span className="text-body-xs text-ink-muted">Item</span>
          )}
          {lineTotal != null && (
            <span className="font-semibold text-ink text-body-sm shrink-0">
              {formatInr(Number(lineTotal))}
            </span>
          )}
        </div>

        {qty != null && price != null && (
          <p className="text-[11px] text-ink-muted">
            Qty: {qty} × {formatInr(Number(price))}
          </p>
        )}

        {otherEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {otherEntries.slice(0, 4).map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center rounded bg-paper/60 px-1.5 py-0.5 text-[10px] text-ink-muted border border-line/50"
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

export function RecordDetailListView({
  items,
  nestedLevel = 0,
}: RecordDetailListViewProps) {
  if (!Array.isArray(items) || items.length === 0) {
    return <span className="text-ink-faint">—</span>;
  }

  const allStrings = items.every((it) => typeof it === "string");
  if (allStrings) {
    const urls = extractImageUrls(items);
    if (urls.length === items.length) {
      return <RecordDetailImage value={items} alt="Images" />;
    }
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((val, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded bg-paper px-2 py-0.5 text-body-xs font-medium text-ink border border-line"
          >
            {String(val)}
          </span>
        ))}
      </div>
    );
  }

  const allPrimitives = items.every(
    (it) => typeof it === "string" || typeof it === "number",
  );
  if (allPrimitives) {
    return <span>{items.join(", ")}</span>;
  }

  return (
    <div className="space-y-2 w-full">
      {items.map((item, idx) => {
        if (!item || typeof item !== "object") {
          return (
            <span key={idx} className="text-body-xs text-ink">
              {String(item)}
            </span>
          );
        }

        const obj = item as Record<string, unknown>;
        const hasSummary = Boolean(getItemHeading(obj) || getItemImage(obj));

        return (
          <div
            key={idx}
            className="rounded-lg border border-line bg-surface p-2.5 space-y-1.5"
          >
            {hasSummary ? (
              renderItemSummary(obj)
            ) : (
              <RecordDetailObjectView
                value={obj}
                nestedLevel={nestedLevel + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
