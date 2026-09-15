import { describe, expect, it } from "vitest";
import { useExportJobsStore } from "../exportJobs.store";

describe("useExportJobsStore", () => {
  it("tracks, updates, and dismisses jobs", () => {
    useExportJobsStore.setState({ jobs: [] });
    useExportJobsStore.getState().trackJob("a", "one");
    useExportJobsStore
      .getState()
      .updateJob("a", { status: "PROCESSING", progressPercent: 40 });
    expect(useExportJobsStore.getState().jobs[0]).toMatchObject({
      jobId: "a",
      status: "PROCESSING",
      progressPercent: 40,
    });
    useExportJobsStore.getState().dismissJob("a");
    expect(useExportJobsStore.getState().jobs).toEqual([]);
  });

  it("caps at 25 jobs and drops the oldest when a 26th is tracked", () => {
    useExportJobsStore.setState({ jobs: [] });
    for (let i = 0; i < 25; i += 1) {
      useExportJobsStore.getState().trackJob(`job-${i}`, `label-${i}`);
    }
    useExportJobsStore.getState().trackJob("job-25", "newest");
    const ids = useExportJobsStore.getState().jobs.map((j) => j.jobId);
    expect(ids).toHaveLength(25);
    expect(ids[0]).toBe("job-25");
    expect(ids).not.toContain("job-0");
    expect(ids).toContain("job-1");
  });

  it("re-tracking an existing jobId moves it to the front without duplicating", () => {
    useExportJobsStore.setState({ jobs: [] });
    useExportJobsStore.getState().trackJob("a", "one");
    useExportJobsStore.getState().trackJob("b", "two");
    useExportJobsStore
      .getState()
      .trackJob("a", "one-again", {
        status: "PROCESSING",
        progressPercent: 10,
      });
    const jobs = useExportJobsStore.getState().jobs;
    expect(jobs).toHaveLength(2);
    expect(jobs[0]?.jobId).toBe("a");
    expect(jobs[0]?.progressPercent).toBe(10);
  });
});
