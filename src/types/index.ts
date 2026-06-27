export interface BuildingProps {
  id: string;
  width: number;
  length: number;
  height: number;
  position: [number, number, number]; // [X, Y, Z] position representing the base center of the building (Y is ground level)
  color?: string;
}

export interface WaterTankProps {
  id: string;
  radius: number;
  height: number;
  position: [number, number, number]; // [X, Y, Z] position representing the base center of the tank (Y is ground level)
  color?: string;
}

export interface SolarPanelProps {
  panelId: string;
  width: number;
  length: number;
  thickness: number;
  position: [number, number, number]; // Offset position relative to the SolarTable parent group
  shadowStatus?: "Optimal" | "Partially Shaded" | "Heavily Shaded";
  onRegisterRef?: (panelId: string, ref: THREE.Mesh | null) => void;
}

export interface SolarTableProps {
  id: string;
  position: [number, number, number]; // [X, Y, Z] position of the table base (Y is ground level)
  analysisResults?: PanelAnalysisResult[]; // optional per-panel analysis for visual feedback
}

export interface BuildingState {
  id: string;
  name: string;
  positionX: number;
  positionY: number; // corresponds to Z in 3D
  width: number;
  length: number;
  height: number;
  color?: string;
}

export interface WaterTankState {
  id: string;
  name: string;
  positionX: number;
  positionY: number; // corresponds to Z in 3D
  radius: number;
  height: number;
  color?: string;
}

export interface SolarTableState {
  id: string;
  name: string;
  positionX: number;
  positionY: number; // corresponds to Z in 3D
}

// ── Phase 5 Analysis Types ──────────────────────────────────────────────────

export interface PanelAnalysisResult {
  panelId: string;
  shadowPercentage: number;     // 0–100
  finalEfficiency: number;      // 0–100 after EOF penalty
  eof: number;                  // 0.0–1.0
  status: "Optimal" | "Partially Shaded" | "Heavily Shaded";
}

export interface TableAnalysisResult {
  tableId: string;
  panels: PanelAnalysisResult[];
  averageShadowPercentage: number;
  averageEfficiency: number;
  bestPanelId: string;
  worstPanelId: string;
}

// Allow THREE import in types file (used only as type reference)
import type * as THREE from "three";
