import QRCode from "qrcode";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateQrCode } from "../../src/utils";

describe("Generate QR Code", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should generate QR Code based on string", async () => {
    const consoleMock = vi
      .spyOn(console, "log")
      .mockImplementation(() => undefined);

    const QR =
      "2@AEeB4Eh9o5wcQ08p38js2jsOieS1PYlirMp8fLD4kpWd8oggV/fV+h8rmy1cY6YJKZYRnfkzgRvzRyEORCaKI48dn501/ksE978=,EDOqSPPtoQGgwnExdrcoLt7EDueJdxcQdjR3+8Xg000=,Q57rlkBoR/83oXNi+y5t+7X8/Dm79e+BhW1mUxK/uFw=,WWD9zLjzjasOnTDXohWwGurs/FFX2H4V8m45RNvDpbM=";
    await generateQrCode(QR);
    expect(consoleMock).toBeCalled();
  });

  it("should fails generate QR Code based on string", async () => {
    vi.spyOn(QRCode, "toString").mockRejectedValue(new Error());
    const consoleMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const QR = JSON.stringify({ error: "force_error" });
    await generateQrCode(QR);
    expect(consoleMock).toBeCalled();
  });
});
