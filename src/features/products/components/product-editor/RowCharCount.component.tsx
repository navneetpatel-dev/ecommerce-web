"use client";

import { useId } from "react";
import { CharacterCount } from "@/shared/components/forms/CharacterCount.component";

interface RowCharCountProps {
  value: string;
  max: number;
}

/** "12 / 160" under one input of a repeating row (highlight, specification). */
export function RowCharCount({ value, max }: RowCharCountProps) {
  const id = `count-${useId().replace(/[:«»]/g, "")}`;
  return <CharacterCount id={id} value={value} limits={{ min: 0, max }} />;
}
