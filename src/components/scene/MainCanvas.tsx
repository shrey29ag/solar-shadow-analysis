"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import Camera from "./Camera";
import Lighting from "./Lighting";
import Ground from "./Ground";
import Building from "./Building";
import WaterTank from "./WaterTank";
import SolarTable from "./SolarTable";
import { BuildingState, WaterTankState, SolarTableState } from "@/types";

interface MainCanvasProps {
  buildings: BuildingState[];
  waterTanks: WaterTankState[];
  solarTables: SolarTableState[];
}

export default function MainCanvas({
  buildings,
  waterTanks,
  solarTables,
}: MainCanvasProps) {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        camera={{ position: [25, 20, 25], fov: 45 }}
      >
        {/* Set background color */}
        <color attach="background" args={["#f3f4f6"]} />

        {/* Camera & OrbitControls */}
        <Camera />

        {/* Lighting Setup */}
        <Lighting />

        {/* Ground and Grid */}
        <Ground />

        {/* Buildings */}
        {buildings.map((b) => (
          <Building
            key={b.id}
            id={b.id}
            width={b.width}
            length={b.length}
            height={b.height}
            position={[b.positionX, 0, b.positionY]} // Y is 0 (ground level), positionY maps to Z
            color={b.color}
          />
        ))}

        {/* Water Tanks */}
        {waterTanks.map((t) => (
          <WaterTank
            key={t.id}
            id={t.id}
            radius={t.radius}
            height={t.height}
            position={[t.positionX, 0, t.positionY]} // Y is 0 (ground level), positionY maps to Z
            color={t.color}
          />
        ))}

        {/* Solar Tables */}
        {solarTables.map((st) => (
          <SolarTable
            key={st.id}
            id={st.id}
            position={[st.positionX, 0, st.positionY]} // Y is 0 (ground level), positionY maps to Z
          />
        ))}
      </Canvas>
    </div>
  );
}
