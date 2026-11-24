import { describe, expect, it } from "vitest";
import { kanaReferences, getKanaReference } from "../lib/kanaReferences";
import { gradeHandwriting } from "../lib/gradeHandwriting";

describe("kana references", () => {
  it.each(Object.entries(kanaReferences))(
    "%s has usable strokes within the drawing pad",
    (_kana, strokes) => {
      expect(strokes.length).toBeGreaterThan(0);

      for (const stroke of strokes) {
        const start = stroke[0];
        if (!start) throw new Error("Reference stroke is empty");

        expect(
          stroke.some(({ x, y }) => x !== start.x || y !== start.y),
        ).toBe(true);

        for (const { x, y } of stroke) {
          for (const coordinate of [x, y]) {
            expect(Number.isFinite(coordinate)).toBe(true);
            expect(coordinate).toBeGreaterThanOrEqual(0);
            expect(coordinate).toBeLessThanOrEqual(1);
          }
        }
      }
    },
  );
  it("rejects か when its first two reference strokes are swapped", () => {
  const [first, second, third] = kanaReferences.か;

  expect(
    gradeHandwriting([second!, first!, third!], kanaReferences.か),
  ).toEqual({
    correct: false,
    reason: "stroke-order",
    strokeNumber: 1,
  });
});
it.each(["か", "く"] as const)(
  "returns the writing reference for %s",
  (kana) => {
    expect(getKanaReference(kana)).toBe(kanaReferences[kana]);
  },
);

it.each(["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も"] as const)(
  "returns a writing reference for %s",
  (kana) => {
    const reference = getKanaReference(kana);

    expect(reference).toBeDefined();
    expect(reference?.length).toBeGreaterThan(0);
  },
);
it("returns undefined for an unsupported character", () => {
  expect(getKanaReference("A")).toBeUndefined();
});
});