import { describe, expect, it, vi } from "vitest";
import { fileToAvatarDataUrl, initialsFromName } from "@/lib/avatar";

describe("initialsFromName", () => {
  it("handles empty, single, and multi-part names", () => {
    expect(initialsFromName("")).toBe("?");
    expect(initialsFromName("Ada")).toBe("AD");
    expect(initialsFromName("Ada Lovelace")).toBe("AL");
    expect(initialsFromName("X Y")).toBe("XY");
  });
});

describe("fileToAvatarDataUrl", () => {
  it("rejects invalid types and oversized files", async () => {
    await expect(fileToAvatarDataUrl(new File(["x"], "a.txt", { type: "text/plain" }))).rejects.toThrow(
      "INVALID_IMAGE_TYPE",
    );
    const big = new File([new Uint8Array(3 * 1024 * 1024)], "big.jpg", { type: "image/jpeg" });
    await expect(fileToAvatarDataUrl(big)).rejects.toThrow("IMAGE_FILE_TOO_LARGE");
  });

  it("keeps small images at native scale", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => ({
        width: 128,
        height: 64,
        close: vi.fn(),
      })),
    );

    const dataUrl = `data:image/jpeg;base64,${"a".repeat(100)}`;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(dataUrl);

    const file = new File([new Uint8Array([1, 2, 3])], "avatar.jpg", { type: "image/jpeg" });
    await expect(fileToAvatarDataUrl(file)).resolves.toBe(dataUrl);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("reduces jpeg quality until the payload fits", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => ({
        width: 400,
        height: 200,
        close: vi.fn(),
      })),
    );

    let calls = 0;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(() => {
      calls += 1;
      if (calls === 1) return `data:image/jpeg;base64,${"a".repeat(200_000)}`;
      return `data:image/jpeg;base64,${"a".repeat(100)}`;
    });

    const file = new File([new Uint8Array([1, 2, 3])], "avatar.jpg", { type: "image/jpeg" });
    await expect(fileToAvatarDataUrl(file)).resolves.toMatch(/^data:image\/jpeg/);
    expect(calls).toBeGreaterThan(1);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("compresses a valid image", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => ({
        width: 400,
        height: 200,
        close: vi.fn(),
      })),
    );

    const dataUrl = `data:image/jpeg;base64,${"a".repeat(100)}`;
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(dataUrl);

    const file = new File([new Uint8Array([1, 2, 3])], "avatar.jpg", { type: "image/jpeg" });
    await expect(fileToAvatarDataUrl(file)).resolves.toBe(dataUrl);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("throws when compression cannot fit the byte budget", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => ({
        width: 400,
        height: 200,
        close: vi.fn(),
      })),
    );

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(`data:image/jpeg;base64,${"a".repeat(200_000)}`);

    const file = new File([new Uint8Array([1, 2, 3])], "avatar.jpg", { type: "image/jpeg" });
    await expect(fileToAvatarDataUrl(file)).rejects.toThrow("IMAGE_TOO_LARGE");
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("throws when canvas is unavailable", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => ({
        width: 8,
        height: 8,
        close: vi.fn(),
      })),
    );
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as typeof getContext;

    const file = new File([new Uint8Array([1, 2, 3])], "x.jpg", { type: "image/jpeg" });
    await expect(fileToAvatarDataUrl(file)).rejects.toThrow("CANVAS_UNAVAILABLE");

    HTMLCanvasElement.prototype.getContext = getContext;
    vi.unstubAllGlobals();
  });
});
