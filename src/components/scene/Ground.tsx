"use client";

import React from "react";

export default function Ground() {
  return (
    <group>
      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Grid Helper */}
      <gridHelper args={[100, 100, "#9ca3af", "#d1d5db"]} position={[0, 0, 0]} />
    </group>
  );
}
