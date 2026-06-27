"use client";

import React from "react";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";

export default function Camera() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[25, 20, 25]}
        fov={45}
        near={0.1}
        far={1000}
      />
      <OrbitControls
        enableRotate={true}
        enableZoom={true}
        enablePan={true}
        maxPolarAngle={Math.PI / 2 - 0.01} // Prevent orbiting below the ground plane
        minDistance={5}
        maxDistance={150}
      />
    </>
  );
}
