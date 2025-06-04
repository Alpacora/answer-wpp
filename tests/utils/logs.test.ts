import fileSystem from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import { logToFile } from "../../src/utils";

describe("Logs", () => {
  it("should increment logs on file", async () => {
    vi.spyOn(fileSystem, "appendFile").mockResolvedValue();
    const message = "message to log";
    await logToFile(message);
    expect(fileSystem.appendFile).toBeCalledTimes(1);
  });

  it("should failed increment logs on file", async () => {
    vi.spyOn(fileSystem, "appendFile").mockRejectedValue(new Error());

    const consoleMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    await logToFile("message");
    expect(consoleMock).toBeCalled();
  });
});
