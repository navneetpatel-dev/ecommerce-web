/** Product Q&A endpoints — mounted under /api/product-qna on the backend. */
export const productQnaRoutes = {
  ask: "/api/product-qna/questions",
  forProduct: (productId: string) =>
    `/api/product-qna/products/${productId}/questions`,
  answer: (questionId: string) =>
    `/api/product-qna/questions/${questionId}/answers`,
  moderate: (questionId: string) =>
    `/api/product-qna/questions/${questionId}/status`,
  moderation: "/api/product-qna/moderation",
  vendorMe: "/api/product-qna/questions/vendor/me",
};
