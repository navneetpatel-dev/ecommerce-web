"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  notificationsApi,
  type EmailAudience,
  type EmailTemplateSummary,
} from "../../api/notifications/notifications.api";

export type EmailTemplateGroup = {
  key: string;
  audience: EmailAudience;
  group: string;
  templates: EmailTemplateSummary[];
};

/** Groups the catalogue by audience and group, in the order the API lists them. */
function groupTemplates(
  templates: EmailTemplateSummary[],
): EmailTemplateGroup[] {
  const groups = new Map<string, EmailTemplateGroup>();
  for (const template of templates) {
    const key = `${template.audience}:${template.group}`;
    const existing = groups.get(key);
    if (existing) existing.templates.push(template);
    else
      groups.set(key, {
        key,
        audience: template.audience,
        group: template.group,
        templates: [template],
      });
  }
  return [...groups.values()];
}

/** The email catalogue: pick a template, preview it (light or dark), and send yourself a test. */
export function useEmailTemplatesPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notice, setNotice] = useState<string | null>(null);

  const catalogue = useQuery({
    queryKey: ["admin", "email-templates"],
    queryFn: () => notificationsApi.templates(),
    staleTime: 5 * 60 * 1000,
  });
  const preview = useQuery({
    queryKey: ["admin", "email-templates", "preview", selectedType, theme],
    queryFn: () => notificationsApi.previewTemplate(selectedType ?? "", theme),
    enabled: Boolean(selectedType),
  });
  const sendTest = useMutation({
    mutationFn: () => notificationsApi.sendTemplateTest(selectedType ?? ""),
    onSuccess: (result) =>
      setNotice(
        formatLabel(LABELS.emailTemplatesTestSent, { email: result.sentTo }),
      ),
    onError: () => setNotice(null),
  });

  const groups = useMemo(
    () => groupTemplates(catalogue.data ?? []),
    [catalogue.data],
  );
  const selected = useMemo(
    () =>
      catalogue.data?.find((template) => template.type === selectedType) ??
      null,
    [catalogue.data, selectedType],
  );

  const handleSelect = (type: string) => {
    setSelectedType(type);
    setNotice(null);
    sendTest.reset();
  };
  const handleLight = () => setTheme("light");
  const handleDark = () => setTheme("dark");
  const handleSendTest = () => sendTest.mutate();

  return {
    groups,
    selected,
    selectedType,
    theme,
    notice,
    isLoading: catalogue.isPending,
    loadError: catalogue.isError ? LABELS.emailTemplatesLoadFailed : null,
    previewHtml: preview.data?.html ?? null,
    previewSubject: preview.data?.subject ?? selected?.subject ?? null,
    isPreviewLoading: preview.isFetching,
    previewError: preview.isError ? LABELS.emailTemplatesPreviewFailed : null,
    isSendingTest: sendTest.isPending,
    testError: sendTest.isError
      ? getApiErrorMessage(sendTest.error, LABELS.emailTemplatesTestFailed)
      : null,
    handleSelect,
    handleLight,
    handleDark,
    handleSendTest,
  };
}
