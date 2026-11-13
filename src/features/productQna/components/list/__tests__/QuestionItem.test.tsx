import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProductAnswer, ProductQuestion } from "@/shared/api/types";
import { productQnaApi } from "../../../api/qna/productQna.api";
import { QnaEditContext } from "../../../context/qnaEdit.context";
import { QuestionItem } from "../QuestionItem.component";

const answer = (id: string, text: string, authorType = "CUSTOMER") =>
  ({
    id,
    answer: text,
    authorType,
    authorId: `author-${id}`,
    authorName: "Vikram",
    createdAt: "2026-11-03T00:00:00Z",
  }) as unknown as ProductAnswer;

const question = {
  id: "q1",
  productId: "p1",
  userId: "asker",
  question: "Does the size run true?",
  status: "PUBLISHED",
  createdAt: "2026-11-01T00:00:00Z",
  customerName: "Raj",
  answerCount: 25,
  // The list ships only the best answer; the thread pages in.
  answers: [answer("seller", "True to size.", "VENDOR")],
} as unknown as ProductQuestion;

const page = (n: number) => ({
  items: Array.from({ length: 10 }, (_, i) =>
    i === 0 && n === 1
      ? answer("seller", "True to size.", "VENDOR")
      : answer(`p${n}-${i}`, `Answer ${n}-${i}`),
  ),
  total: 25,
  page: n,
  limit: 10,
  totalPages: 3,
});

function wrap(ui: ReactNode, currentUserId: string | null = null) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const editQuestion = vi.fn();
  render(
    <QueryClientProvider client={client}>
      <QnaEditContext.Provider
        value={{ currentUserId, editQuestion, editAnswer: vi.fn() }}
      >
        {ui}
      </QnaEditContext.Provider>
    </QueryClientProvider>,
  );
  return { editQuestion };
}

describe("QuestionItem answer thread", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows only the best answer until the thread is opened, then pages 10 at a time", async () => {
    const answers = vi
      .spyOn(productQnaApi, "answers")
      .mockImplementation(async (_id, params) => page(params.page ?? 1));
    wrap(<QuestionItem question={question} />);

    expect(screen.getByText("True to size.")).toBeInTheDocument();
    expect(answers).not.toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole("button", { name: /See 24 more answers/ }),
    );
    expect(await screen.findByText("Answer 1-9")).toBeInTheDocument();
    expect(screen.getByText("Showing 10 of 25 answers")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Load more answers" }),
    );
    expect(await screen.findByText("Answer 2-9")).toBeInTheDocument();
    expect(answers).toHaveBeenLastCalledWith("q1", { page: 2, limit: 10 });

    await userEvent.click(
      screen.getByRole("button", { name: /Show fewer answers/ }),
    );
    expect(screen.queryByText("Answer 2-9")).toBeNull();
  });

  it("lets the asker edit only while the question is unanswered", async () => {
    const unanswered = {
      ...question,
      answerCount: 0,
      answers: [],
    } as ProductQuestion;
    const { editQuestion } = wrap(
      <QuestionItem question={unanswered} />,
      "asker",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Edit your question" }),
    );
    expect(editQuestion).toHaveBeenCalledWith(unanswered);
  });

  it("hides Edit on an answered question and on other people's questions", () => {
    wrap(<QuestionItem question={question} />, "asker");
    expect(
      screen.queryByRole("button", { name: "Edit your question" }),
    ).toBeNull();
  });
});
