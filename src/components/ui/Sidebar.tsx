"use client";

import React from "react";
import { BuildingState, WaterTankState, SolarTableState } from "@/types";
import { NumberInput, PropertySection } from "./Controls";

interface SidebarProps {
  buildings: BuildingState[];
  setBuildings: React.Dispatch<React.SetStateAction<BuildingState[]>>;
  waterTanks: WaterTankState[];
  setWaterTanks: React.Dispatch<React.SetStateAction<WaterTankState[]>>;
  solarTables: SolarTableState[];
  setSolarTables: React.Dispatch<React.SetStateAction<SolarTableState[]>>;
}

export default function Sidebar({
  buildings,
  setBuildings,
  waterTanks,
  setWaterTanks,
  solarTables,
  setSolarTables,
}: SidebarProps) {

  // Update logic for Buildings
  const updateBuilding = (id: string, key: keyof BuildingState, value: number) => {
    setBuildings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: value } : b))
    );
  };

  // Update logic for Water Tanks
  const updateWaterTank = (id: string, key: keyof WaterTankState, value: number) => {
    setWaterTanks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [key]: value } : t))
    );
  };

  // Update logic for Solar Tables
  const updateSolarTable = (id: string, key: keyof SolarTableState, value: number) => {
    setSolarTables((prev) =>
      prev.map((st) => (st.id === id ? { ...st, [key]: value } : st))
    );
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Solar Shadow Analysis</h1>
        <div className="phase-badge">Phase 3</div>
        <p className="phase-subtitle">Interactive Scene Controls</p>
      </div>

      <div className="sidebar-scroll-area">
        {/* Buildings Section */}
        <PropertySection title="Buildings">
          {buildings.map((b) => (
            <div key={b.id} className="object-card">
              <div className="object-card-title">{b.name}</div>
              <NumberInput
                label="Position X"
                value={b.positionX}
                min={-30}
                max={30}
                step={0.5}
                onChange={(val) => updateBuilding(b.id, "positionX", val)}
              />
              <NumberInput
                label="Position Y"
                value={b.positionY}
                min={-30}
                max={30}
                step={0.5}
                onChange={(val) => updateBuilding(b.id, "positionY", val)}
              />
              <NumberInput
                label="Width (X)"
                value={b.width}
                min={1}
                max={25}
                step={0.5}
                onChange={(val) => updateBuilding(b.id, "width", val)}
              />
              <NumberInput
                label="Length (Z)"
                value={b.length}
                min={1}
                max={25}
                step={0.5}
                onChange={(val) => updateBuilding(b.id, "length", val)}
              />
              <NumberInput
                label="Height (Y)"
                value={b.height}
                min={1}
                max={20}
                step={0.5}
                onChange={(val) => updateBuilding(b.id, "height", val)}
              />
            </div>
          ))}
        </PropertySection>

        {/* Water Tanks Section */}
        <PropertySection title="Water Tanks">
          {waterTanks.map((t) => (
            <div key={t.id} className="object-card">
              <div className="object-card-title">{t.name}</div>
              <NumberInput
                label="Position X"
                value={t.positionX}
                min={-30}
                max={30}
                step={0.5}
                onChange={(val) => updateWaterTank(t.id, "positionX", val)}
              />
              <NumberInput
                label="Position Y"
                value={t.positionY}
                min={-30}
                max={30}
                step={0.5}
                onChange={(val) => updateWaterTank(t.id, "positionY", val)}
              />
              <NumberInput
                label="Radius"
                value={t.radius}
                min={0.5}
                max={10}
                step={0.1}
                onChange={(val) => updateWaterTank(t.id, "radius", val)}
              />
              <NumberInput
                label="Height"
                value={t.height}
                min={1}
                max={15}
                step={0.5}
                onChange={(val) => updateWaterTank(t.id, "height", val)}
              />
            </div>
          ))}
        </PropertySection>

        {/* Solar Tables Section */}
        <PropertySection title="Solar Tables">
          {solarTables.map((st) => (
            <div key={st.id} className="object-card">
              <div className="object-card-title">{st.name}</div>
              <NumberInput
                label="Position X"
                value={st.positionX}
                min={-30}
                max={30}
                step={0.5}
                onChange={(val) => updateSolarTable(st.id, "positionX", val)}
              />
              <NumberInput
                label="Position Y"
                value={st.positionY}
                min={-30}
                max={30}
                step={0.5}
                onChange={(val) => updateSolarTable(st.id, "positionY", val)}
              />
            </div>
          ))}
        </PropertySection>
      </div>
    </aside>
  );
}
