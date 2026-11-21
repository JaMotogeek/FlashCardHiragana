type Point = {
  x: number;
  y: number;
};

type Stroke = readonly Point[];
type Handwriting = readonly Stroke[];

type Grade =
  | { correct: true }
  | { correct: false; reason: "stroke-count" }
  | {
      correct: false;
      reason: "stroke-order" | "stroke-direction" | "stroke-shape";
      strokeNumber: number;
    };

const SAMPLE_COUNT = 24;
const MAX_AVERAGE_DISTANCE = 0.06;

function distance(first: Point, second: Point): number {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function sampleStroke(stroke: Stroke): Point[] {
  const start = stroke[0];
  if (!start) return [];

  const segments: { from: Point; to: Point; length: number }[] = [];
  let totalLength = 0;
  let previous = start;

  for (const point of stroke.slice(1)) {
    const length = distance(previous, point);
    if (length > 0) {
      segments.push({ from: previous, to: point, length });
      totalLength += length;
    }
    previous = point;
  }

  if (totalLength === 0) return [];

  const samples: Point[] = [];
  let segmentIndex = 0;
  let segmentStart = 0;

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const target = (index / (SAMPLE_COUNT - 1)) * totalLength;
    let segment = segments[segmentIndex]!;

    while (
      segmentIndex < segments.length - 1 &&
      target > segmentStart + segment.length
    ) {
      segmentStart += segment.length;
      segmentIndex += 1;
      segment = segments[segmentIndex]!;
    }

    const progress = (target - segmentStart) / segment.length;
    samples.push({
      x: segment.from.x + (segment.to.x - segment.from.x) * progress,
      y: segment.from.y + (segment.to.y - segment.from.y) * progress,
    });
  }

  return samples;
}

function matchesStroke(attempt: Stroke, reference: Stroke): boolean {
  if (attempt.length !== SAMPLE_COUNT || reference.length !== SAMPLE_COUNT) {
    return false;
  }

  const totalDistance = attempt.reduce(
    (total, point, index) => total + distance(point, reference[index]!),
    0,
  );

  return totalDistance / SAMPLE_COUNT <= MAX_AVERAGE_DISTANCE;
}

export function gradeHandwriting(
  attempt: Handwriting,
  reference: Handwriting,
): Grade {
  if (reference.length === 0 || attempt.length !== reference.length) {
    return { correct: false, reason: "stroke-count" };
  }

  const expectedStrokes = reference.map(sampleStroke);

  for (const [index, stroke] of attempt.entries()) {
    const drawn = sampleStroke(stroke);
    const expected = expectedStrokes[index]!;
    const strokeNumber = index + 1;

    if (matchesStroke(drawn, expected)) continue;

    if (matchesStroke([...drawn].reverse(), expected)) {
      return { correct: false, reason: "stroke-direction", strokeNumber };
    }

    if (expectedStrokes.slice(index + 1).some((later) => matchesStroke(drawn, later))) {
      return { correct: false, reason: "stroke-order", strokeNumber };
    }

    return { correct: false, reason: "stroke-shape", strokeNumber };
  }

  return { correct: true };
}