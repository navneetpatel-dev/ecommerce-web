"use client";

import type { RefObject } from "react";
import { Camera, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { FormError } from "@/shared/components/FormError.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { AccountProfile } from "../../../types";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

interface ProfileCardProps {
  profile: Pick<
    AccountProfile,
    "name" | "email" | "emailVerified" | "avatarUrl"
  >;
  memberSince: string | null;
  avatarSrc: string | undefined;
  uploadPending: boolean;
  uploadError: Error | null;
  localError: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelected: (file: File | null) => void;
}

export function ProfileCard({
  profile,
  memberSince,
  avatarSrc,
  uploadPending,
  uploadError,
  localError,
  fileInputRef,
  onFileSelected,
}: ProfileCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
      className="relative border border-line bg-surface p-6 shadow-elevation-1 md:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent"
      />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative inline-flex shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadPending}
            className="group relative h-auto min-h-0 max-h-none w-auto rounded-full p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label={LABELS.uploadProfilePhoto}
          >
            <Avatar className="h-24 w-24 border border-line text-[1.25rem] font-semibold text-ink">
              {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
              <AvatarFallback className="bg-brand-subtle text-ink">
                {initials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center border border-line bg-surface text-ink-muted transition-colors group-hover:text-brand">
              <Camera size={14} strokeWidth={1.5} />
            </span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="min-w-0">
          <TextEyebrow brand>Profile</TextEyebrow>
          <h2
            className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            {profile.name}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-body text-ink-muted">{profile.email}</p>
            {profile.emailVerified ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 size={12} />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline">Unverified</Badge>
            )}
          </div>
          {memberSince ? (
            <p className="mt-2 text-body-sm text-ink-faint">
              Member since {memberSince}
            </p>
          ) : null}
          <p className="mt-3 text-body-sm text-ink-muted">
            {LABELS.uploadProfilePhotoHint}
          </p>
          <FormError
            error={uploadError ?? (localError ? new Error(localError) : null)}
            fallback={LABELS.uploadFailed}
          />
        </div>
      </div>
    </motion.section>
  );
}
