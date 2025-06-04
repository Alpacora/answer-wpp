import { describe, expect, it } from "vitest";
import { normalizeBeans, randomIntFromInterval } from "../../src/utils";

describe("Utils", () => {
  it("should return random integer number between two values", () => {
    const MIN = 0,
      MAX = 100;
    const value = randomIntFromInterval(MIN, MAX);
    expect(value).toBeTruthy();
  });
  it("should normalized beans from menu", () => {
    const raw = "preto, macassar, mulato";
    const value = normalizeBeans(raw);

    expect(value).toBe("feijão preto, feijão macassar, feijão mulato");
  });
});
