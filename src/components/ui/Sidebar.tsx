"use client";

import React from "react";
import { BuildingState, WaterTankState, SolarTableState, TableAnalysisResult } from "@/types";
import { NumberInput, PropertySection } from "./Controls";

interface SidebarProps {
  buildings: BuildingState[];
  setBuildings: React.Dispatch<React.SetStateAction<BuildingState[]>>;
  waterTanks: WaterTankState[];
  setWaterTanks: React.Dispatch<React.SetStateAction<WaterTankState[]>>;
  solarTables: SolarTableState[];
  setSolarTables: React.Dispatch<React.SetStateAction<SolarTableState[]>>;
  // Sun controls props
  sunMode: "manual" | "automatic";
  setSunMode: (mode: "manual" | "automatic") => void;
  manualAzimuth: number;
  setManualAzimuth: (val: number) => void;
  manualElevation: number;
  setManualElevation: (val: number) => void;
  date: string;
  setDate: (val: string) => void;
  time: string;
  setTime: (val: string) => void;
  activeAzimuth: number;
  activeElevation: number;
  // Phase 5 — analysis results
  analysisResults?: TableAnalysisResult[];
}

export default function Sidebar({
  buildings, setBuildings,
  waterTanks, setWaterTanks,
  solarTables, setSolarTables,
  sunMode, setSunMode,
  manualAzimuth, setManualAzimuth,
  manualElevation, setManualElevation,
  date, setDate,
  time, setTime,
  activeAzimuth, activeElevation,
  analysisResults,
}: SidebarProps) {

  const updateBuilding = (id: string, key: keyof BuildingState, value: number) => {
    setBuildings((prev) => prev.map((b) => (b.id === id ? { ...b, [key]: value } : b)));
  };
  const updateWaterTank = (id: string, key: keyof WaterTankState, value: number) => {
    setWaterTanks((prev) => prev.map((t) => (t.id === id ? { ...t, [key]: value } : t)));
  };
  const updateSolarTable = (id: string, key: keyof SolarTableState, value: number) => {
    setSolarTables((prev) => prev.map((st) => (st.id === id ? { ...st, [key]: value } : st)));
  };

  const statusColor = (status: string) => {
    if (status === "Optimal") return "#22c55e";
    if (status === "Partially Shaded") return "#eab308";
    return "#ef4444";
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Solar Shadow Analysis</h1>
      </div>

      <div className="sidebar-scroll-area">

        {/* ── Sun Controls ────────────────────────────────────────────── */}
        <PropertySection title="Sun Controls">
          <div className="control-row">
            <label className="control-label">Mode</label>
            <div className="sun-mode-toggle">
              <button type="button"
                className={`sun-mode-btn ${sunMode === "manual" ? "active" : ""}`}
                onClick={() => setSunMode("manual")}>Manual</button>
              <button type="button"
                className={`sun-mode-btn ${sunMode === "automatic" ? "active" : ""}`}
                onClick={() => setSunMode("automatic")}>Automatic</button>
            </div>
          </div>

          {sunMode === "manual" ? (
            <>
              <NumberInput label="Azimuth (°)" value={manualAzimuth} min={0} max={360} step={1} onChange={setManualAzimuth} />
              <NumberInput label="Elevation (°)" value={manualElevation} min={0} max={90} step={1} onChange={setManualElevation} />
            </>
          ) : (
            <>
              <div className="control-row">
                <label className="control-label">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="control-date-box" />
              </div>
              <div className="control-row">
                <label className="control-label">Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="control-time-box" />
              </div>
              <div className="sun-calculated-badge">
                <div>Computed Azimuth: <strong>{activeAzimuth.toFixed(1)}°</strong></div>
                <div>Computed Elevation: <strong>{activeElevation.toFixed(1)}°</strong></div>
              </div>
            </>
          )}
        </PropertySection>

        {/* ── Shadow Analysis Results ──────────────────────────────────── */}
        {analysisResults && analysisResults.length > 0 && (
          <PropertySection title="Shadow Analysis">
            {analysisResults.map((table) => {
              const tableName = solarTables.find((st) => st.id === table.tableId)?.name ?? table.tableId;
              return (
                <div key={table.tableId} className="object-card">
                  <div className="object-card-title">{tableName}</div>
                  <div className="analysis-row">
                    <span>Avg Shadow</span>
                    <span>{table.averageShadowPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="analysis-row">
                    <span>Avg Efficiency</span>
                    <span>{table.averageEfficiency.toFixed(1)}%</span>
                  </div>
                  <div className="analysis-row">
                    <span>Best Panel</span>
                    <span className="analysis-good">{table.bestPanelId.split("-").slice(-2).join("-")}</span>
                  </div>
                  <div className="analysis-row">
                    <span>Worst Panel</span>
                    <span className="analysis-bad">{table.worstPanelId.split("-").slice(-2).join("-")}</span>
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "0.7rem", color: "#6b7280" }}>
                    Panels:
                  </div>
                  <div className="panel-grid">
                    {table.panels.map((p) => (
                      <div
                        key={p.panelId}
                        className="panel-cell"
                        title={`${p.panelId} — Shadow: ${p.shadowPercentage.toFixed(0)}% | Eff: ${p.finalEfficiency.toFixed(0)}% | EOF: ${p.eof.toFixed(2)}`}
                        style={{ backgroundColor: statusColor(p.status) }}
                      >
                        {p.finalEfficiency.toFixed(0)}%
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </PropertySection>
        )}

        {/* ── Buildings ───────────────────────────────────────────────── */}
        <PropertySection title="Buildings">
          {buildings.map((b) => (
            <div key={b.id} className="object-card">
              <div className="object-card-title">{b.name}</div>
              <NumberInput label="Position X" value={b.positionX} min={-30} max={30} step={0.5} onChange={(val) => updateBuilding(b.id, "positionX", val)} />
              <NumberInput label="Position Y" value={b.positionY} min={-30} max={30} step={0.5} onChange={(val) => updateBuilding(b.id, "positionY", val)} />
              <NumberInput label="Width (X)" value={b.width} min={1} max={25} step={0.5} onChange={(val) => updateBuilding(b.id, "width", val)} />
              <NumberInput label="Length (Z)" value={b.length} min={1} max={25} step={0.5} onChange={(val) => updateBuilding(b.id, "length", val)} />
              <NumberInput label="Height (Y)" value={b.height} min={1} max={20} step={0.5} onChange={(val) => updateBuilding(b.id, "height", val)} />
            </div>
          ))}
        </PropertySection>

        {/* ── Water Tanks ─────────────────────────────────────────────── */}
        <PropertySection title="Water Tanks">
          {waterTanks.map((t) => (
            <div key={t.id} className="object-card">
              <div className="object-card-title">{t.name}</div>
              <NumberInput label="Position X" value={t.positionX} min={-30} max={30} step={0.5} onChange={(val) => updateWaterTank(t.id, "positionX", val)} />
              <NumberInput label="Position Y" value={t.positionY} min={-30} max={30} step={0.5} onChange={(val) => updateWaterTank(t.id, "positionY", val)} />
              <NumberInput label="Radius" value={t.radius} min={0.5} max={10} step={0.1} onChange={(val) => updateWaterTank(t.id, "radius", val)} />
              <NumberInput label="Height" value={t.height} min={1} max={15} step={0.5} onChange={(val) => updateWaterTank(t.id, "height", val)} />
            </div>
          ))}
        </PropertySection>

        {/* ── Solar Tables ────────────────────────────────────────────── */}
        <PropertySection title="Solar Tables">
          {solarTables.map((st) => (
            <div key={st.id} className="object-card">
              <div className="object-card-title">{st.name}</div>
              <NumberInput label="Position X" value={st.positionX} min={-30} max={30} step={0.5} onChange={(val) => updateSolarTable(st.id, "positionX", val)} />
              <NumberInput label="Position Y" value={st.positionY} min={-30} max={30} step={0.5} onChange={(val) => updateSolarTable(st.id, "positionY", val)} />
            </div>
          ))}
        </PropertySection>

      </div>
    </aside>
  );
}
