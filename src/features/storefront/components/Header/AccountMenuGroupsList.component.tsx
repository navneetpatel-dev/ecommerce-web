import { LogOut } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import type { AccountMenuGroup } from "../../constants/header/accountMenuGroups";
import { headerStyles as styles } from "../../styles/header/header.styles";
import { AccountMenuLinksList } from "./AccountMenuLinksList.component";

interface AccountMenuGroupsListProps {
  groups: readonly AccountMenuGroup[];
  onNavigate: () => void;
  onSignOut: () => void;
  isSigningOut: boolean;
}

/** The account dropdown body: titled link groups, then Sign out. */
export function AccountMenuGroupsList({
  groups,
  onNavigate,
  onSignOut,
  isSigningOut,
}: AccountMenuGroupsListProps) {
  return (
    <div className={styles.menuGroups}>
      {groups.map((group) => (
        <section
          key={group.title}
          aria-label={group.title}
          className={styles.menuGroup}
        >
          <p className={styles.menuGroupTitle} aria-hidden>
            {group.title}
          </p>
          <AccountMenuLinksList links={group.links} onNavigate={onNavigate} />
        </section>
      ))}
      <button
        type="button"
        onClick={onSignOut}
        disabled={isSigningOut}
        className={styles.menuSignOut}
      >
        <LogOut className={styles.menuSignOutIcon} aria-hidden />
        {LABELS.signOut}
      </button>
    </div>
  );
}
