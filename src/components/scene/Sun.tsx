"use client";

import React, { useRef } from "react";
import * as THREE from "three";

interface SunProps {
  direction: [number, number, number]; // Normalized direction vector from the origin
  elevation: number;                  // Sun elevation in degrees
}

export default function Sun({ direction, elevation }: SunProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  const [dirX, dirY, dirZ] = direction;
  const distance = 60; // Distance of the sun sphere and light source from the origin

  // Place the light source far along the direction vector
  const lightPosition: [number, number, number] = [
    dirX * distance,
    dirY * distance,
    dirZ * distance,
  ];

  // Turn off light and hide sun if below the horizon
  const isDay = elevation > 0.1;
  const intensity = isDay ? 1.4 : 0;

  return (
    <>
      {/* Directional Light representing solar rays */}
      <directionalLight
        ref={dirLightRef}
        castShadow={isDay}
        position={lightPosition}
        intensity={intensity}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={120}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0005}
      />

      {/* Visual Sun Sphere */}
      {isDay && (
        <mesh position={lightPosition}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      )}
    </>
  );
}
