"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  MeshTransmissionMaterial,
  Text3D,
} from "@react-three/drei";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

const FONT_URL = "/fonts/helvetiker_bold.typeface.json";

const text3dOpts = {
  size: 0.38,
  height: 0.1,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 0.018,
  bevelSize: 0.014,
  bevelOffset: 0,
  bevelSegments: 3,
} as const;

const innerScale = 0.86;

export type LuxuryLandingPhase = "intro" | "shatter";

export type LandingPointerPayload = { nx: number; ny: number; inLogo: boolean };

function VideoEnvironmentMap({ video }: { video: HTMLVideoElement }) {
  const gl = useThree((s) => s.gl);
  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(video);
    t.colorSpace = gl.outputColorSpace;
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [video, gl.outputColorSpace]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    if (video.readyState >= 2) texture.needsUpdate = true;
  });

  return (
    <Environment
      map={texture}
      background={false}
      environmentIntensity={1.4}
      environmentRotation={[0, -0.2, 0]}
    />
  );
}

function useViewportScale() {
  const w = useThree((s) => s.size.width);
  return Math.min(1.35, Math.max(0.42, 420 / Math.max(w, 320)));
}

function EmeraldAuditLight({
  pointerRef,
}: {
  pointerRef: MutableRefObject<LandingPointerPayload>;
}) {
  const light = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const L = light.current;
    if (!L) return;
    const { nx, ny, inLogo } = pointerRef.current;
    L.position.set(nx * 4.2, ny * 2.6, 3.8);
    L.intensity = inLogo ? 3.2 : 0.85;
    L.distance = inLogo ? 9 : 6;
  });

  return (
    <pointLight
      ref={light}
      color="#00FF41"
      intensity={0.85}
      distance={6}
      decay={2}
    />
  );
}

function ShatterShards({
  phase,
  count,
}: {
  phase: LuxuryLandingPhase;
  count: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useRef<THREE.Vector3[]>([]);
  const velocities = useRef<THREE.Vector3[]>([]);
  const spins = useRef<THREE.Vector3[]>([]);
  const seeded = useRef(false);
  const shatterT = useRef(0);

  const geo = useMemo(() => new THREE.TetrahedronGeometry(0.032, 0), []);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e8f0ff",
        metalness: 0.08,
        roughness: 0.06,
        transmission: 0.91,
        thickness: 0.22,
        ior: 1.45,
        envMapIntensity: 2.4,
        transparent: true,
      }),
    [],
  );

  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat],
  );

  useLayoutEffect(() => {
    if (phase !== "shatter" || seeded.current) return;
    seeded.current = true;
    shatterT.current = 0;
    positions.current = [];
    velocities.current = [];
    spins.current = [];
    for (let i = 0; i < count; i++) {
      positions.current.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 0.65,
          (Math.random() - 0.5) * 0.35,
        ),
      );
      velocities.current.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 1.2,
          (Math.random() - 0.5) * 0.9,
          4.5 + Math.random() * 6.5,
        ),
      );
      spins.current.push(
        new THREE.Vector3(
          Math.random() * 4 - 2,
          Math.random() * 4 - 2,
          Math.random() * 4 - 2,
        ),
      );
    }
  }, [phase, count]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m || phase !== "shatter") return;
    shatterT.current += delta;
    const cap = 1.15;
    const drag = 0.985;
    for (let i = 0; i < count; i++) {
      const p = positions.current[i];
      const v = velocities.current[i];
      const s = spins.current[i];
      if (!p || !v || !s) continue;
      v.multiplyScalar(drag);
      p.addScaledVector(v, delta * (8 + shatterT.current * 2));
      dummy.position.copy(p);
      dummy.rotation.x += s.x * delta;
      dummy.rotation.y += s.y * delta;
      dummy.rotation.z += s.z * delta;
      const sc = THREE.MathUtils.clamp(0.35 + shatterT.current * 0.45, 0.35, 1.4);
      dummy.scale.setScalar(sc);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    if (shatterT.current > cap) {
      m.visible = false;
    }
  });

  if (phase !== "shatter") return null;

  return <instancedMesh ref={mesh} args={[geo, mat, count]} />;
}

