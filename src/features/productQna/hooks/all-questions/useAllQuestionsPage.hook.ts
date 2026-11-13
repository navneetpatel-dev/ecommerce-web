"use client";

import { useParams } from "next/navigation";
import { useProduct } from "@/features/products";
import { useUrlQueryState } from "@/shared/hooks/navigation/useUrlQueryState.hook";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useProductQuestions } from "../../api/qna/productQna.queries";
import {
  ALL_QUESTIONS_PAGE_LIMIT,
  DEFAULT_QUESTION_SORT,
  QNA_QUERY,
} from "../../constants/productQna.constants";
import {
  EMPTY_QNA_SUMMARY,
  parseAnsweredFilter,
  parseQuestionSort,
} from "../../utils/productQna.utils";
import type {
  AnsweredFilter,
  QuestionSort,
} from "../../types/productQna.types";
import { useQuestionSearch } from "./useQuestionSearch.hook";

/** "All questions" page: product header, URL-driven search/filters, one page of questions. */
export function useAllQuestionsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const productQuery = useProduct(slug);
  const product = productQuery.data ?? null;
  const { searchParams, update } = useUrlQueryState();

  const q = searchParams.get(QNA_QUERY.q) ?? "";
  const answered = parseAnsweredFilter(searchParams.get(QNA_QUERY.answered));
  const sort =
    parseQuestionSort(searchParams.get(QNA_QUERY.sort)) ??
    DEFAULT_QUESTION_SORT;
  const page = Math.max(1, Number(searchParams.get(QNA_QUERY.page)) || 1);
  const search = useQuestionSearch(q, (value) =>
    update({ [QNA_QUERY.q]: value || null }),
  );

  const questionsQuery = useProductQuestions(
    product?.id ?? "",
    {
      page,
      limit: ALL_QUESTIONS_PAGE_LIMIT,
      q: q || undefined,
      answered,
      sort,
    },
    { enabled: Boolean(product?.id) },
  );
  const data = questionsQuery.data;
  const total = data?.total ?? 0;
  const from = total ? (page - 1) * ALL_QUESTIONS_PAGE_LIMIT + 1 : 0;

  return {
    product,
    productId: product?.id ?? "",
    productHref: PATHS.product(slug),
    productImage:
      product?.images?.find((image) => image.isPrimary)?.url ??
      product?.images?.[0]?.url ??
      null,
    title: formatLabel(LABELS.allQuestionsFor, { name: product?.name ?? "" }),
    isProductLoading: productQuery.isLoading,
    // A failed request is not a missing product: offer a retry only for the former.
    productLoadFailed: productQuery.isError && !product,
    isProductMissing: !productQuery.isLoading && !product,
    retryProduct: () => void productQuery.refetch(),
    questions: data?.items ?? [],
    summary: data?.summary ?? EMPTY_QNA_SUMMARY,
    isLoading: Boolean(product) && !data && !questionsQuery.isError,
    isFetching: questionsQuery.isFetching,
    isError: questionsQuery.isError && !data,
    retry: () => void questionsQuery.refetch(),
    page,
    totalPages: data?.totalPages ?? 1,
    total,
    from,
    to: Math.min(from + ALL_QUESTIONS_PAGE_LIMIT - 1, total),
    search,
    answered,
    sort,
    hasFilters: Boolean(q) || answered !== "all",
    setAnswered: (value: AnsweredFilter) =>
      update({ [QNA_QUERY.answered]: value === "all" ? null : value }),
    setSort: (value: QuestionSort) =>
      update({
        [QNA_QUERY.sort]: value === DEFAULT_QUESTION_SORT ? null : value,
      }),
    setPage: (value: number) =>
      update({ [QNA_QUERY.page]: value > 1 ? value : null }),
    clearFilters: () => {
      search.reset();
      update({ [QNA_QUERY.q]: null, [QNA_QUERY.answered]: null });
    },
  };
}
