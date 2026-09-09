"use client";

import { cn } from "@/shared/utils/cn";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { motion } from "motion/react";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth.store";
import { isWorkspaceRole } from "@/shared/utils/roles";
import type { AccountNavItem, AccountSectionId } from "../types";

interface AccountLayoutProps {
  sections: AccountNavItem[];
  activeSection: AccountSectionId;
  onSectionChange: (id: AccountSectionId) => void;
  children: React.ReactNode;
}

export function AccountLayout({
  sections,
  activeSection,
  onSectionChange,
  children,
}: AccountLayoutProps) {
  const role = useAuthStore((s) => s.currentUser?.role);
  const isWorkspace = isWorkspaceRole(role);
  const active = sections.find((s) => s.id === activeSection) ?? sections[0]!;

  const rootClassName = cn("relative", isWorkspace ? "min-w-0" : undefined);
  const showAmbientGradient = !isWorkspace;
  const ambientGradient = showAmbientGradient ? (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_8%,transparent),transparent_60%)]"
    />
  ) : null;
  const contentClassName = cn(
    "relative",
    isWorkspace ? "w-full min-w-0" : "storefront-container py-6 md:py-8",
  );
  const headerClassName = cn(isWorkspace ? "mb-6" : "mb-8");
  const settingsHint = isWorkspace
    ? LABELS.accountSettingsHintWorkspace
    : LABELS.accountSettingsHintCustomer;

  const mobileNavItems = sections.map((section) => {
    const selected = section.id === activeSection;
    const Icon = section.icon;
    const ariaCurrent = selected ? "page" : undefined;
    const buttonClassName = cn(
      "h-auto min-h-0 max-h-none gap-2 px-3.5 py-2 text-body-sm",
      selected
        ? "border-line-strong bg-paper text-brand shadow-[inset_0_-2px_0_0_var(--brand)] hover:bg-paper hover:text-brand"
        : "border-line text-ink-muted hover:border-ink/25 hover:text-ink",
    );
    return (
      <li key={section.id}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSectionChange(section.id)}
          aria-current={ariaCurrent}
          className={buttonClassName}
        >
          <Icon size={15} strokeWidth={1.5} aria-hidden />
          {section.label}
        </Button>
      </li>
    );
  });

  const desktopNavItems = sections.map((section) => {
    const selected = section.id === activeSection;
    const Icon = section.icon;
    const ariaCurrent = selected ? "page" : undefined;
    const buttonClassName = cn(
      "h-auto min-h-0 max-h-none w-full items-start gap-3 rounded-none px-4 py-3.5 text-left font-normal",
      selected
        ? "bg-paper shadow-[inset_3px_0_0_0_var(--brand)] hover:bg-paper"
        : "hover:bg-paper/70",
    );
    const iconClassName = cn(
      "mt-0.5 shrink-0",
      selected ? "text-brand" : "text-ink-muted",
    );
    const labelClassName = cn(
      "block text-[0.875rem] font-medium",
      selected ? "text-ink" : "text-ink-muted",
    );
    return (
      <li key={section.id}>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onSectionChange(section.id)}
          aria-current={ariaCurrent}
          className={buttonClassName}
        >
          <Icon
            size={16}
            strokeWidth={1.5}
            className={iconClassName}
            aria-hidden
          />
          <span className="min-w-0">
            <span className={labelClassName}>{section.label}</span>
            <span className="mt-0.5 block text-[0.75rem] leading-snug text-ink-faint">
              {section.description}
            </span>
          </span>
        </Button>
      </li>
    );
  });

  return (
    <div className={rootClassName}>
      {ambientGradient}

      <div className={contentClassName}>
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          className={headerClassName}
        >
          <TextEyebrow brand>{LABELS.account}</TextEyebrow>
          <h1
            className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            {LABELS.settings}
          </h1>
          <p className="mt-2 max-w-xl text-body text-ink-muted">
            {settingsHint}
          </p>
        </motion.header>

        <nav
          aria-label="Account sections"
          className="scrollbar-none mb-6 -mx-1 overflow-x-auto overscroll-x-contain pb-1 lg:hidden"
        >
          <ul className="flex min-w-max gap-1 px-1">{mobileNavItems}</ul>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden lg:block">
            <nav
              aria-label="Account sections"
              className="sticky top-24 isolate border border-line bg-paper shadow-elevation-1"
            >
              <ul className="divide-y divide-line">{desktopNavItems}</ul>
            </nav>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 lg:hidden">
              <TextEyebrow>{active.label}</TextEyebrow>
              <p className="mt-1 text-[0.875rem] text-ink-muted">
                {active.description}
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
