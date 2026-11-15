/** Moderating reviews / questions / answers — new posts and edits of approved ones. Subset of LABELS. */
export const ugcModerationLabels = {
  // Column headers (admin tables read LABELS[columnKey]).
  submission: "Type",
  previousBody: "Live version",
  kind: "Kind",
  text: "Text",
  previousText: "Live version",
  questionText: "On question",
  authorName: "Author",
  // Cell values.
  submissionNew: "New",
  submissionEdit: "Edit of approved",
  qnaKindQuestion: "Question",
  qnaKindAnswer: "Answer",
  // Page + confirmations.
  adminQnaModerationTitle: "Questions & answers",
  confirmApproveEditTitle: "Approve this edit?",
  confirmApproveEditBody:
    'Replace the live version of "{name}" with this edit? Shoppers will see the edited text.',
  confirmRejectEditTitle: "Reject this edit?",
  confirmRejectEditBody:
    'Reject the edit of "{name}"? The approved version stays public and the author is told the edit was declined.',
  confirmApproveQnaTitle: "Publish this {kind}?",
  confirmApproveQnaBody: 'Publish "{name}" for shoppers to see?',
  confirmRejectQnaTitle: "Reject this {kind}?",
  confirmRejectQnaBody: 'Reject "{name}"? It will not appear publicly.',
} as const;
