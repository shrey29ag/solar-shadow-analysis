import * as THREE from "three";

export interface PanelShadowResult {
  panelId: string;
  totalPoints: number;
  occludedPoints: number;
  shadowPercentage: number; // 0-100
  status: "Optimal" | "Partially Shaded" | "Heavily Shaded";
}

export interface TableShadowResult {
  tableId: string;
  panels: PanelShadowResult[];
}

/**
 * Classifies a panel's shadow status from its percentage.
 */
function classifyPanel(shadowPct: number): PanelShadowResult["status"] {
  if (shadowPct <= 10) return "Optimal";
  if (shadowPct <= 40) return "Partially Shaded";
  return "Heavily Shaded";
}

/**
 * Generates the 9 world-space sample points (3×3 grid) on a solar panel.
 *
 * @param panelWorldMatrix  The panel mesh's matrixWorld
 * @param panelWidth        Panel width (local X)
 * @param panelLength       Panel length (local Z, before tilt)
 */
function getPanelSamplePoints(
  panelWorldMatrix: THREE.Matrix4,
  panelWidth: number,
  panelLength: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  // 3×3 grid: offsets at -1/3, 0, +1/3 of half-dimensions
  const xOffsets = [-panelWidth / 3, 0, panelWidth / 3];
  const zOffsets = [-panelLength / 3, 0, panelLength / 3];

  for (const dx of xOffsets) {
    for (const dz of zOffsets) {
      // Local point slightly above panel surface (0.05m offset in local Y)
      const localPt = new THREE.Vector3(dx, 0.05, dz);
      localPt.applyMatrix4(panelWorldMatrix);
      points.push(localPt);
    }
  }
  return points;
}

/**
 * Runs shadow analysis for all solar tables.
 *
 * @param scene         The Three.js scene
 * @param sunDirection  Normalized [x,y,z] direction vector toward the sun
 * @param tableRefs     Map of tableId → array of panel mesh refs (world matrix)
 * @param occluderNames Names of objects that can cast shadows (buildings, tanks)
 */
export function analyzeShadows(
  scene: THREE.Scene,
  sunDirection: [number, number, number],
  panelData: {
    tableId: string;
    panelId: string;
    worldMatrix: THREE.Matrix4;
    panelWidth: number;
    panelLength: number;
  }[],
  occluders: THREE.Object3D[]
): TableShadowResult[] {
  const sunDir = new THREE.Vector3(...sunDirection).normalize();

  // If sun is below horizon, all panels are in shadow
  if (sunDir.y <= 0) {
    const grouped = groupPanelsByTable(panelData);
    return Object.entries(grouped).map(([tableId, panels]) => ({
      tableId,
      panels: panels.map((p) => ({
        panelId: p.panelId,
        totalPoints: 9,
        occludedPoints: 9,
        shadowPercentage: 100,
        status: "Heavily Shaded" as const,
      })),
    }));
  }

  const raycaster = new THREE.Raycaster();
  raycaster.near = 0.1;
  raycaster.far = 200;

  // Build occluder list (exclude panels themselves)
  const occluderMeshes: THREE.Mesh[] = [];
  occluders.forEach((obj) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        occluderMeshes.push(child);
      }
    });
  });

  // Per-panel analysis
  const panelResults: Map<string, PanelShadowResult> = new Map();

  for (const pd of panelData) {
    const samplePoints = getPanelSamplePoints(
      pd.worldMatrix,
      pd.panelWidth,
      pd.panelLength
    );

    let occludedCount = 0;

    for (const point of samplePoints) {
      raycaster.set(point, sunDir);
      const hits = raycaster.intersectObjects(occluderMeshes, false);
      if (hits.length > 0) {
        occludedCount++;
      }
    }

    const shadowPct = (occludedCount / 9) * 100;
    panelResults.set(pd.panelId, {
      panelId: pd.panelId,
      totalPoints: 9,
      occludedPoints: occludedCount,
      shadowPercentage: shadowPct,
      status: classifyPanel(shadowPct),
    });
  }

  // Group by table
  const grouped = groupPanelsByTable(panelData);
  return Object.entries(grouped).map(([tableId, panels]) => ({
    tableId,
    panels: panels.map((p) => panelResults.get(p.panelId)!),
  }));
}

function groupPanelsByTable(
  panelData: { tableId: string; panelId: string; worldMatrix: THREE.Matrix4; panelWidth: number; panelLength: number }[]
): Record<string, typeof panelData> {
  const map: Record<string, typeof panelData> = {};
  for (const p of panelData) {
    if (!map[p.tableId]) map[p.tableId] = [];
    map[p.tableId].push(p);
  }
  return map;
}
