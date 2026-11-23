type Point = {
  x: number;
  y: number;
};

type PadBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export function createStrokeCapture(bounds: PadBounds) {
  const completedStrokes: Point[][] = [];
  let activeStroke: Point[] | null = null;

  function toPadPoint(point: Point): Point {
    return {
      x: (point.x - bounds.left) / bounds.width,
      y: (point.y - bounds.top) / bounds.height,
    };
  }

  return {
    start(point: Point) {
      activeStroke = [toPadPoint(point)];
    },

    move(point: Point) {
      activeStroke?.push(toPadPoint(point));
    },

    end(point: Point) {
      if (!activeStroke) return;

      activeStroke.push(toPadPoint(point));
      completedStrokes.push(activeStroke);
      activeStroke = null;
    },

    cancel() {
      activeStroke = null;
    },

    undo() {
      completedStrokes.pop();
    },

    clear() {
      activeStroke = null;
      completedStrokes.length = 0;
    },

    getStrokes() {
      return completedStrokes.map((stroke) =>
        stroke.map((point) => ({ ...point })),
      );
    },
  };
}