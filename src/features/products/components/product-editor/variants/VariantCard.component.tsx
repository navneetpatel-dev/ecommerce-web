"use client";

import type { ReactNode } from "react";
import { variantsEditorStyles } from "../../../styles/product-editor/variantsEditor.styles";

interface VariantCardProps {
  title: string;
  actions: ReactNode;
  children: ReactNode;
}

/** One variant: a title and its actions on top, the fields below. */
export function VariantCard({ title, actions, children }: VariantCardProps) {
  return (
    <section className={variantsEditorStyles.card}>
      <header className={variantsEditorStyles.cardHeader}>
        <h4 className={variantsEditorStyles.cardTitle}>{title}</h4>
        <div className={variantsEditorStyles.cardActions}>{actions}</div>
      </header>
      {children}
    </section>
  );
}
