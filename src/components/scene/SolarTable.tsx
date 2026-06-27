"use client";

import React, { useCallback } from "react";
import * as THREE from "three";
import { SolarTableProps, PanelAnalysisResult } from "@/types";
import SolarPanel from "./SolarPanel";

interface SolarTablePropsWithRefs extends SolarTableProps {
  analysisResults?: PanelAnalysisResult[];
  onRegisterPanelRef?: (tableId: string, panelId: string, ref: THREE.Mesh | null) => void;
}

export default function SolarTable({
  position,
  id,
  analysisResults,
  onRegisterPanelRef,
}: SolarTablePropsWithRefs) {
  const [x, y, z] = position;

  // Module dimensions
  const panelWidth = 1.6;
  const panelLength = 1.0;
  const panelThickness = 0.04;

  // Layout spacing
  const gapX = 0.02;
  const gapZ = 0.02;
  const colOffset = panelWidth + gapX; // 1.62m
  const rowOffset = panelLength + gapZ; // 1.02m

  const columns = [-colOffset, 0, colOffset]; // Left, center, right
  const rows = [-rowOffset / 2, rowOffset / 2]; // Back (tilted up), front (tilted down)

  // Structural properties
  const tiltDegrees = 15;
  const tiltRadians = (tiltDegrees * Math.PI) / 180;
  const pivotHeight = 1.2; // Pivot point Y height

  const legOffsetX = 1.5; // Legs distance from center in X
  const legOffsetZLocal = 0.85; // Legs offset from pivot along Z (tilted)

  // Calculate leg parameters
  const frontLegZWorld = legOffsetZLocal * Math.cos(tiltRadians);
  const frontLegYWorld = pivotHeight - legOffsetZLocal * Math.sin(tiltRadians);

  const backLegZWorld = -legOffsetZLocal * Math.cos(tiltRadians);
  const backLegYWorld = pivotHeight + legOffsetZLocal * Math.sin(tiltRadians);

  const handleRegisterRef = useCallback(
    (panelId: string, ref: THREE.Mesh | null) => {
      if (onRegisterPanelRef) {
        onRegisterPanelRef(id, panelId, ref);
      }
    },
    [id, onRegisterPanelRef]
  );

  // Build a lookup for analysis results by panelId
  const analysisMap = React.useMemo(() => {
    const map: Record<string, PanelAnalysisResult> = {};
    if (analysisResults) {
      for (const r of analysisResults) {
        map[r.panelId] = r;
      }
    }
    return map;
  }, [analysisResults]);

  return (
    <group position={[x, y, z]}>
      {/* Tilted Panel Array and Rails */}
      <group position={[0, pivotHeight, 0]} rotation={[-tiltRadians, 0, 0]}>
        {/* Under-Panel Support Rails */}
        <mesh position={[-legOffsetX, -panelThickness / 2 - 0.025, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.05, 2.2]} />
          <meshStandardMaterial color="#6b7280" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[legOffsetX, -panelThickness / 2 - 0.025, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.05, 2.2]} />
          <meshStandardMaterial color="#6b7280" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Crossbeam */}
        <mesh position={[0, -panelThickness / 2 - 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.04, 0.04]} />
          <meshStandardMaterial color="#4b5563" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Render 6 Panels in a 2x3 configuration */}
        {columns.map((colVal, colIdx) =>
          rows.map((rowVal, rowIdx) => {
            const panelId = `${id}-panel-${colIdx}-${rowIdx}`;
            const result = analysisMap[panelId];
            return (
              <SolarPanel
                key={panelId}
                panelId={panelId}
                width={panelWidth}
                length={panelLength}
                thickness={panelThickness}
                position={[colVal, 0, rowVal]}
                shadowStatus={result?.status}
                onRegisterRef={handleRegisterRef}
              />
            );
          })
        )}
      </group>

      {/* Structural Support Legs */}
      <mesh position={[-legOffsetX, frontLegYWorld / 2, frontLegZWorld]} castShadow receiveShadow>
        <boxGeometry args={[0.06, frontLegYWorld, 0.06]} />
        <meshStandardMaterial color="#6b7280" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[legOffsetX, frontLegYWorld / 2, frontLegZWorld]} castShadow receiveShadow>
        <boxGeometry args={[0.06, frontLegYWorld, 0.06]} />
        <meshStandardMaterial color="#6b7280" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-legOffsetX, backLegYWorld / 2, backLegZWorld]} castShadow receiveShadow>
        <boxGeometry args={[0.06, backLegYWorld, 0.06]} />
        <meshStandardMaterial color="#6b7280" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[legOffsetX, backLegYWorld / 2, backLegZWorld]} castShadow receiveShadow>
        <boxGeometry args={[0.06, backLegYWorld, 0.06]} />
        <meshStandardMaterial color="#6b7280" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}
