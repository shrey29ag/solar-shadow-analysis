"use client";

import React from "react";
import { SolarPanelProps } from "@/types";

export default function SolarPanel({
  width,
  length,
  thickness,
  position,
}: SolarPanelProps) {
  const border = 0.03; // frame offset border (3cm)

  return (
    <group position={position}>
      {/* Aluminum Outer Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, thickness, length]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Active PV Cells (sitting slightly above frame surface) */}
      <mesh position={[0, thickness / 2 + 0.001, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - border, 0.002, length - border]} />
        <meshStandardMaterial color="#0b132b" roughness={0.15} metalness={0.6} />
      </mesh>
    </group>
  );
}
