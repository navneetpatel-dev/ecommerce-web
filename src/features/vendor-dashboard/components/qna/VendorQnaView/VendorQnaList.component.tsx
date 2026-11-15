"use client";

import type { ProductQuestion } from "@/shared/api/types";
import { VendorQnaCard } from "./VendorQnaCard.component";

interface VendorQnaListProps {
  questions: ProductQuestion[];
  onOpenAnswer: (questionId: string) => void;
}

export function VendorQnaList({ questions, onOpenAnswer }: VendorQnaListProps) {
  return (
    <>
      {questions.map((question) => (
        <VendorQnaCard
          key={question.id}
          question={question}
          onOpenAnswer={onOpenAnswer}
        />
      ))}
    </>
  );
}
