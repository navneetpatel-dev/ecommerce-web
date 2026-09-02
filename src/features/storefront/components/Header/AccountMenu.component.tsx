"use client";

import Link from "next/link";
import { ChevronDown, UserRound } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { LABELS } from "@/shared/constants/labels";
import type { CurrentUser } from "@/shared/api/types";
import { useAccountMenu } from "./useAccountMenu.hook";
import { ACCOUNT_TRIGGER_BOX } from "./headerShared";

interface AccountMenuProps {
  currentUser: CurrentUser;
  isTransparent: boolean;
}

export function AccountMenu({ currentUser, isTransparent }: AccountMenuProps) {
  const {
    accountMenuOpen,
    setAccountMenuOpen,
    canHoverAccountMenu,
    accountMenuRef,
    fallbackLabel,
    accountLinks,
  } = useAccountMenu(currentUser);

  return (
    <div
      ref={accountMenuRef}
      className="relative"
      onMouseEnter={() => {
        if (canHoverAccountMenu) setAccountMenuOpen(true);
      }}
      onMouseLeave={() => {
        if (canHoverAccountMenu) setAccountMenuOpen(false);
      }}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={() => setAccountMenuOpen((open) => !open)}
        className={cn(
          ACCOUNT_TRIGGER_BOX,
          "[&_svg]:!size-[0.875rem] sm:[&_svg]:!size-3",
          isTransparent
            ? "border-paper/20 hover:bg-paper/10"
            : "border-line bg-surface hover:bg-paper",
        )}
        title={currentUser.name}
        aria-haspopup="menu"
        aria-expanded={accountMenuOpen}
        aria-label={LABELS.openAccountMenu}
      >
        <Avatar className="size-7 border-0 sm:size-8 sm:border sm:border-line/70">
          {currentUser.avatarUrl ? (
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          ) : null}
          <AvatarFallback className="flex items-center justify-center bg-brand-subtle text-[0.6875rem] font-semibold leading-none text-ink sm:text-[0.75rem]">
            {currentUser.avatarUrl ? (
              fallbackLabel
            ) : (
              <UserRound
                size={14}
                strokeWidth={1.8}
                className="block shrink-0"
                aria-hidden
              />
            )}
          </AvatarFallback>
        </Avatar>
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={cn(
            "hidden shrink-0 sm:block transition-transform",
            isTransparent ? "text-paper" : "text-ink-muted",
            accountMenuOpen && "rotate-180",
          )}
        />
      </Button>

      {accountMenuOpen ? (
        <div
          className="absolute right-0 top-full z-50 w-60 pt-2.5"
          role="presentation"
        >
          <div
            role="menu"
            className="overflow-hidden border border-line bg-surface shadow-elevation-4"
          >
            <div className="border-b border-line bg-paper/60 px-4 py-3">
              <p className="truncate text-[0.875rem] font-medium text-ink">
                {currentUser.name}
              </p>
              <p className="truncate text-[0.75rem] text-ink-muted">
                {currentUser.email}
              </p>
            </div>

            <div className="py-1.5">
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={() => setAccountMenuOpen(false)}
                  className="block px-4 py-2.5 text-[0.875rem] text-ink-muted transition-colors hover:bg-paper hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
