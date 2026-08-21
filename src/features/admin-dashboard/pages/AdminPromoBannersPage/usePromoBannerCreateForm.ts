"use client";

import { useMemo, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  PROMO_BANNER_LINK_TYPE,
  PROMO_BANNER_STATUS,
  type PromoBannerLinkType,
  type PromoBannerStatus,
} from "@/shared/constants/statuses";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/firstMissingRequiredHint";

function newDraftId() {
  return crypto.randomUUID();
}

export function usePromoBannerCreateForm() {
  const [draftId, setDraftId] = useState(newDraftId);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<PromoBannerLinkType>(
    PROMO_BANNER_LINK_TYPE.URL,
  );
  const [linkTargetId, setLinkTargetId] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [status, setStatus] = useState<PromoBannerStatus>(
    PROMO_BANNER_STATUS.DRAFT,
  );
  const [priority, setPriority] = useState("0");

  const resetForm = () => {
    setDraftId(newDraftId());
    setTitle("");
    setImageUrl(null);
    setLinkType(PROMO_BANNER_LINK_TYPE.URL);
    setLinkTargetId("");
    setLinkUrl("");
    setStatus(PROMO_BANNER_STATUS.DRAFT);
    setPriority("0");
  };

  const requiredChecks = useMemo(
    () => [
      { ok: Boolean(title.trim()), message: LABELS.enterPromoBannerTitle },
      { ok: Boolean(imageUrl), message: LABELS.uploadPromoBannerImage },
      {
        ok:
          linkType === PROMO_BANNER_LINK_TYPE.URL
            ? Boolean(linkUrl.trim())
            : Boolean(linkTargetId.trim()),
        message:
          linkType === PROMO_BANNER_LINK_TYPE.URL
            ? LABELS.enterPromoBannerLinkUrl
            : LABELS.enterPromoBannerLinkTarget,
      },
    ],
    [title, imageUrl, linkType, linkUrl, linkTargetId],
  );
  const canSubmit = allRequiredFieldsMet(requiredChecks);
  const disableHint = firstMissingRequiredHint(requiredChecks) ?? "";

  return {
    draftId,
    title,
    setTitle,
    imageUrl,
    setImageUrl,
    linkType,
    setLinkType,
    linkTargetId,
    setLinkTargetId,
    linkUrl,
    setLinkUrl,
    status,
    setStatus,
    priority,
    setPriority,
    resetForm,
    canSubmit,
    disableHint,
  };
}
