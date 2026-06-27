import { computeEOF } from "./eofEngine";

export interface PanelEfficiencyResult {
  panelId: string;
  shadowPercentage: number;
  baseEfficiency: number;   // 100 - shadowPercentage
  eof: number;              // 0.0 - 1.0
  finalEfficiency: number;  // baseEfficiency × (1 - eof × EOF_PENALTY_WEIGHT)
}

export interface TableEfficiencyResult {
  tableId: string;
  panels: PanelEfficiencyResult[];
  averageShadowPercentage: number;
  averageEfficiency: number;
  bestPanel: PanelEfficiencyResult;
  worstPanel: PanelEfficiencyResult;
}

/** Weight applied to the EOF penalty. Tuned to be visible but not extreme. */
const EOF_PENALTY_WEIGHT = 0.15;

/**
 * Computes efficiency for a single panel given its shadow hit booleans.
 *
 * @param panelId         Panel identifier
 * @param hits            9-element boolean array, true = occluded
 */
export function computePanelEfficiency(
  panelId: string,
  hits: boolean[]
): PanelEfficiencyResult {
  const occludedCount = hits.filter(Boolean).length;
  const shadowPercentage = (occludedCount / 9) * 100;
  const baseEfficiency = Math.max(0, 100 - shadowPercentage);

  const occludedIndices = hits.reduce<number[]>((acc, hit, idx) => {
    if (hit) acc.push(idx);
    return acc;
  }, []);

  const eof = computeEOF(occludedIndices);

  const finalEfficiency = Math.max(
    0,
    Math.min(100, baseEfficiency * (1 - eof * EOF_PENALTY_WEIGHT))
  );

  return {
    panelId,
    shadowPercentage,
    baseEfficiency,
    eof,
    finalEfficiency,
  };
}

/**
 * Computes the table-level efficiency summary from panel results.
 */
export function computeTableEfficiency(
  tableId: string,
  panels: PanelEfficiencyResult[]
): TableEfficiencyResult {
  if (panels.length === 0) {
    const empty: PanelEfficiencyResult = {
      panelId: "none",
      shadowPercentage: 0,
      baseEfficiency: 100,
      eof: 0,
      finalEfficiency: 100,
    };
    return {
      tableId,
      panels: [],
      averageShadowPercentage: 0,
      averageEfficiency: 100,
      bestPanel: empty,
      worstPanel: empty,
    };
  }

  const avgShadow =
    panels.reduce((s, p) => s + p.shadowPercentage, 0) / panels.length;
  const avgEff =
    panels.reduce((s, p) => s + p.finalEfficiency, 0) / panels.length;

  const bestPanel = panels.reduce((best, p) =>
    p.finalEfficiency > best.finalEfficiency ? p : best
  );
  const worstPanel = panels.reduce((worst, p) =>
    p.finalEfficiency < worst.finalEfficiency ? p : worst
  );

  return {
    tableId,
    panels,
    averageShadowPercentage: avgShadow,
    averageEfficiency: avgEff,
    bestPanel,
    worstPanel,
  };
}
