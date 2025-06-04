import { describe, expect, it } from "vitest";
import { normalizeBeans, randomIntFromInterval } from "../../src/utils";

describe("Utils", () => {
  it.each(Array.from({ length: 10 }))("Execution nº %#", () => {
    const MIN = 0,
      MAX = 100;
    const value = randomIntFromInterval(MIN, MAX);
    expect(typeof value).toBe("number");
    expect(value).toBeGreaterThanOrEqual(MIN);
    expect(value).toBeLessThanOrEqual(MAX);
  });

  it("should normalized beans from menu", () => {
    const raw = "preto, macassar, mulato";
    const value = normalizeBeans(raw);

    expect(value).toBe("feijão preto, feijão macassar, feijão mulato");
  });
});
