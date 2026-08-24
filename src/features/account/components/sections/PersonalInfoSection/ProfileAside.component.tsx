"use client";

import { Mail, UserRound } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import type { AccountProfile } from "../../../types";
import { EmailVerificationStatus } from "../../EmailVerificationStatus.component";

interface ProfileAsideProps {
  profile: Pick<AccountProfile, "name" | "phone" | "email" | "emailVerified">;
  isWorkspace: boolean;
}

export function ProfileAside({ profile, isWorkspace }: ProfileAsideProps) {
  return (
    <aside className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
        <TextEyebrow>{LABELS.personalInfoProfileEyebrow}</TextEyebrow>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          {LABELS.personalInfoProfileHint}
        </p>
      </div>

      <div className="space-y-4 px-5 py-5 md:px-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted">
            <UserRound size={18} strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
              {LABELS.personalInfoAccountHolder}
            </p>
            <p className="mt-1 text-body font-medium text-ink">
              {profile.name}
            </p>
            {profile.phone ? (
              <p className="mt-0.5 text-body-sm text-ink-muted">
                {profile.phone}
              </p>
            ) : (
              <p className="mt-0.5 text-body-sm text-ink-faint">
                {LABELS.personalInfoNoPhone}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted">
            <Mail size={18} strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
              {LABELS.personalInfoEmailStatus}
            </p>
            <p className="mt-1 break-all text-body font-medium text-ink">
              {profile.email}
            </p>
            <div className="mt-2">
              <EmailVerificationStatus emailVerified={profile.emailVerified} />
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <p className="text-body-sm leading-6 text-ink-muted">
            {isWorkspace
              ? LABELS.emailFixedWorkspace
              : LABELS.emailFixedStorefront}
          </p>
        </div>
      </div>
    </aside>
  );
}
