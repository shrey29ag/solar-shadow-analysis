"use client";

import React, { useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Camera from "./Camera";
import Lighting from "./Lighting";
import Ground from "./Ground";
import Building from "./Building";
import WaterTank from "./WaterTank";
import SolarTable from "./SolarTable";
import Sun from "./Sun";
import { BuildingState, WaterTankState, SolarTableState, TableAnalysisResult, PanelAnalysisResult } from "@/types";
import { computePanelEfficiency, computeTableEfficiency } from "@/utils/efficiencyEngine";

interface MainCanvasProps {
  buildings: BuildingState[];
  waterTanks: WaterTankState[];
  solarTables: SolarTableState[];
  sunDirection: [number, number, number];
  sunElevation: number;
  onAnalysisUpdate?: (results: TableAnalysisResult[]) => void;
}

// ─── Inner scene component that has access to useFrame ────────────────────────
interface SceneProps extends MainCanvasProps {
  panelRefsMap: React.MutableRefObject<Map<string, THREE.Mesh>>;
  occluderRefsMap: React.MutableRefObject<Map<string, THREE.Mesh>>;
}

function Scene({
  buildings,
  waterTanks,
  solarTables,
  sunDirection,
  sunElevation,
  onAnalysisUpdate,
  panelRefsMap,
  occluderRefsMap,
}: SceneProps) {
  const { scene } = useThree();
  const frameCountRef = useRef(0);

  // Analysis results state — local to Scene so we can pass to SolarTable
  const [tableResults, setTableResults] = React.useState<Map<string, PanelAnalysisResult[]>>(new Map());

  useFrame(() => {
    // Run shadow analysis every 6 frames (~10fps analysis rate) for performance
    frameCountRef.current++;
    if (frameCountRef.current % 6 !== 0) return;

    const sunDir = new THREE.Vector3(...sunDirection).normalize();

    // No analysis when sun is below horizon
    if (sunDir.y <= 0.01) {
      const nightResults = new Map<string, PanelAnalysisResult[]>();
      for (const st of solarTables) {
        const panels: PanelAnalysisResult[] = [];
        for (let col = 0; col < 3; col++) {
          for (let row = 0; row < 2; row++) {
            panels.push({
              panelId: `${st.id}-panel-${col}-${row}`,
              shadowPercentage: 100,
              finalEfficiency: 0,
              eof: 1,
              status: "Heavily Shaded",
            });
          }
        }
        nightResults.set(st.id, panels);
      }
      setTableResults(nightResults);
      return;
    }

    const raycaster = new THREE.Raycaster();
    raycaster.near = 0.05;
    raycaster.far = 300;

    // Collect occluder meshes (buildings + tanks)
    const occluderMeshes: THREE.Mesh[] = [];
    occluderRefsMap.current.forEach((mesh) => {
      if (mesh) occluderMeshes.push(mesh);
    });

    const newTableResults = new Map<string, PanelAnalysisResult[]>();

    for (const st of solarTables) {
      const panelResults: PanelAnalysisResult[] = [];

      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 2; row++) {
          const panelId = `${st.id}-panel-${col}-${row}`;
          const panelMesh = panelRefsMap.current.get(panelId);

          if (!panelMesh) {
            panelResults.push({
              panelId,
              shadowPercentage: 0,
              finalEfficiency: 100,
              eof: 0,
              status: "Optimal",
            });
            continue;
          }

          // Update world matrix
          panelMesh.updateWorldMatrix(true, false);
          const worldMatrix = panelMesh.matrixWorld;

          // Panel dimensions
          const panelWidth = 1.6;
          const panelLength = 1.0;

          // Generate 3×3 grid sample points in world space
          const xOffsets = [-panelWidth / 3, 0, panelWidth / 3];
          const zOffsets = [-panelLength / 3, 0, panelLength / 3];
          const hits: boolean[] = [];

          for (const dx of xOffsets) {
            for (const dz of zOffsets) {
              const localPt = new THREE.Vector3(dx, 0.08, dz);
              localPt.applyMatrix4(worldMatrix);

              raycaster.set(localPt, sunDir);
              const intersections = raycaster.intersectObjects(occluderMeshes, false);
              hits.push(intersections.length > 0);
            }
          }

          const effResult = computePanelEfficiency(panelId, hits);
          const shadowPct = effResult.shadowPercentage;
          const status =
            shadowPct <= 10
              ? "Optimal"
              : shadowPct <= 40
              ? "Partially Shaded"
              : "Heavily Shaded";

          panelResults.push({
            panelId,
            shadowPercentage: effResult.shadowPercentage,
            finalEfficiency: effResult.finalEfficiency,
            eof: effResult.eof,
            status,
          });
        }
      }

      newTableResults.set(st.id, panelResults);
    }

    setTableResults(newTableResults);

    // Notify parent with full table summaries
    if (onAnalysisUpdate) {
      const summaries: TableAnalysisResult[] = [];
      for (const st of solarTables) {
        const panels = newTableResults.get(st.id) ?? [];
        const eff = computeTableEfficiency(
          st.id,
          panels.map((p) => ({
            panelId: p.panelId,
            shadowPercentage: p.shadowPercentage,
            baseEfficiency: 100 - p.shadowPercentage,
            eof: p.eof,
            finalEfficiency: p.finalEfficiency,
          }))
        );
        summaries.push({
          tableId: st.id,
          panels,
          averageShadowPercentage: eff.averageShadowPercentage,
          averageEfficiency: eff.averageEfficiency,
          bestPanelId: eff.bestPanel.panelId,
          worstPanelId: eff.worstPanel.panelId,
        });
      }
      onAnalysisUpdate(summaries);
    }
  });

  const handleRegisterPanelRef = useCallback(
    (tableId: string, panelId: string, ref: THREE.Mesh | null) => {
      if (ref) {
        panelRefsMap.current.set(panelId, ref);
      } else {
        panelRefsMap.current.delete(panelId);
      }
    },
    [panelRefsMap]
  );

  return (
    <>
      <color attach="background" args={["#f3f4f6"]} />
      <Camera />
      <Lighting />
      <Sun direction={sunDirection} elevation={sunElevation} />
      <Ground />

      {/* Buildings — register meshes as occluders */}
      {buildings.map((b) => (
        <Building
          key={b.id}
          id={b.id}
          width={b.width}
          length={b.length}
          height={b.height}
          position={[b.positionX, 0, b.positionY]}
          color={b.color}
        />
      ))}

      {/* Water Tanks — register meshes as occluders */}
      {waterTanks.map((t) => (
        <WaterTank
          key={t.id}
          id={t.id}
          radius={t.radius}
          height={t.height}
          position={[t.positionX, 0, t.positionY]}
          color={t.color}
        />
      ))}

      {/* Solar Tables — with per-panel analysis results */}
      {solarTables.map((st) => (
        <SolarTable
          key={st.id}
          id={st.id}
          position={[st.positionX, 0, st.positionY]}
          analysisResults={tableResults.get(st.id)}
          onRegisterPanelRef={handleRegisterPanelRef}
        />
      ))}
    </>
  );
}

