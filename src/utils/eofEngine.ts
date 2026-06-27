/**
 * Edge Occlusion Factor (EOF) Engine
 *
 * The EOF measures WHERE on the panel shadows occur.
 * Center shadows are more damaging to efficiency than edge shadows
 * because they affect the most active cell area.
 *
 * Grid positions (row, col) 0-2:
 *   Edges:   any position where row==0, row==2, col==0, or col==2
 *   Center:  row==1 AND col==1 (only the single center point)
 *   Mid:     everything else (1 edge step from center)
 *
 * Edge weights (higher weight = more impact when occluded):
 *   Corner  (e.g. [0,0]) → weight 0.5
 *   Edge    (e.g. [0,1]) → weight 0.7
 *   Mid     (e.g. [1,0]) → weight 0.85
 *   Center  ([1,1])      → weight 1.0
 */

// 3×3 grid position weights (row-major, index 0..8)
// Grid layout:
//  [0,0] [0,1] [0,2]
//  [1,0] [1,1] [1,2]
//  [2,0] [2,1] [2,2]
const POINT_WEIGHTS: number[] = [
  0.5, 0.7, 0.5, // top row: corner, edge, corner
  0.7, 1.0, 0.7, // middle row: edge, CENTER, edge
  0.5, 0.7, 0.5, // bottom row: corner, edge, corner
];

const WEIGHT_SUM = POINT_WEIGHTS.reduce((a, b) => a + b, 0); // 6.8

/**
 * Computes the Edge Occlusion Factor for a panel.
 *
 * @param occludedIndices  Which of the 9 sample point indices (0-8) are occluded
 * @returns EOF in range [0.0, 1.0]
 */
export function computeEOF(occludedIndices: number[]): number {
  if (occludedIndices.length === 0) return 0;
  if (occludedIndices.length === 9) return 1;

  const occludedWeightSum = occludedIndices.reduce(
    (sum, idx) => sum + POINT_WEIGHTS[idx],
    0
  );

  return Math.min(1, occludedWeightSum / WEIGHT_SUM);
}

/**
 * Returns the occluded point indices from a boolean array of 9 hit results.
 */
export function getOccludedIndices(hits: boolean[]): number[] {
  return hits.reduce<number[]>((acc, hit, idx) => {
    if (hit) acc.push(idx);
    return acc;
  }, []);
}
