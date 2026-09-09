"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { searchHelp } from "../../../constants/helpContent";
import { BrowseTopicsSection } from "./BrowseTopicsSection.component";
import { ContactSection } from "./ContactSection.component";
import { QuickLinksSection } from "./QuickLinksSection.component";
import { SearchResultsSection } from "./SearchResultsSection.component";
import { helpHomeViewStyles as styles } from "../../../styles/home/helpHomeView.styles";

export function HelpHomeView() {
  const [query, setQuery] = useState("");
  const isSearching = query.trim().length >= 2;
  const results = useMemo(
    () => (isSearching ? searchHelp(query) : []),
    [isSearching, query],
  );
  const mainSection = isSearching ? (
    <SearchResultsSection query={query} results={results} />
  ) : (
    <>
      <QuickLinksSection />
      <BrowseTopicsSection />
    </>
  );

  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.heroGlow} />

      <div className={styles.container}>
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          className={styles.header}
        >
          <TextEyebrow brand>{LABELS.helpSupportEyebrow}</TextEyebrow>
          <h1
            className={styles.title}
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            {LABELS.helpCenter}
          </h1>
          <p className={styles.subtitle}>{LABELS.helpCenterIntro}</p>
        </motion.header>

        <div className={styles.searchWrapper}>
          <Search size={16} strokeWidth={1.5} className={styles.searchIcon} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={LABELS.helpSearchPlaceholder}
            className={styles.searchInput}
            aria-label={LABELS.helpSearchAriaLabel}
          />
        </div>

        {mainSection}

        <ContactSection />
      </div>
    </div>
  );
}
