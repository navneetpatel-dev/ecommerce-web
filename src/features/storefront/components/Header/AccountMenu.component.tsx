"use client";

import Link from "next/link";
import { ChevronDown, UserRound } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
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
import { headerStyles as styles } from "./header.styles";

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
      className={styles.relativeWrapper}
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
          styles.triggerSvgSize,
          isTransparent ? styles.triggerTransparent : styles.triggerSolid,
        )}
        title={currentUser.name}
        aria-haspopup="menu"
        aria-expanded={accountMenuOpen}
        aria-label={LABELS.openAccountMenu}
      >
        <Avatar className={styles.avatar}>
          {currentUser.avatarUrl ? (
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          ) : null}
          <AvatarFallback className={styles.avatarFallback}>
            {currentUser.avatarUrl ? (
              fallbackLabel
            ) : (
              <UserRound
                size={14}
                strokeWidth={1.8}
                className={styles.userRoundIcon}
                aria-hidden
              />
            )}
          </AvatarFallback>
        </Avatar>
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={cn(
            styles.accountChevron,
            isTransparent
              ? styles.accountChevronTransparent
              : styles.accountChevronSolid,
            accountMenuOpen && styles.accountChevronOpen,
          )}
        />
      </Button>

      {accountMenuOpen ? (
        <div className={styles.dropdown} role="presentation">
          <div role="menu" className={styles.dropdownMenu}>
            <div className={styles.userHeader}>
              <p className={styles.userName}>{currentUser.name}</p>
              <p className={styles.userEmail}>{currentUser.email}</p>
            </div>

            <div className={styles.linksList}>
              {accountLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={() => setAccountMenuOpen(false)}
                  className={styles.menuItem}
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
