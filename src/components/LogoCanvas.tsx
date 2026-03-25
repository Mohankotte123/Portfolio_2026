"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Text3D,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

const text3dOpts = {
  size: 0.38,
  height: 0.1,
  curveSegments: 16,
  bevelEnabled: true,
  bevelThickness: 0.018,
  bevelSize: 0.014,
  bevelOffset: 0,
  bevelSegments: 4,
} as const;

function MkLogoScene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.32} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.15}
        color="#ffffff"
      />
      <directionalLight
        position={[-4, 2, -2]}
        intensity={0.45}
        color="#b8c8f0"
      />
      <spotLight
        position={[0, 8, 2]}
        angle={0.45}
        penumbra={0.85}
        intensity={0.55}
        color="#f0f4ff"
      />

      <Environment preset="studio" />

      <group ref={groupRef} position={[0, 0.08, 0]}>
        <Text3D
          font={FONT_URL}
          {...text3dOpts}
          position={[-0.58, 0, 0]}
          letterSpacing={-0.02}
        >
          M
          <meshPhysicalMaterial
            color="#c2c6ce"
            metalness={1}
            roughness={0.44}
            clearcoat={0.35}
            clearcoatRoughness={0.35}
            envMapIntensity={1.25}
          />
        </Text3D>
        <Text3D
          font={FONT_URL}
          {...text3dOpts}
          position={[0.52, 0, 0]}
          letterSpacing={-0.02}
        >
          K
          <meshPhysicalMaterial
            color="#0e1a33"
            metalness={0.98}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.12}
            envMapIntensity={1.45}
          />
        </Text3D>
      </group>

      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.38}
        scale={14}
        blur={2.4}
        far={5.5}
        color="#1a1a22"
      />
    </>
  );
}

export function LogoCanvas() {
  return (
    <div className="h-full min-h-[220px] w-full touch-none [&_canvas]:block">
      <Canvas
        camera={{ position: [0, 0.2, 6.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="h-full w-full"
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <MkLogoScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
