"use client";

import { useRef, useState } from "react";
import type { PointerEvent } from "react";

import { gradeHandwriting } from "../../lib/gradeHandwriting";
import { createStrokeCapture } from "../../lib/strokeCapture";

type Point = { x: number; y: number };

type WritingPadProps = {
  reference: Parameters<typeof gradeHandwriting>[1];
  showGuide?: boolean;
};

function createCapture() {
  return createStrokeCapture({ left: 0, top: 0, width: 1, height: 1 });
}

function toPadPoint(event: PointerEvent<SVGSVGElement>): Point {
  const bounds = event.currentTarget.getBoundingClientRect();

  return {
    x: (event.clientX - bounds.left) / bounds.width,
    y: (event.clientY - bounds.top) / bounds.height,
  };
}

export default function WritingPad({
  reference,
  showGuide = false,
}: WritingPadProps) {
  const [capture] = useState(createCapture);
  const activePointer = useRef<number | null>(null);
  const [draft, setDraft] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [feedback, setFeedback] = useState("");

  function start(event: PointerEvent<SVGSVGElement>) {
    if (activePointer.current !== null || event.button !== 0) return;

    const point = toPadPoint(event);
    event.currentTarget.setPointerCapture(event.pointerId);
    activePointer.current = event.pointerId;
    capture.start(point);
    setDraft([point]);
    setFeedback("");
  }

  function move(event: PointerEvent<SVGSVGElement>) {
    if (activePointer.current !== event.pointerId) return;

    const point = toPadPoint(event);
    capture.move(point);
    setDraft((previous) => [...previous, point]);
  }

  function end(event: PointerEvent<SVGSVGElement>) {
    if (activePointer.current !== event.pointerId) return;

    capture.end(toPadPoint(event));
    activePointer.current = null;
    setDraft([]);
    setStrokes(capture.getStrokes());
  }

  function cancel(event: PointerEvent<SVGSVGElement>) {
    if (activePointer.current !== event.pointerId) return;

    capture.cancel();
    activePointer.current = null;
    setDraft([]);
  }

  function check() {
    const capturedStrokes = capture.getStrokes();
    const result = gradeHandwriting(capturedStrokes, reference);

    if (result.correct) {
      setFeedback("Correct!");
    } else if (result.reason === "stroke-count") {
      setFeedback(
    `Expected ${reference.length} strokes. Recorded ${capturedStrokes.length}.`,
    );
    } else {
      const message = {
        "stroke-order": "Check the order",
        "stroke-direction": "Check the direction",
        "stroke-shape": "Try the shape again",
      }[result.reason];

      setFeedback(`Stroke ${result.strokeNumber}. ${message}.`);
    }
  }

  function undo() {
    capture.undo();
    setStrokes(capture.getStrokes());
    setFeedback("");
    }

    function clear() {
    capture.clear();
    setStrokes([]);
    setFeedback("");
    }

  return (
    <section aria-label="Handwriting practice">
      <svg
        viewBox="0 0 100 100"
        aria-label="Drawing area"
        className="block aspect-square w-full max-w-72 touch-none bg-white text-black outline outline-gray-400"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={cancel}
        onLostPointerCapture={cancel}
      >
        {showGuide && (
        <g aria-hidden="true" pointerEvents="none">
            {reference.map((stroke, index) => (
            <polyline
                key={index}
                points={stroke.map(({ x, y }) => `${x * 100},${y * 100}`).join(" ")}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="3 3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            ))}
            {reference.map((stroke, index) => {
            const start = stroke[0];
            if (!start) return null;

            return (
                <g key={index} transform={`translate(${start.x * 100} ${start.y * 100})`}>
                <circle r="3.4" fill="#2563eb" stroke="white" strokeWidth="0.6" />
                <text
                    fill="white"
                    fontSize="4.5"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="central"
                >
                    {index + 1}
                </text>
                </g>
            );
            })}
        </g>
        )}

        {[...strokes, draft].map((stroke, index) => (
          <polyline
            key={index}
            points={stroke.map(({ x, y }) => `${x * 100},${y * 100}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>

        <div className="mt-3 flex flex-wrap gap-2">
        <button
            type="button"
            onClick={check}
            disabled={strokes.length === 0 || draft.length > 0}
            className="rounded border border-current px-3 py-2 disabled:opacity-40"
        >
            Check
        </button>

        <button
            type="button"
            onClick={undo}
            disabled={strokes.length === 0 || draft.length > 0}
            className="rounded border border-current px-3 py-2 disabled:opacity-40"
        >
            Undo
        </button>

        <button
            type="button"
            onClick={clear}
            disabled={strokes.length === 0 || draft.length > 0}
            className="rounded border border-current px-3 py-2 disabled:opacity-40"
        >
            Clear
        </button>
        </div>
        <p role="status" className="mt-2">{feedback}</p>
    </section>
  );
}