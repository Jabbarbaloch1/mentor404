"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 240;
const RADIUS = 2.6;
const CONNECTION_DISTANCE = 0.85;
const MAX_CONNECTIONS_PER_NODE = 3;

/** Deterministic pseudo-random so SSR/CSR don't mismatch. */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateSpherePoints(count: number, radius: number) {
  const rand = seededRandom(1337);
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere for even distribution, with slight jitter
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = ((Math.sqrt(5) - 1) / 2) * i * 2 * Math.PI;
    const jitter = 0.02 * (rand() - 0.5);
    const x = Math.cos(theta) * r + jitter;
    const z = Math.sin(theta) * r + jitter;
    points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }
  return points;
}

function buildConnections(points: THREE.Vector3[]) {
  const lines: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    let connCount = 0;
    for (let j = i + 1; j < points.length; j++) {
      if (connCount >= MAX_CONNECTIONS_PER_NODE) break;
      const dist = points[i].distanceTo(points[j]);
      if (dist < CONNECTION_DISTANCE) {
        lines.push([i, j]);
        connCount++;
      }
    }
  }
  return lines;
}

// A few nodes get randomly "activated" (pulse brighter) on an interval — the threat-map feel.
function ActiveNodes({ points }: { points: THREE.Vector3[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeIdx, setActiveIdx] = useState<Set<number>>(new Set());
  const timer = useRef(0);
  const rand = useRef(seededRandom(42));

  useFrame((_, delta) => {
    timer.current += delta;
    if (timer.current > 0.9) {
      timer.current = 0;
      const next = new Set<number>();
      const activations = 2 + Math.floor(rand.current() * 3);
      for (let i = 0; i < activations; i++) {
        next.add(Math.floor(rand.current() * points.length));
      }
      setActiveIdx(next);
    }
  });

  return (
    <group ref={groupRef}>
      {[...activeIdx].map((idx) => (
        <mesh key={idx} position={points[idx]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#22d3ee" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(() => generateSpherePoints(NODE_COUNT, RADIUS), []);
  const connections = useMemo(() => buildConnections(points), [points]);

  const nodesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [points]);

  const linesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(connections.length * 2 * 3);
    connections.forEach(([a, b], i) => {
      positions[i * 6] = points[a].x;
      positions[i * 6 + 1] = points[a].y;
      positions[i * 6 + 2] = points[a].z;
      positions[i * 6 + 3] = points[b].x;
      positions[i * 6 + 4] = points[b].y;
      positions[i * 6 + 5] = points[b].z;
    });
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [connections, points]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={nodesGeometry}>
        <pointsMaterial
          size={0.028}
          color="#7b7ff5"
          transparent
          opacity={0.85}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial
          color="#5b5fef"
          transparent
          opacity={0.18}
          toneMapped={false}
        />
      </lineSegments>
      <ActiveNodes points={points} />
      {/* inner core glow */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.7, 32, 32]} />
        <meshBasicMaterial color="#0a0b0f" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <Globe />
    </>
  );
}

export default function ThreatGlobe() {
  return (
    <div className="absolute inset-0 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
