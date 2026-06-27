"use client";

import React, { useRef } from "react";
import * as THREE from "three";

export default function Lighting() {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Soft Ambient Light */}
      <ambientLight intensity={0.4} />

      {/* Directional Light (Morning Sun) */}
      <directionalLight
        ref={dirLightRef}
        castShadow
        position={[25, 15, 10]} // Positioned in the east/southeast, relatively low for morning shadows
        intensity={1.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0005}
      />
    </>
  );
}
