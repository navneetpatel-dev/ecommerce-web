"use client";

import { Mail, Sparkles } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import type { EmailTemplateGroup } from "../../hooks/notifications/useEmailTemplatesPage.hook";
import { emailTemplatesStyles as styles } from "../../styles/notifications/emailTemplates.styles";

interface EmailTemplateEmptyStateProps {
  groups: EmailTemplateGroup[];
  onSelect: (type: string) => void;
}

const FEATURED_TYPES = [
  "WELCOME",
  "ORDER_CONFIRMATION",
  "PASSWORD_RESET",
  "ADMIN_DAILY_DIGEST",
] as const;

export function EmailTemplateEmptyState({
  groups,
  onSelect,
}: EmailTemplateEmptyStateProps) {
  const allTemplates = groups.flatMap((g) => g.templates);
  const totalCount = allTemplates.length;

  const audienceCounts = groups.reduce(
    (acc, g) => {
      acc[g.audience] = (acc[g.audience] ?? 0) + g.templates.length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const quickPicks = FEATURED_TYPES.map((type) =>
    allTemplates.find((t) => t.type === type),
  ).filter((t): t is NonNullable<typeof t> => Boolean(t));

  const fallbackPicks =
    quickPicks.length > 0 ? quickPicks : allTemplates.slice(0, 4);

  return (
    <div
      className={`${styles.previewPanel} flex flex-col items-center justify-center px-6 py-16 text-center min-h-[28rem]`}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand border border-brand/20">
        <Mail className="size-6" aria-hidden="true" />
      </div>
      <h2 className="font-display text-lg font-medium text-ink">
        {LABELS.emailTemplatesSelectPrompt}
      </h2>
      <p className="mt-1.5 max-w-md text-body-sm text-ink-muted">
        Choose any transactional or marketing template from the list on the left
        to inspect its light and dark rendering or send yourself a test email.
      </p>

      {totalCount > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-caption text-ink-muted">
          <span className="rounded-full border border-line bg-paper px-3 py-1 font-medium text-ink">
            {totalCount} templates
          </span>
          {audienceCounts.customer ? (
            <span className="rounded-full border border-line bg-paper px-3 py-1">
              {audienceCounts.customer} {LABELS.emailTemplatesAudienceCustomer}
            </span>
          ) : null}
          {audienceCounts.vendor ? (
            <span className="rounded-full border border-line bg-paper px-3 py-1">
              {audienceCounts.vendor} {LABELS.emailTemplatesAudienceVendor}
            </span>
          ) : null}
          {audienceCounts.admin ? (
            <span className="rounded-full border border-line bg-paper px-3 py-1">
              {audienceCounts.admin} {LABELS.emailTemplatesAudienceAdmin}
            </span>
          ) : null}
        </div>
      )}

      {fallbackPicks.length > 0 && (
        <div className="mt-7 w-full max-w-lg border-t border-line/60 pt-5">
          <p className="mb-3 inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-wider text-ink-muted">
            <Sparkles className="size-3.5 text-brand" aria-hidden="true" />
            Quick preview
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {fallbackPicks.map((tpl) => (
              <button
                key={tpl.type}
                type="button"
                onClick={() => onSelect(tpl.type)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-paper px-3 py-1.5 text-body-xs font-medium text-ink hover:border-brand/50 hover:bg-brand-subtle transition-colors cursor-pointer"
              >
                <span className="font-mono text-[11px] text-brand">
                  {tpl.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