// ─── Occluder mesh collector helper ──────────────────────────────────────────
interface OccluderCollectorProps {
  buildings: BuildingState[];
  waterTanks: WaterTankState[];
  occluderRefsMap: React.MutableRefObject<Map<string, THREE.Mesh>>;
}

function OccluderCollector({ buildings, waterTanks, occluderRefsMap }: OccluderCollectorProps) {
  const { scene } = useThree();

  useFrame(() => {
    occluderRefsMap.current.clear();
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        // Collect building and water tank meshes by checking userData or name
        const isOccluder =
          obj.userData?.role === "occluder" ||
          (obj.castShadow && !obj.userData?.isPanel);
        if (isOccluder) {
          occluderRefsMap.current.set(obj.uuid, obj);
        }
      }
    });
  });

  return null;
}

// ─── Main exported Canvas wrapper ────────────────────────────────────────────
export default function MainCanvas({
  buildings,
  waterTanks,
  solarTables,
  sunDirection,
  sunElevation,
  onAnalysisUpdate,
}: MainCanvasProps) {
  const panelRefsMap = useRef<Map<string, THREE.Mesh>>(new Map());
  const occluderRefsMap = useRef<Map<string, THREE.Mesh>>(new Map());

  return (
    <div className="canvas-container">
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [25, 20, 25], fov: 45 }}
      >
        <Scene
          buildings={buildings}
          waterTanks={waterTanks}
          solarTables={solarTables}
          sunDirection={sunDirection}
          sunElevation={sunElevation}
          onAnalysisUpdate={onAnalysisUpdate}
          panelRefsMap={panelRefsMap}
          occluderRefsMap={occluderRefsMap}
        />
        <OccluderCollector
          buildings={buildings}
          waterTanks={waterTanks}
          occluderRefsMap={occluderRefsMap}
        />
      </Canvas>
    </div>
  );
}
