import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { notFoundStyles as styles } from "@/shared/styles/notFound.styles";

/**
 * The storefront 404 body. C-09: a way on besides Home — search (a plain GET form, so it
 * works before scripts load), Categories and All shops.
 */
export function NotFoundView() {
  return (
    <div className={styles.container}>
      <PackageSearch size={160} className={styles.icon} strokeWidth={1} />
      <h1 className={styles.heading}>{LABELS.pageNotFound}</h1>
      <p className={styles.body}>{LABELS.pageNotFoundBody}</p>
      <form
        action={PATHS.products}
        method="get"
        role="search"
        className={styles.searchForm}
      >
        <Input
          type="search"
          name="search"
          aria-label={LABELS.notFoundSearchLabel}
          placeholder={LABELS.notFoundSearchPlaceholder}
          className={styles.searchInput}
        />
        <Button type="submit" variant="outline">
          {LABELS.notFoundSearch}
        </Button>
      </form>
      <Button asChild>
        <Link href={PATHS.home}>{LABELS.goToHomepage}</Link>
      </Button>
      <nav aria-label={LABELS.pageNotFound} className={styles.links}>
        <Link href={PATHS.categories} className={styles.link}>
          {LABELS.categories}
        </Link>
        <Link href={PATHS.vendors} className={styles.link}>
          {LABELS.allShops}
        </Link>
      </nav>
    </div>
  );
}
