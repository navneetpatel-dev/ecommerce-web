"use client";

import { useId } from "react";
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
import { useAccountMenu } from "../../hooks/header/useAccountMenu.hook";
import { AccountMenuGroupsList } from "./AccountMenuGroupsList.component";
import { ACCOUNT_TRIGGER_BOX } from "../../utils/header/headerShared";
import { headerStyles as styles } from "../../styles/header/header.styles";

interface AccountMenuProps {
  currentUser: CurrentUser;
}

export function AccountMenu({ currentUser }: AccountMenuProps) {
  const {
    accountMenuOpen,
    toggleAccountMenu,
    closeAccountMenu,
    accountMenuRef,
    triggerRef,
    fallbackLabel,
    accountGroups,
    signOut,
    isSigningOut,
  } = useAccountMenu(currentUser);
  const accountMenuId = useId();

  return (
    <div ref={accountMenuRef} className={styles.relativeWrapper}>
      {/* Disclosure, not a menu: the panel is a plain list of links reached by
          Tab, so it must not advertise menu arrow-key semantics it does not
          implement (WAI-ARIA APG). */}
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        onClick={toggleAccountMenu}
        className={cn(
          ACCOUNT_TRIGGER_BOX,
          styles.triggerSvgSize,
          styles.triggerSolid,
        )}
        title={currentUser.name}
        aria-expanded={accountMenuOpen}
        aria-controls={accountMenuId}
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
            styles.accountChevronSolid,
            accountMenuOpen && styles.accountChevronOpen,
          )}
        />
      </Button>

      {accountMenuOpen ? (
        <div className={styles.dropdown} role="presentation">
          <div id={accountMenuId} className={styles.dropdownMenu}>
            <div className={styles.userHeader}>
              <p className={styles.userName}>{currentUser.name}</p>
              <p className={styles.userEmail}>{currentUser.email}</p>
            </div>

            <AccountMenuGroupsList
              groups={accountGroups}
              onNavigate={closeAccountMenu}
              onSignOut={signOut}
              isSigningOut={isSigningOut}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
