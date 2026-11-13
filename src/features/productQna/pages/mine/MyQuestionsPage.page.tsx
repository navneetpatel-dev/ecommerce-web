"use client";

import { MessageCircleQuestion } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { useMyQuestionsPage } from "../../hooks/mine/useMyQnaLists.hook";
import { MyQnaListShell } from "../../components/mine/MyQnaListShell.component";
import { MyQuestionList } from "../../components/mine/MyQuestionList.component";
import { QnaEditProvider } from "../../containers/edit/QnaEditProvider.container";

const EMPTY = {
  icon: MessageCircleQuestion,
  heading: LABELS.noMyQuestions,
  message: LABELS.noMyQuestionsHint,
};

/** Every question the shopper asked, with status, answer count and Edit (while unanswered). */
export function MyQuestionsPage() {
  const view = useMyQuestionsPage();
  return (
    <QnaEditProvider>
      <MyQnaListShell
        title={LABELS.myQuestionsTitle}
        subtitle={LABELS.myQuestionsSubtitle}
        state={view.state}
        errorFallback={LABELS.couldNotLoadMyQuestions}
        empty={EMPTY}
      >
        <MyQuestionList questions={view.questions} />
      </MyQnaListShell>
    </QnaEditProvider>
  );
}
