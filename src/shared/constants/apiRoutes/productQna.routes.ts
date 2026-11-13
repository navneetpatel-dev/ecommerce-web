/** Product Q&A endpoints — mounted under /api/product-qna on the backend. */
export const productQnaRoutes = {
  ask: "/api/product-qna/questions",
  forProduct: (productId: string) =>
    `/api/product-qna/products/${productId}/questions`,
  canAnswer: (productId: string) =>
    `/api/product-qna/products/${productId}/can-answer`,
  answer: (questionId: string) =>
    `/api/product-qna/questions/${questionId}/answers`,
  moderate: (questionId: string) =>
    `/api/product-qna/questions/${questionId}/status`,
  moderation: "/api/product-qna/moderation",
  myQuestions: "/api/product-qna/questions/mine",
  myAnswers: "/api/product-qna/answers/mine",
  /** Owner edits. */
  updateQuestion: (questionId: string) =>
    `/api/product-qna/questions/${questionId}`,
  updateAnswer: (answerId: string) => `/api/product-qna/answers/${answerId}`,
  vendorMe: "/api/product-qna/questions/vendor/me",
};
