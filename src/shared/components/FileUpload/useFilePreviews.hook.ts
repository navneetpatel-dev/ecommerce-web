"use client";

import type {
  FileUploadProps,
  MultiProps,
  PreviewEntry,
  SingleProps,
} from "./types";

export function buildPreviewEntries(options: {
  props: FileUploadProps;
  isMultiple: boolean;
  previews: PreviewEntry[];
}): PreviewEntry[] {
  const { props, isMultiple, previews } = options;

  return isMultiple
    ? [
        ...((props as MultiProps).valueUrls ?? []).map((storedUrl) => {
          const known = previews.find((p) => p.storedUrl === storedUrl);
          return known ?? { storedUrl, displayUrl: storedUrl };
        }),
        ...previews.filter(
          (p) => !((props as MultiProps).valueUrls ?? []).includes(p.storedUrl),
        ),
      ]
    : (props as SingleProps).valueUrl
      ? [
          previews.find(
            (p) => p.storedUrl === (props as SingleProps).valueUrl,
          ) ?? {
            storedUrl: (props as SingleProps).valueUrl!,
            displayUrl: (props as SingleProps).valueUrl!,
          },
        ]
      : previews;
}