function MkLuxuryScene({
  video,
  phase,
  pointerRef,
}: {
  video: HTMLVideoElement;
  phase: LuxuryLandingPhase;
  pointerRef: MutableRefObject<LandingPointerPayload>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const { clock } = useThree();
  const scale = useViewportScale();
  const narrow = useThree((s) => s.size.width < 640);
  const shardCount = narrow ? 380 : 1280;
  const transmissionSamples = narrow ? 6 : 10;
  const transmissionRes = narrow ? 256 : 512;

  const onPointerOver = useCallback(() => {
    pointerRef.current.inLogo = true;
  }, [pointerRef]);

  const onPointerOut = useCallback(() => {
    pointerRef.current.inLogo = false;
  }, [pointerRef]);

  useFrame((_, delta) => {
    if (phase === "shatter") {
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }
    if (groupRef.current) groupRef.current.visible = true;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }

    const inner = innerRef.current;
    if (inner) {
      const { nx, ny } = pointerRef.current;
      inner.position.x = THREE.MathUtils.lerp(inner.position.x, nx * 0.12, 0.06);
      inner.position.y = THREE.MathUtils.lerp(inner.position.y, ny * 0.08, 0.06);
      inner.rotation.y = THREE.MathUtils.lerp(inner.rotation.y, nx * 0.35, 0.05);
      inner.rotation.x = THREE.MathUtils.lerp(inner.rotation.x, -ny * 0.28, 0.05);
      const t = clock.elapsedTime;
      const ripple =
        Math.sin(t * 2.1) * 0.006 +
        Math.cos(t * 1.7 + nx * 3) * 0.005 +
        (nx * nx + ny * ny) * 0.012;
      inner.scale.setScalar(innerScale * (1 + ripple));
    }
  });

  const bgColor = useMemo(() => new THREE.Color("#0a0a0b"), []);

  return (
    <>
      <color attach="background" args={["#0a0a0b"]} />
      <ambientLight intensity={0.18} />
      <directionalLight
        position={[4, 5, 6]}
        intensity={0.55}
        color="#f2f4f8"
      />
      <directionalLight
        position={[-3, 1, -2]}
        intensity={0.22}
        color="#a8b4d8"
      />

      <VideoEnvironmentMap video={video} />
      <EmeraldAuditLight pointerRef={pointerRef} />

      <group scale={scale}>
        <ShatterShards phase={phase} count={shardCount} />

        <group
          ref={groupRef}
          position={[0, 0.08, 0]}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        >
          <group ref={innerRef}>
            <Text3D
              font={FONT_URL}
              {...text3dOpts}
              position={[-0.58, 0, -0.02]}
              scale={innerScale}
              letterSpacing={-0.02}
            >
              M
              <meshPhysicalMaterial
                color="#c5cad8"
                metalness={1}
                roughness={0.14}
                emissive="#1a2030"
                emissiveIntensity={0.35}
                envMapIntensity={1.8}
              />
            </Text3D>
            <Text3D
              font={FONT_URL}
              {...text3dOpts}
              position={[0.52, 0, -0.02]}
              scale={innerScale}
              letterSpacing={-0.02}
            >
              K
              <meshPhysicalMaterial
                color="#8e96a8"
                metalness={1}
                roughness={0.12}
                emissive="#0c1020"
                emissiveIntensity={0.4}
                envMapIntensity={2}
              />
            </Text3D>
          </group>

          <Text3D
            font={FONT_URL}
            {...text3dOpts}
            position={[-0.58, 0, 0]}
            letterSpacing={-0.02}
          >
            M
            <MeshTransmissionMaterial
              background={bgColor}
              transmission={1}
              thickness={1.5}
              roughness={0.08}
              ior={1.38}
              chromaticAberration={0.05}
              anisotropicBlur={0.12}
              samples={transmissionSamples}
              resolution={transmissionRes}
              color="#ffffff"
              attenuationColor="#ffffff"
              attenuationDistance={0.75}
            />
          </Text3D>
          <Text3D
            font={FONT_URL}
            {...text3dOpts}
            position={[0.52, 0, 0]}
            letterSpacing={-0.02}
          >
            K
            <MeshTransmissionMaterial
              background={bgColor}
              transmission={1}
              thickness={1.5}
              roughness={0.06}
              ior={1.42}
              chromaticAberration={0.05}
              anisotropicBlur={0.1}
              samples={transmissionSamples}
              resolution={transmissionRes}
              color="#f8f9fc"
              attenuationColor="#eef1f8"
              attenuationDistance={0.85}
            />
          </Text3D>
        </group>
      </group>
    </>
  );
}

export function MkLuxuryLandingCanvas({
  video,
  phase,
  pointerRef,
  className,
}: {
  video: HTMLVideoElement;
  phase: LuxuryLandingPhase;
  pointerRef: MutableRefObject<LandingPointerPayload>;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.15, 6.4], fov: 40, near: 0.1, far: 80 }}
        dpr={[1, Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 2)]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <MkLuxuryScene
            video={video}
            phase={phase}
            pointerRef={pointerRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
