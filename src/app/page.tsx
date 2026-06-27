"use client";

import React, { useState, useCallback } from "react";
import Sidebar from "@/components/ui/Sidebar";
import Dashboard from "@/components/ui/Dashboard";
import MainCanvas from "@/components/scene/MainCanvas";
import { BuildingState, WaterTankState, SolarTableState, TableAnalysisResult } from "@/types";
import { calculateSunPosition, getSunDirectionVector } from "@/utils/sunEngine";

export default function Home() {
  // ── Scene object states ──────────────────────────────────────────────────
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

  // ── Sun states ───────────────────────────────────────────────────────────
  const [sunMode, setSunMode] = useState<"manual" | "automatic">("manual");
  const [manualAzimuth, setManualAzimuth] = useState<number>(135);
  const [manualElevation, setManualElevation] = useState<number>(30);
  const [date, setDate] = useState<string>("2026-06-27");
  const [time, setTime] = useState<string>("09:00");

  // ── Dashboard toggle ─────────────────────────────────────────────────────
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  // ── Analysis results from shadow engine ─────────────────────────────────
  const [analysisResults, setAnalysisResults] = useState<TableAnalysisResult[]>([]);

  // Derive active sun angles
  let activeAzimuth = manualAzimuth;
  let activeElevation = manualElevation;
  if (sunMode === "automatic") {
    const calc = calculateSunPosition(date, time);
    activeAzimuth = calc.azimuth;
    activeElevation = calc.elevation;
  }

  const sunDirection = getSunDirectionVector(activeAzimuth, activeElevation);

  const handleAnalysisUpdate = useCallback((results: TableAnalysisResult[]) => {
    setAnalysisResults(results);
  }, []);

  // Build table name lookup for Dashboard
  const tableNames: Record<string, string> = Object.fromEntries(
    solarTables.map((st) => [st.id, st.name])
  );

  return (
    <div className="app-container">
      <Sidebar
        buildings={buildings}
        setBuildings={setBuildings}
        waterTanks={waterTanks}
        setWaterTanks={setWaterTanks}
        solarTables={solarTables}
        setSolarTables={setSolarTables}
        sunMode={sunMode}
        setSunMode={setSunMode}
        manualAzimuth={manualAzimuth}
        setManualAzimuth={setManualAzimuth}
        manualElevation={manualElevation}
        setManualElevation={setManualElevation}
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
        activeAzimuth={activeAzimuth}
        activeElevation={activeElevation}
        analysisResults={analysisResults}
      />

      <div className="canvas-wrapper">
        {/* Dashboard toggle button */}
        <button
          id="dashboard-toggle"
          type="button"
          className="dashboard-toggle-btn"
          onClick={() => setShowDashboard((v) => !v)}
        >
          {showDashboard ? "✕ Close Dashboard" : "📊 Dashboard"}
        </button>

        <MainCanvas
          buildings={buildings}
          waterTanks={waterTanks}
          solarTables={solarTables}
          sunDirection={sunDirection}
          sunElevation={activeElevation}
          onAnalysisUpdate={handleAnalysisUpdate}
        />

        {/* Dashboard overlay */}
        {showDashboard && (
          <div className="dashboard-overlay">
            <Dashboard
              analysisResults={analysisResults}
              solarTableNames={tableNames}
            />
          </div>
        )}
      </div>
    </div>
  );
}
