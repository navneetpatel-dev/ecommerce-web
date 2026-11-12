import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ProductQuestion } from "@/shared/api/types";
import {
  QuestionAnswerSlot,
  type AnsweringState,
} from "../QuestionAnswerSlot.component";

const question = {
  id: "q-1",
  question: "Is it waterproof?",
} as ProductQuestion;

function state(overrides: Partial<AnsweringState> = {}): AnsweringState {
  return {
    openId: null,
    submittedId: null,
    draft: "",
    isPending: false,
    error: null,
    onToggle: vi.fn(),
    onDraftChange: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
  };
}

/** C-01: Answer appears only for people who may answer, and opens a form. */
describe("QuestionAnswerSlot", () => {
  it("shows nothing for someone who may not answer", () => {
    const { container } = render(<QuestionAnswerSlot question={question} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("offers Answer, named after the question", () => {
    const answering = state();
    render(<QuestionAnswerSlot question={question} answering={answering} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Answer: Is it waterproof?" }),
    );
    expect(answering.onToggle).toHaveBeenCalledWith("q-1");
  });

  it("shows the form when open and the review note once sent", () => {
    const { rerender } = render(
      <QuestionAnswerSlot
        question={question}
        answering={state({ openId: "q-1" })}
      />,
    );
    expect(screen.getByLabelText("Your answer")).toBeInTheDocument();
    rerender(
      <QuestionAnswerSlot
        question={question}
        answering={state({ submittedId: "q-1" })}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      /once it has been checked/,
    );
  });
});
