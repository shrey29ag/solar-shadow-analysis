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
  width: number;
  length: number;
  thickness: number;
  position: [number, number, number]; // Offset position relative to the SolarTable parent group
}

export interface SolarTableProps {
  id: string;
  position: [number, number, number]; // [X, Y, Z] position of the table base (Y is ground level)
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
