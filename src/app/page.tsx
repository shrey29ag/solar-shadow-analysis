"use client";

import React, { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";
import MainCanvas from "@/components/scene/MainCanvas";
import { BuildingState, WaterTankState, SolarTableState } from "@/types";

export default function Home() {
  // Centralized interactive states
  const [buildings, setBuildings] = useState<BuildingState[]>([
    { id: "b1", name: "Building 1", width: 8, length: 12, height: 10, positionX: 12, positionY: 6, color: "#9ca3af" },
    { id: "b2", name: "Building 2", width: 10, length: 8, height: 6, positionX: -14, positionY: 14, color: "#b0b8c4" },
  ]);

  const [waterTanks, setWaterTanks] = useState<WaterTankState[]>([
    { id: "t1", name: "Water Tank 1", radius: 2.5, height: 8, positionX: 8, positionY: -8, color: "#78716c" },
    { id: "t2", name: "Water Tank 2", radius: 2.0, height: 5, positionX: -6, positionY: -12, color: "#878076" },
  ]);

  const [solarTables, setSolarTables] = useState<SolarTableState[]>([
    { id: "st1", name: "Solar Table 1", positionX: -2, positionY: 0 },
    { id: "st2", name: "Solar Table 2", positionX: 4, positionY: 8 },
  ]);

  return (
    <div className="app-container">
      <Sidebar
        buildings={buildings}
        setBuildings={setBuildings}
        waterTanks={waterTanks}
        setWaterTanks={setWaterTanks}
        solarTables={solarTables}
        setSolarTables={setSolarTables}
      />
      <MainCanvas
        buildings={buildings}
        waterTanks={waterTanks}
        solarTables={solarTables}
      />
    </div>
  );
}
