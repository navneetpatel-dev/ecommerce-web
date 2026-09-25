import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/shared/api/uploads.api", () => ({
  uploadsApi: {
    presign: vi.fn(),
    verify: vi.fn(),
    upload: vi.fn(),
  },
  putFileToPresignedUrl: vi.fn(),
}));

import { putFileToPresignedUrl, uploadsApi } from "@/shared/api/uploads.api";
import { uploadSingleWithFallback } from "../useUploads.hook";

const presigned = {
  uploadUrl: "https://s3.example/put",
  url: "https://cdn.example/test/users/u1/avatar/a.png",
  key: "test/users/u1/avatar/a.png",
};

const body = {
  entityType: "users",
  entityId: "u1",
  purpose: "avatar",
  filename: "a.png",
  contentType: "image/png",
  contentLength: 4,
  file: new File(["abcd"], "a.png", { type: "image/png" }),
} as Parameters<typeof uploadSingleWithFallback>[0];

describe("uploadSingleWithFallback", () => {
  beforeEach(() => {
    vi.mocked(uploadsApi.presign).mockReset().mockResolvedValue(presigned);
    vi.mocked(putFileToPresignedUrl).mockReset().mockResolvedValue(undefined);
    vi.mocked(uploadsApi.verify)
      .mockReset()
      .mockResolvedValue({ key: presigned.key });
    vi.mocked(uploadsApi.upload).mockReset();
  });

  it("asks the server to verify a direct-to-S3 upload before using it", async () => {
    await expect(uploadSingleWithFallback(body)).resolves.toEqual(presigned);
    expect(uploadsApi.verify).toHaveBeenCalledWith(presigned.key);
  });

  it("surfaces a rejected file instead of retrying it through the server", async () => {
    vi.mocked(uploadsApi.verify).mockRejectedValue(
      new Error("content mismatch"),
    );
    await expect(uploadSingleWithFallback(body)).rejects.toThrow(
      "content mismatch",
    );
    expect(uploadsApi.upload).not.toHaveBeenCalled();
  });

  it("does not verify the server-side fallback, which checks the bytes itself", async () => {
    vi.mocked(putFileToPresignedUrl).mockRejectedValue(new Error("CORS"));
    vi.mocked(uploadsApi.upload).mockResolvedValue({ url: presigned.url });
    await expect(uploadSingleWithFallback(body)).resolves.toMatchObject({
      url: presigned.url,
    });
    expect(uploadsApi.verify).not.toHaveBeenCalled();
  });
});
