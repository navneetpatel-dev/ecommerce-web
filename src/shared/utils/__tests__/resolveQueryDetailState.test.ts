import { describe, expect, it } from "vitest";
import { resolveQueryDetailState } from "../resolveQueryDetailState";

function queryState<T>(overrides: {
  data?: T;
  isPending?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  error?: unknown;
}) {
  return {
    data: overrides.data,
    isPending: overrides.isPending ?? false,
    isFetching: overrides.isFetching ?? false,
    isError: overrides.isError ?? false,
    error: overrides.error ?? null,
  };
}

describe("resolveQueryDetailState", () => {
  it("keeps loading while pending before data arrives", () => {
    const state = resolveQueryDetailState(
      queryState({ isPending: true, isFetching: false }),
    );

    expect(state.isLoading).toBe(true);
    expect(state.isEmpty).toBe(false);
  });

  it("does not flash empty while fetch is in flight without data", () => {
    const state = resolveQueryDetailState(
      queryState({ isPending: false, isFetching: true, data: undefined }),
    );

    expect(state.isLoading).toBe(true);
    expect(state.isEmpty).toBe(false);
  });

  it("marks empty only after loading resolves without data", () => {
    const state = resolveQueryDetailState(
      queryState({ isPending: false, isFetching: false, data: undefined }),
    );

    expect(state.isLoading).toBe(false);
    expect(state.isEmpty).toBe(true);
  });

  it("stays loading when query is disabled", () => {
    const state = resolveQueryDetailState(
      queryState({ isPending: false, data: undefined }),
      { enabled: false },
    );

    expect(state.isLoading).toBe(true);
    expect(state.isEmpty).toBe(false);
  });
});
