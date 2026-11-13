"use client";

import { MessagesSquare } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { useMyAnswersPage } from "../../hooks/mine/useMyQnaLists.hook";
import { MyQnaListShell } from "../../components/mine/MyQnaListShell.component";
import { MyAnswerList } from "../../components/mine/MyAnswerList.component";
import { QnaEditProvider } from "../../containers/edit/QnaEditProvider.container";

const EMPTY = {
  icon: MessagesSquare,
  heading: LABELS.noMyAnswers,
  message: LABELS.noMyAnswersHint,
};

/** Every answer the shopper wrote, with its question, status and Edit. */
export function MyAnswersPage() {
  const view = useMyAnswersPage();
  return (
    <QnaEditProvider>
      <MyQnaListShell
        title={LABELS.myAnswersTitle}
        subtitle={LABELS.myAnswersSubtitle}
        state={view.state}
        errorFallback={LABELS.couldNotLoadMyAnswers}
        empty={EMPTY}
      >
        <MyAnswerList answers={view.answers} />
      </MyQnaListShell>
    </QnaEditProvider>
  );
}
