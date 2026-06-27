"use client";

import React from "react";
import { BuildingProps } from "@/types";

export default function Building({
  width,
  length,
  height,
  position,
  color = "#9ca3af", // Default neutral gray
}: BuildingProps) {
  const [x, y, z] = position;

  return (
    <mesh
      position={[x, y + height / 2, z]} // Shift up by half height so base is at y=0
      castShadow
      receiveShadow
    >
      <boxGeometry args={[width, height, length]} />
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}
