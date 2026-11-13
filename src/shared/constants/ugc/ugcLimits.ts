/**
 * Length limits for shopper-written content. Mirrors the API
 * (`backend/src/core/constants/ugcLimits.ts`); change both together.
 */
export const UGC_LIMITS = {
  question: { min: 10, max: 300 },
  answer: { min: 3, max: 1000 },
  reviewTitle: { min: 0, max: 100 },
  reviewBody: { min: 20, max: 2000 },
} as const;

export type UgcLimit = { min: number; max: number };
