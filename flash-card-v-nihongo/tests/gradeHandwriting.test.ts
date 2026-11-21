import { describe, expect, it } from "vitest";

import { gradeHandwriting } from "../lib/gradeHandwriting";

const referenceStrokes = [
  [{ x: 0.15, y: 0.35 }, { x: 0.52, y: 0.35 }, { x: 0.48, y: 0.8 }],
  [{ x: 0.42, y: 0.15 }, { x: 0.31, y: 0.48 }, { x: 0.16, y: 0.72 }],
  [{ x: 0.66, y: 0.30 }, { x: 0.78, y: 0.42 }, { x: 0.86, y: 0.57 }],
];

describe("gradeHandwriting", () => {
  it("accepts strokes drawn close to the reference in the correct order", () => {
    const attempt = referenceStrokes.map((stroke) =>
      stroke.map(({ x, y }) => ({ x: x + 0.01, y: y - 0.01 })),
    );

    expect(gradeHandwriting(attempt, referenceStrokes)).toEqual({
      correct: true,
    });
  });

  it("reports when the first two strokes are swapped", () => {
    const [first, second, third] = referenceStrokes;
    const attempt = [second, first, third];

    expect(gradeHandwriting(attempt, referenceStrokes)).toEqual({
      correct: false,
      reason: "stroke-order",
      strokeNumber: 1,
    });
  });

  it("reports when the second stroke is drawn backward", () => {
    const [first, second, third] = referenceStrokes;
    const attempt = [first, [...second].reverse(), third];

    expect(gradeHandwriting(attempt, referenceStrokes)).toEqual({
      correct: false,
      reason: "stroke-direction",
      strokeNumber: 2,
    });
  });
});