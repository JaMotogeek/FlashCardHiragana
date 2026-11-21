import { describe, expect, it } from "vitest";
import { createStrokeCapture } from "../lib/strokeCapture";
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
  it("accepts the same stroke with extra points recorded near its start", () => {
  const reference = [[{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.8 }]];

  const attempt = [[
    { x: 0.2, y: 0.2 },
    { x: 0.21, y: 0.21 },
    { x: 0.22, y: 0.22 },
    { x: 0.24, y: 0.24 },
    { x: 0.8, y: 0.8 },
  ]];

  expect(gradeHandwriting(attempt, reference)).toEqual({ correct: true });
});
it("grades strokes captured from an offset drawing pad", () => {
  const bounds = { left: 100, top: 50, width: 200, height: 200 };
  const capture = createStrokeCapture(bounds);

  function toViewportPoint(point: { x: number; y: number }) {
    return {
      x: bounds.left + point.x * bounds.width,
      y: bounds.top + point.y * bounds.height,
    };
  }

  for (const [start, middle, end] of referenceStrokes) {
    capture.start(toViewportPoint(start));
    capture.move(toViewportPoint(middle));
    capture.end(toViewportPoint(end));
  }

  expect(gradeHandwriting(capture.getStrokes(), referenceStrokes)).toEqual({
    correct: true,
  });
});
});