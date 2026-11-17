import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VendorQnaView } from "../VendorQnaView.component";
import type { ProductQuestion } from "@/shared/api/types";

const mockQuestions: ProductQuestion[] = [
  {
    id: "q-1",
    productId: "p-1",
    productName: "Premium Wireless Headphones",
    userId: "u-1",
    customerName: "Jane Doe",
    question: "Does it support active noise cancellation?",
    status: "PUBLISHED",
    answers: [],
    createdAt: new Date().toISOString(),
  },
];

describe("VendorQnaView", () => {
  it("renders questions and allows opening answer dialog and submitting answer", () => {
    const handleAnswer = vi.fn().mockResolvedValue(undefined);

    render(<VendorQnaView questions={mockQuestions} onAnswer={handleAnswer} />);

    expect(screen.getByText("Questions & Answers")).toBeInTheDocument();
    expect(screen.getByText("Premium Wireless Headphones")).toBeInTheDocument();
    expect(
      screen.getByText("Does it support active noise cancellation?"),
    ).toBeInTheDocument();

    const answerBtn = screen.getByRole("button", { name: "Answer" });
    fireEvent.click(answerBtn);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, {
      target: { value: "Yes, it supports hybrid active noise cancellation." },
    });

    const submitBtn = screen.getByRole("button", { name: "Submit answer" });
    fireEvent.click(submitBtn);

    expect(handleAnswer).toHaveBeenCalledWith(
      "q-1",
      "Yes, it supports hybrid active noise cancellation.",
    );
  });

  it("renders existing vendor answer and allows editing", () => {
    const handleUpdateAnswer = vi.fn().mockResolvedValue(undefined);
    const questionsWithAnswer: ProductQuestion[] = [
      {
        ...mockQuestions[0],
        answers: [
          {
            id: "ans-1",
            authorId: "v-1",
            authorType: "VENDOR",
            authorName: "Audio Pro",
            answer: "Initial vendor answer text",
            status: "PUBLISHED",
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ];

    render(
      <VendorQnaView
        questions={questionsWithAnswer}
        onAnswer={vi.fn()}
        onUpdateAnswer={handleUpdateAnswer}
      />,
    );

    expect(screen.getByText("Your Answer:")).toBeInTheDocument();
    expect(screen.getByText("Initial vendor answer text")).toBeInTheDocument();

    const editBtn = screen.getByRole("button", { name: "Edit Answer" });
    fireEvent.click(editBtn);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Initial vendor answer text");

    fireEvent.change(textarea, {
      target: { value: "Updated vendor answer text" },
    });

    const submitBtn = screen.getByRole("button", { name: "Submit answer" });
    fireEvent.click(submitBtn);

    expect(handleUpdateAnswer).toHaveBeenCalledWith(
      "ans-1",
      "Updated vendor answer text",
    );
  });

  it("renders empty state when there are no questions", () => {
    render(<VendorQnaView questions={[]} onAnswer={vi.fn()} />);
    expect(
      screen.getByText("No customer questions found."),
    ).toBeInTheDocument();
  });
});
