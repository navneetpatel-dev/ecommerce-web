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

  it("renders empty state when there are no questions", () => {
    render(<VendorQnaView questions={[]} onAnswer={vi.fn()} />);
    expect(
      screen.getByText("No customer questions found."),
    ).toBeInTheDocument();
  });
});
