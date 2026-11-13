import { describe, expect, it } from "vitest";
import { QueryClient, type InfiniteData } from "@tanstack/react-query";
import type { PaginatedList } from "@/shared/api/client/pagination";
import type { ProductAnswer, ProductQuestion } from "@/shared/api/types";
import type { ProductQuestionPage } from "../../../types/productQna.types";
import { productQnaKeys } from "../productQna.queries";
import {
  setMyAnswerInCaches,
  updateAnswerInCaches,
  updateQuestionInCaches,
} from "../productQnaCache";

const answer = (
  id: string,
  extra: Partial<ProductAnswer> = {},
): ProductAnswer => ({
  id,
  answer: `answer ${id}`,
  authorType: "CUSTOMER",
  authorName: null,
  createdAt: "2026-11-01T00:00:00.000Z",
  status: "PUBLISHED",
  ...extra,
});

const question = (
  id: string,
  extra: Partial<ProductQuestion> = {},
): ProductQuestion => ({
  id,
  productId: "p1",
  question: `question ${id}`,
  status: "PUBLISHED",
  createdAt: "2026-11-01T00:00:00.000Z",
  customerName: null,
  answerCount: 0,
  answers: [],
  ...extra,
});

const page = (items: ProductQuestion[]): ProductQuestionPage => ({
  items,
  total: items.length,
  page: 1,
  limit: 10,
  totalPages: 1,
  summary: {
    total: items.length,
    answered: items.filter((q) => q.answerCount).length,
  },
});

const listKey = productQnaKeys.productList("p1", { sort: "most_answered" });

function setup(items: ProductQuestion[]) {
  const qc = new QueryClient();
  qc.setQueryData(listKey, page(items));
  return qc;
}

const ids = (qc: QueryClient) =>
  qc.getQueryData<ProductQuestionPage>(listKey)!.items.map((q) => q.id);

describe("productQnaCache — nothing around the edited item moves", () => {
  it("deleting my only answer keeps the question in its place", () => {
    const mine = answer("a1");
    const qc = setup([
      question("q1", { answerCount: 3 }),
      question("q2", { answerCount: 1, myAnswer: mine, answers: [mine] }),
      question("q3", { answerCount: 1 }),
    ]);
    updateAnswerInCaches(qc, "a1", () => null);
    const data = qc.getQueryData<ProductQuestionPage>(listKey)!;
    expect(ids(qc)).toEqual(["q1", "q2", "q3"]);
    expect(data.items[1]).toMatchObject({
      myAnswer: null,
      answers: [],
      answerCount: 0,
    });
    expect(data.summary.answered).toBe(2);
  });

  it("editing an answer keeps it in place and its count (now awaiting approval)", () => {
    const mine = answer("a1");
    const qc = setup([
      question("q1", { answerCount: 2, myAnswer: mine, answers: [mine] }),
    ]);
    updateAnswerInCaches(qc, "a1", (a) => ({
      ...a,
      answer: "new",
      status: "PENDING",
    }));
    const q1 = qc.getQueryData<ProductQuestionPage>(listKey)!.items[0];
    expect(q1.answerCount).toBe(2);
    expect(q1.myAnswer).toMatchObject({ answer: "new", status: "PENDING" });
    expect(q1.answers[0].answer).toBe("new");
  });

  it("patches the open thread and My answers without reordering", () => {
    const qc = setup([]);
    const thread: InfiniteData<PaginatedList<ProductAnswer>> = {
      pageParams: [1],
      pages: [
        {
          items: [answer("a0"), answer("a1"), answer("a2")],
          total: 3,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      ],
    };
    qc.setQueryData(productQnaKeys.answers("q1"), thread);
    qc.setQueryData(productQnaKeys.myAnswers(), thread);
    updateAnswerInCaches(qc, "a1", () => null);
    for (const key of [
      productQnaKeys.answers("q1"),
      productQnaKeys.myAnswers(),
    ]) {
      const data = qc.getQueryData<typeof thread>(key)!;
      expect(data.pages[0].items.map((a) => a.id)).toEqual(["a0", "a2"]);
      expect(data.pages[0].total).toBe(2);
    }
  });

  it("posting an answer pins it on that question only", () => {
    const qc = setup([question("q1"), question("q2"), question("q3")]);
    setMyAnswerInCaches(qc, "q2", answer("a9", { status: "PENDING" }));
    const data = qc.getQueryData<ProductQuestionPage>(listKey)!;
    expect(ids(qc)).toEqual(["q1", "q2", "q3"]);
    expect(data.items[1].myAnswer?.id).toBe("a9");
    expect(data.items[1].answerCount).toBe(0);
  });

  it("editing a question keeps the list order; deleting removes only it", () => {
    const qc = setup([
      question("q1"),
      question("q2", { answerCount: 2 }),
      question("q3"),
    ]);
    updateQuestionInCaches(qc, "q1", (q) => ({
      ...q,
      question: "edited",
      status: "PENDING",
    }));
    expect(ids(qc)).toEqual(["q1", "q2", "q3"]);
    updateQuestionInCaches(qc, "q2", () => null);
    const data = qc.getQueryData<ProductQuestionPage>(listKey)!;
    expect(ids(qc)).toEqual(["q1", "q3"]);
    expect(data.items[0].question).toBe("edited");
    expect(data).toMatchObject({
      total: 2,
      summary: { total: 2, answered: 0 },
    });
  });
});
