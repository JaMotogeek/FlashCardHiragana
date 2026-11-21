import { describe, expect, it } from "vitest";

import { createStrokeCapture } from "../lib/strokeCapture";

describe("stroke capture", () => {
  it("records one stroke from press to release in drawing-pad coordinates", () => {
    const capture = createStrokeCapture({
      left: 100,
      top: 50,
      width: 200,
      height: 200,
    });

    capture.start({ x: 120, y: 90 });
    capture.move({ x: 180, y: 150 });
    capture.end({ x: 260, y: 210 });

    expect(capture.getStrokes()).toEqual([
      [
        { x: 0.1, y: 0.2 },
        { x: 0.4, y: 0.5 },
        { x: 0.8, y: 0.8 },
      ],
    ]);
  });
  it("keeps two completed strokes separate and in drawing order", () => {
  const capture = createStrokeCapture({
    left: 100,
    top: 50,
    width: 200,
    height: 200,
  });

  capture.start({ x: 120, y: 90 });
  capture.end({ x: 180, y: 90 });

  capture.start({ x: 220, y: 110 });
  capture.end({ x: 220, y: 170 });

  expect(capture.getStrokes()).toEqual([
    [
      { x: 0.1, y: 0.2 },
      { x: 0.4, y: 0.2 },
    ],
    [
      { x: 0.6, y: 0.3 },
      { x: 0.6, y: 0.6 },
    ],
  ]);
});
it("discards an interrupted stroke and keeps completed strokes", () => {
  const capture = createStrokeCapture({
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  });

  capture.start({ x: 10, y: 20 });
  capture.end({ x: 40, y: 20 });

  capture.start({ x: 60, y: 30 });
  capture.move({ x: 60, y: 45 });
  capture.cancel();

  // A release after cancellation should have no effect.
  capture.end({ x: 60, y: 60 });

  expect(capture.getStrokes()).toEqual([
    [
      { x: 0.1, y: 0.2 },
      { x: 0.4, y: 0.2 },
    ],
  ]);
});
});