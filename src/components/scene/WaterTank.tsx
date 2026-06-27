"use client";

import React from "react";
import { WaterTankProps } from "@/types";

export default function WaterTank({
  radius,
  height,
  position,
  color = "#78716c", // Neutral stone/metal gray
}: WaterTankProps) {
  const [x, y, z] = position;

  return (
    <mesh
      position={[x, y + height / 2, z]} // Shift Y to keep base at ground level
      castShadow
      receiveShadow
      userData={{ role: "occluder" }}
    >
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.6} // Metallic reflection for water tank cladding
      />
    </mesh>
  );
}
