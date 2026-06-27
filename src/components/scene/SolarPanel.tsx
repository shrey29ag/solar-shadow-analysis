"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { SolarPanelProps } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  Optimal: "#22c55e",            // green
  "Partially Shaded": "#eab308", // yellow
  "Heavily Shaded": "#ef4444",   // red
};

export default function SolarPanel({
  panelId,
  width,
  length,
  thickness,
  position,
  shadowStatus,
  onRegisterRef,
}: SolarPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const border = 0.03; // frame offset border (3cm)

  // Register this mesh with the parent table for raycasting
  React.useEffect(() => {
    if (onRegisterRef) {
      onRegisterRef(panelId, meshRef.current);
    }
    return () => {
      if (onRegisterRef) {
        onRegisterRef(panelId, null);
      }
    };
  }, [panelId, onRegisterRef]);

  const indicatorColor = shadowStatus
    ? STATUS_COLORS[shadowStatus]
    : "#9ca3af";

  return (
    <group position={position}>
      {/* Aluminum Outer Frame - color indicates shadow status */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[width, thickness, length]} />
        <meshStandardMaterial color={indicatorColor} roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Active PV Cells (sitting slightly above frame surface) */}
      <mesh position={[0, thickness / 2 + 0.001, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - border, 0.002, length - border]} />
        <meshStandardMaterial color="#0b132b" roughness={0.15} metalness={0.6} />
      </mesh>
    </group>
  );
}
