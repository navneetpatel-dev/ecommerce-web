import Link from "next/link";
import { HelpContactForm } from "@/features/help";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";

interface ContactViewProps {
  supportEmail: string | null;
  supportHours: string | null;
  isLoading: boolean;
}

export function ContactView({
  supportEmail,
  supportHours,
  isLoading,
}: ContactViewProps) {
  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-2">
      <section className="space-y-4">
        <h1 className="text-[1.75rem] font-semibold text-ink">
          {LABELS.contactUsHeading}
        </h1>
        <p className="text-body text-ink-muted">{LABELS.contactUsIntro}</p>
        <HelpContactForm />
      </section>
      <aside className="space-y-3 rounded-md border border-line bg-surface p-5">
        <h2 className="text-[1.125rem] font-semibold text-ink">
          {LABELS.contactSupportDetails}
        </h2>
        {isLoading && (
          <p className="text-body text-ink-muted">
            {LABELS.contactLoadingDetails}
          </p>
        )}
        {!isLoading && (
          <>
            <p className="text-body text-ink-muted">
              {formatLabel(LABELS.contactEmailLabel, {
                email: supportEmail ?? LABELS.contactNotConfigured,
              })}
            </p>
            <p className="text-body text-ink-muted">
              {formatLabel(LABELS.contactHoursLabel, {
                hours: supportHours ?? LABELS.contactNotConfigured,
              })}
            </p>
          </>
        )}
        <p className="text-body-sm text-ink-muted">
          {LABELS.contactPreferSelfServe}{" "}
          <Link
            href={PATHS.help}
            className="text-brand underline-offset-2 hover:underline"
          >
            {LABELS.helpCenter}
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
