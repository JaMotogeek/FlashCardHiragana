import type { gradeHandwriting } from "./gradeHandwriting";

type Reference = Parameters<typeof gradeHandwriting>[1];

function toPoints(coordinates: readonly (readonly [number, number])[]) {
  return coordinates.map(([x, y]) => ({ x, y }));
}

// Stroke data adapted from KanjiVG by Ulrich Apel and contributors,
// via https://github.com/funclosure/kanakana-strokes.
// Changes: sampled the SVG curves and normalized them to 0–1 coordinates.
// Data license: https://creativecommons.org/licenses/by-sa/3.0/
export const kanaReferences = {
  か: [
    toPoints([
      [0.2259, 0.3543], [0.2459, 0.3660], [0.2721, 0.3698],
      [0.3050, 0.3635], [0.4791, 0.3230], [0.5574, 0.3500],
      [0.5756, 0.4334], [0.5716, 0.5158], [0.5590, 0.5923],
      [0.5366, 0.6650], [0.4779, 0.7848], [0.4329, 0.8058],
      [0.3887, 0.7650],
    ]),
    toPoints([
      [0.4450, 0.1606], [0.4518, 0.1782], [0.4536, 0.2019],
      [0.4495, 0.2259], [0.3857, 0.3864], [0.3125, 0.5431],
      [0.2695, 0.6284], [0.2406, 0.6816], [0.2117, 0.7328],
      [0.1835, 0.7775],
    ]),
    toPoints([
      [0.7098, 0.2901], [0.7725, 0.3587],
      [0.8199, 0.4360], [0.8474, 0.5183],
    ]),
  ],
  く: [
    toPoints([
      [0.5565, 0.1376], [0.5589, 0.1578], [0.5562, 0.1832],
      [0.5473, 0.2053], [0.4843, 0.2918], [0.4247, 0.3693],
      [0.3765, 0.4301], [0.3522, 0.4685], [0.3505, 0.4989],
      [0.3684, 0.5310], [0.4228, 0.6091], [0.4795, 0.6968],
      [0.5301, 0.7810], [0.5433, 0.8042], [0.5566, 0.8291],
      [0.5714, 0.8601],
    ]),
  ],
} satisfies Record<string, Reference>;
export function getKanaReference(character: string): Reference | undefined {
  if (!Object.prototype.hasOwnProperty.call(kanaReferences, character)) {
    return undefined;
  }

  return kanaReferences[character as keyof typeof kanaReferences];
}