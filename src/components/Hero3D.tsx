'use client';

import { Suspense, useRef, useMemo, useEffect, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial, Float, MeshDistortMaterial, Icosahedron, TorusKnot } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useTheme } from './ThemeProvider';
import { playScrollTick, startSpaceHum } from '../lib/audio';
import { createPlanetTexture, createSaturnRingTexture } from '../lib/planetTextures';
import type { Theme } from '@/lib/themes';

const MAX_SPARKLES = 500;

// Reusable temp vectors for per-frame meteor orientation (avoids GC churn).
const _up = new THREE.Vector3(0, 1, 0);
const _dir = new THREE.Vector3(0, 1, 0);

// A glowing meteor: molten head + additive halo + tapered fading tail.
// The parent orients this group so local +Y points along the direction of travel.
function Meteor({ headColor, tailColor }: { headColor: string; tailColor: string }) {
  return (
    <group>
      {/* Rocky molten head */}
      <mesh>
        <icosahedronGeometry args={[0.075, 1]} />
        <meshStandardMaterial color={headColor} emissive={headColor} emissiveIntensity={1.2} roughness={0.5} />
      </mesh>
      {/* Soft glow halo */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={headColor} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Tapered blazing tail (points backward along -Y, i.e. opposite travel) */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[0.11, 1.0, 16, 1, true]} />
        <meshBasicMaterial color={tailColor} transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner brighter tail core */}
      <mesh position={[0, -0.32, 0]}>
        <coneGeometry args={[0.055, 0.64, 12, 1, true]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Shared audio helper to trigger sound on crashes/clicks
const triggerCollisionSound = () => {
  try {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('portfolio-sound');
      if (savedSound !== 'false') {
        playScrollTick(0.018); // Crisp tick sound
      }
    }
  } catch (e) {}
};

// Rich background starfield with stable (steadily shining) stars
function Starfield({ count = 2000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color('#ffffff'), // White star
      new THREE.Color('#94d2ff'), // Bright blue-white star
      new THREE.Color('#ffccaa'), // Warm orange-red star
      new THREE.Color('#ffffcc'), // Glowing yellow star
    ];

    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      pos[i * 3 + 2] = Math.cos(phi) * r;

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      // Slow rotation
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.0012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <PointMaterial
        transparent
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        vertexColors
        opacity={0.8}
      />
    </points>
  );
}

// 120 prominent, bright 3D stars scattered in the deep background (shining steadily)
function BrightStars() {
  const refs = useRef<THREE.Mesh[]>([]);
  const starCount = 120;

  const starData = useMemo(() => {
    const arr = [];
    for (let i = 0; i < starCount; i++) {
      const r = 16 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      arr.push({
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.sin(phi) * Math.sin(theta) * r,
        z: Math.cos(phi) * r - 4,
        size: 0.035 + Math.random() * 0.045
      });
    }
    return arr;
  }, [starCount]);

  return (
    <group>
      {starData.map((data, i) => (
        <mesh
          key={`bright-star-${i}`}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={[data.x, data.y, data.z]}
        >
          <icosahedronGeometry args={[data.size, 1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

// Procedural floating droid — metallic body, blue LED eye, mechanical limbs, comm antenna.
// Retains the same ref-based pose system so existing animations (dancing, saluting, etc.) work unchanged.
function DroidCharacter({ pose, hangReleaseRef, jetpackNozzleRef, bodyColor }: {
  pose: 'dancing' | 'hanging' | 'saluting' | 'falling' | 'jumping' | 'driving' | 'selfie' | 'sleeping';
  // For the hanging droid: 0 = both hands grip, 1 = one hand released, 2 = both let go.
  hangReleaseRef?: MutableRefObject<number>;
  jetpackNozzleRef?: MutableRefObject<THREE.Object3D | null>;
  bodyColor?: string;
}) {
  const rootRef = useRef<THREE.Group>(null);   // body twist / swing / bounce / squash
  const headRef = useRef<THREE.Group>(null);   // head bob & nod
  const antRef = useRef<THREE.Group>(null);    // antenna wobble
  const laRef = useRef<THREE.Group>(null);     // left arm  (pivots at shoulder)
  const raRef = useRef<THREE.Group>(null);     // right arm (pivots at shoulder)
  const llRef = useRef<THREE.Group>(null);     // left leg  (pivots at hip)
  const rlRef = useRef<THREE.Group>(null);     // right leg (pivots at hip)

  // Per-instance phase so multiple droids never move in perfect lockstep.
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const isFalling = pose === 'falling';
  const isSleeping = pose === 'sleeping';

  useFrame((state) => {
    const root = rootRef.current;
    const la = laRef.current, ra = raRef.current, ll = llRef.current, rl = rlRef.current;
    if (!root || !la || !ra || !ll || !rl) return;
    const t = state.clock.getElapsedTime() + phase;

    // Neutral pose: arms 0 = hanging straight down.
    let laZ = -0.3, laX = 0, raZ = 0.3, raX = 0;
    let llX = 0, rlX = 0, llZ = 0, rlZ = 0;
    let rRotX = 0, rRotY = 0, rRotZ = 0, rPosY = 0, sx = 1, sy = 1;
    let hRotX = 0, hRotZ = 0;

    switch (pose) {
      case 'dancing': {
        const s = Math.sin(t * 6);
        const s2 = Math.sin(t * 6 + Math.PI);
        laZ = -1.7 + s * 0.7;  laX = s * 0.35;
        raZ = 1.7 + s2 * 0.7;  raX = s2 * 0.35;
        llX = s * 0.5;  rlX = s2 * 0.5;
        rRotY = Math.sin(t * 3) * 0.45;
        rRotZ = Math.sin(t * 6) * 0.12;
        rPosY = Math.abs(Math.sin(t * 6)) * 0.014;
        sy = 1 - s * 0.06;  sx = 1 + s * 0.06;
        hRotZ = s * 0.18;
        break;
      }
      case 'saluting': {
        const snap = Math.max(0, Math.sin(t * 2.2));
        raZ = 2.35;  raX = -0.45 + snap * 0.12;
        laZ = -2.35 + Math.sin(t * 5) * 0.45;  laX = -0.2;
        rRotY = Math.sin(t * 1.4) * 0.12;
        hRotZ = Math.sin(t * 1.4) * 0.06;
        break;
      }
      case 'hanging': {
        const rel = hangReleaseRef?.current ?? 0;
        const tremble = Math.sin(t * 10) * 0.06;
        if (rel < 1) {
          laZ = -2.75 + tremble;  laX = 0;
          raZ = 2.75 - tremble;   raX = 0;
          llX = Math.sin(t * 3.2) * 0.45;  rlX = Math.sin(t * 3.2 + 1.1) * 0.45;
          llZ = -0.12;  rlZ = 0.12;
          hRotX = 0.14;
        } else {
          laZ = -2.85 + tremble;  laX = 0;
          raZ = 0.7 + Math.sin(t * 12) * 0.9;  raX = Math.cos(t * 11) * 0.8;
          llX = Math.sin(t * 6) * 0.9;  rlX = Math.cos(t * 6) * 0.9;
          llZ = -0.15;  rlZ = 0.15;
          rRotZ = 0.55;
          hRotX = 0.2;
        }
        break;
      }
      case 'falling': {
        laZ = -1.0 + Math.sin(t * 15) * 1.9;  laX = Math.cos(t * 13) * 1.6;
        raZ = 1.0 + Math.sin(t * 16 + 1) * 1.9;  raX = Math.cos(t * 14 + 2) * 1.6;
        llX = Math.sin(t * 14) * 1.7;  rlX = Math.cos(t * 15) * 1.7;
        llZ = -0.2;  rlZ = 0.2;
        rRotZ = Math.sin(t * 22) * 0.12;
        break;
      }
      case 'driving': {
        const steer = Math.sin(t * 1.6);
        const bob = Math.sin(t * 2.3);
        laX = -1.35 + steer * 0.28;  laZ = -0.18;
        raX = -1.35 - steer * 0.28;  raZ = 0.18;
        llX = -1.45;  rlX = -1.45;
        llZ = -0.1;   rlZ = 0.1;
        rRotX = 0.18;
        rRotZ = steer * 0.14;
        rPosY = bob * 0.004;
        hRotZ = steer * 0.12;
        hRotX = 0.06 + bob * 0.05;
        break;
      }
      case 'jumping': {
        const flail = Math.sin(t * 10) * 0.12;
        laZ = -2.4 + flail;  laX = -0.35;
        raZ = 2.4 - flail;   raX = -0.35;
        llX = 1.7;  rlX = 1.7;
        llZ = -0.15;  rlZ = 0.15;
        break;
      }
      case 'selfie': {
        const wobble = Math.sin(t * 3) * 0.08;
        raZ = 2.2;  raX = -0.6 + wobble;
        laZ = -2.1 + wobble;  laX = -0.4;
        llX = 0.15;  rlX = -0.1;
        rRotY = Math.sin(t * 1.2) * 0.1;
        rRotZ = Math.sin(t * 2) * 0.04;
        hRotZ = Math.sin(t * 1.5) * 0.05;
        break;
      }
      case 'sleeping': {
        const breathe = Math.sin(t * 1.8) * 0.04;
        laZ = -0.5;  laX = 0.15;
        raZ = 0.5;   raX = 0.15;
        llX = 0.05;  rlX = -0.05;
        rRotX = 0.25;
        rPosY = breathe;
        sx = 1 + breathe * 0.5; sy = 1 - breathe * 0.5;
        hRotX = 0.3;
        break;
      }
    }

    la.rotation.set(laX, 0, laZ);
    ra.rotation.set(raX, 0, raZ);
    ll.rotation.set(llX, 0, llZ);
    rl.rotation.set(rlX, 0, rlZ);
    root.rotation.set(rRotX, rRotY, rRotZ);
    root.position.y = rPosY;
    root.scale.set(sx, sy, sx);
    if (headRef.current) headRef.current.rotation.set(hRotX, 0, hRotZ);
    if (antRef.current) antRef.current.rotation.z = Math.sin(t * 3) * 0.14;
  });

  const BODY_METAL = '#ffffff';    // Bright white astronaut suit
  const BODY_DARK = '#a1a1aa';     // Zinc-400 light gray for joints & mechanical contrast
  const ACCENT = bodyColor || '#60a5fa'; // accent color per droid

  return (
    <group scale={2.2}>
      <group ref={rootRef}>
        {/* ---------- Body (rounded metallic torso) ---------- */}
        <mesh position={[0, 0.05, 0]} scale={[1.0, 1.05, 0.8]}>
          <capsuleGeometry args={[0.022, 0.022, 6, 16]} />
          <meshStandardMaterial color={BODY_METAL} roughness={0.4} metalness={0.05} />
        </mesh>
        {/* Chest vent panel — accent color */}
        <mesh position={[0, 0.045, 0.022]} scale={[0.4, 0.15, 0.05]}>
          <planeGeometry args={[0.035, 0.015]} />
          <meshBasicMaterial color={ACCENT} opacity={0.7} transparent />
        </mesh>

        {/* ---------- Head (metallic sensor dome) ---------- */}
        <group ref={headRef} position={[0, 0.088, 0]}>
          <mesh scale={[1.0, 0.85, 0.95]}>
            <sphereGeometry args={[0.026, 20, 20]} />
            <meshStandardMaterial color={BODY_METAL} roughness={0.4} metalness={0.05} />
          </mesh>
          {/* Face plate — dark */}
          <mesh position={[0, 0, 0.022]} scale={[0.85, 0.7, 0.1]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#1f2937" roughness={0.5} metalness={0.3} />
          </mesh>

          {/* Blue LED eye */}
          <mesh position={[0, 0.002, 0.031]} scale={isSleeping ? [0.6, 0.08, 1] : isFalling ? [1.3, 1.3, 1] : [1, 0.6, 1]}>
            <planeGeometry args={[0.014, 0.01]} />
            <meshBasicMaterial color={ACCENT} />
          </mesh>
          {/* Eye glow halo */}
          <mesh position={[0, 0.002, 0.032]}>
            <planeGeometry args={[0.02, 0.015]} />
            <meshBasicMaterial color={ACCENT} transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* Mouth: LED bar or status indicator */}
          {isFalling ? (
            <mesh position={[0, -0.014, 0.031]} scale={[1, 1.2, 1]}>
              <planeGeometry args={[0.008, 0.004]} />
              <meshBasicMaterial color="#ef4444" /> {/* Red alert */}
            </mesh>
          ) : isSleeping ? (
            <mesh position={[0, -0.014, 0.031]}>
              <planeGeometry args={[0.004, 0.001]} />
              <meshBasicMaterial color="#60a5fa" opacity={0.3} transparent />
            </mesh>
          ) : (
            <mesh position={[0, -0.014, 0.031]}>
              <planeGeometry args={[0.008, 0.001]} />
              <meshBasicMaterial color="#60a5fa" opacity={0.6} transparent />
            </mesh>
          )}

          {/* Comm antenna (single, center) */}
          <group ref={antRef} position={[0, 0.022, 0]}>
            <mesh position={[0, 0.015, 0]}>
              <cylinderGeometry args={[0.001, 0.0012, 0.025, 6]} />
              <meshStandardMaterial color={BODY_DARK} roughness={0.4} metalness={0.1} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <sphereGeometry args={[0.004, 8, 8]} />
              <meshBasicMaterial color={isSleeping ? '#6b7280' : '#ef4444'} /> {/* Red LED tip */}
            </mesh>
          </group>
        </group>

        {/* ---------- Arms (segmented mechanical) ---------- */}
        {[{ ref: laRef, x: -0.021, flip: -1 }, { ref: raRef, x: 0.021, flip: 1 }].map((arm, i) => (
          <group key={i} ref={arm.ref} position={[arm.x, 0.062, 0]}>
            {/* Upper arm */}
            <mesh position={[0, -0.018, 0]} scale={[0.7, 1, 0.7]}>
              <capsuleGeometry args={[0.006, 0.018, 4, 10]} />
              <meshStandardMaterial color={BODY_METAL} roughness={0.4} metalness={0.05} />
            </mesh>
            {/* Elbow joint */}
            <mesh position={[0, -0.035, 0]}>
              <sphereGeometry args={[0.007, 10, 10]} />
              <meshStandardMaterial color={BODY_DARK} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Forearm */}
            <mesh position={[0, -0.05, 0]} scale={[0.6, 1, 0.6]}>
              <capsuleGeometry args={[0.0055, 0.016, 4, 10]} />
              <meshStandardMaterial color={BODY_METAL} roughness={0.4} metalness={0.05} />
            </mesh>
            {/* Claw hand */}
            <mesh position={[0, -0.065, 0]}>
              <coneGeometry args={[0.006, 0.01, 8]} />
              <meshStandardMaterial color={BODY_DARK} roughness={0.4} metalness={0.1} />
            </mesh>
          </group>
        ))}

        {/* ---------- Legs (mechanical struts) ---------- */}
        {[{ ref: llRef, x: -0.009 }, { ref: rlRef, x: 0.009 }].map((leg, i) => (
          <group key={i} ref={leg.ref} position={[leg.x, 0.022, 0]}>
            {/* Thigh */}
            <mesh position={[0, -0.012, 0]} scale={[0.7, 1, 0.7]}>
              <capsuleGeometry args={[0.0065, 0.014, 4, 10]} />
              <meshStandardMaterial color={BODY_METAL} roughness={0.4} metalness={0.05} />
            </mesh>
            {/* Knee joint */}
            <mesh position={[0, -0.024, 0]}>
              <sphereGeometry args={[0.007, 10, 10]} />
              <meshStandardMaterial color={BODY_DARK} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Lower leg */}
            <mesh position={[0, -0.035, 0]} scale={[0.65, 1, 0.65]}>
              <capsuleGeometry args={[0.0055, 0.014, 4, 10]} />
              <meshStandardMaterial color={BODY_METAL} roughness={0.4} metalness={0.05} />
            </mesh>
            {/* Gripper foot */}
            <mesh position={[0, -0.048, 0.003]} scale={[1.2, 0.4, 1.4]}>
              <sphereGeometry args={[0.008, 10, 10]} />
              <meshStandardMaterial color={BODY_DARK} roughness={0.4} metalness={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Jetpack — two thruster pods on the back */}
      <group position={[0, 0.05, -0.032]}>
        {[-0.015, 0.015].map((px, i) => (
          <group key={i} position={[px, 0, 0]}>
            {/* Thruster body */}
            <mesh position={[0, 0.008, 0]} rotation={[0.15, 0, 0]}>
              <cylinderGeometry args={[0.007, 0.01, 0.025, 10]} />
              <meshStandardMaterial color={BODY_METAL} roughness={0.4} metalness={0.05} />
            </mesh>
            {/* Nozzle ring */}
            <mesh position={[0, -0.012, 0.002]} rotation={[0.3, 0, 0]}>
              <torusGeometry args={[0.009, 0.002, 8, 12]} />
              <meshStandardMaterial color={BODY_DARK} roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Glow inside nozzle */}
            <mesh
              position={[0, -0.017, 0.003]}
              ref={(el) => {
                if (jetpackNozzleRef && i === 0) jetpackNozzleRef.current = el;
              }}
            >
              <sphereGeometry args={[0.005, 8, 8]} />
              <meshBasicMaterial color="#60a5fa" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// Simple type-safe Orbit Line
function OrbitLine({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: '#6688cc',
      opacity: 0.15,
      transparent: true
    });
  }, []);

  const lineMesh = useMemo(() => {
    return new THREE.Line(lineGeometry, lineMaterial);
  }, [lineGeometry, lineMaterial]);

  return <primitive object={lineMesh} />;
}

// Renders the original 3D shape meshes (Icosahedron / Torus Knot) for other themes
function ShapeMesh({ three }: { three: Theme['three'] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const baseRotX = t * 0.08;
    const baseRotY = t * 0.12;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, baseRotX + state.pointer.y * 0.7, 0.04);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, baseRotY + state.pointer.x * 0.7, 0.04);
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.pointer.x * 0.8, 0.04);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, state.pointer.y * 0.8, 0.04);
  });

  const material = three.wireframe ? (
    <meshStandardMaterial
      color={three.color}
      emissive={three.emissive}
      emissiveIntensity={0.3}
      wireframe
      metalness={three.metalness}
      roughness={three.roughness}
    />
  ) : (
    <MeshDistortMaterial
      color={three.color}
      emissive={three.emissive}
      emissiveIntensity={0.25}
      roughness={three.roughness}
      metalness={three.metalness}
      distort={three.distort}
      speed={1.6}
    />
  );

  const size = 1.35;
  if (three.shape === 'knot') {
    return <TorusKnot ref={ref} args={[size * 0.8, size * 0.28, 128, 32]}>{material}</TorusKnot>;
  }
  return <Icosahedron ref={ref} args={[size, three.wireframe ? 1 : 6]}>{material}</Icosahedron>;
}

// Glowing engine exhaust trail — ring buffer of past positions rendered as fading points.
// Updated imperatively by the parent ship's useFrame (no React re-renders).
function ExhaustTrail({ color, trailRef }: {
  color: string;
  trailRef: MutableRefObject<{
    positions: Float32Array;
    colors: Float32Array;
    head: number;
    length: number;
  }>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const TRAIL_LEN = 36;

  const trail = useMemo(() => ({
    positions: new Float32Array(TRAIL_LEN * 3),
    colors: new Float32Array(TRAIL_LEN * 3),
    head: 0,
    length: TRAIL_LEN,
  }), []);

  // Keep ref in sync so parent can write to it
  useMemo(() => {
    trailRef.current = trail;
  }, [trail, trailRef]);

  // Base color
  const baseColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position;
    const colAttr = geom.attributes.color;

    // Fade colors: head (index 0) = bright, tail = dim
    for (let i = 0; i < TRAIL_LEN; i++) {
      // Map ring index so that 'head' position is the brightest
      const ringIdx = (trail.head - i + TRAIL_LEN) % TRAIL_LEN;
      const fade = 1.0 - i / TRAIL_LEN;

      posAttr.setXYZ(i, trail.positions[ringIdx * 3], trail.positions[ringIdx * 3 + 1], trail.positions[ringIdx * 3 + 2]);

      // Core white → ship color → fade out
      const c = i < 4
        ? new THREE.Color('#ffffff').lerp(baseColor, i / 4)
        : baseColor.clone();
      c.multiplyScalar(fade * 0.9);
      colAttr.setXYZ(i, c.r, c.g, c.b);
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(TRAIL_LEN * 3), 3]} />
        <bufferAttribute attach="attributes-color" args={[new Float32Array(TRAIL_LEN * 3), 3]} />
      </bufferGeometry>
      <PointMaterial
        size={0.018}
        sizeAttenuation
        transparent
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.5}
      />
    </points>
  );
}

// Interactive Alien Ship component — sleek jet-style saucer

// Flying Droid — a droid that flies through space independently (like Superman / Iron Man).
// No ship hull, just the droid + jetpack exhaust trail + interactive behaviours.
function FlyingDroid({
  id,
  color,
  onExplode,
  onUpdatePosition,
  pose,
  mouseWorld,
  chaseTargetRef,
}: {
  id: number;
  color: string;
  onExplode: (x: number, y: number, z: number) => void;
  onUpdatePosition?: (x: number, y: number, z: number, active: boolean) => void;
  pose: 'dancing' | 'saluting' | 'driving' | 'none';
  mouseWorld: MutableRefObject<THREE.Vector3>;
  chaseTargetRef?: any;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const trailRef = useRef<any>(null);
  const jetpackNozzle = useRef<THREE.Object3D | null>(null);

  // Laser fire + spin state
  const laserRef = useRef<THREE.Mesh>(null);
  const laserState = useRef({ firing: false, timer: 0, fired: false });

  const flight = useMemo(() => {
    const isLeft = Math.random() > 0.5;
    return {
      x: isLeft ? -8 : 8,
      y: (Math.random() - 0.5) * 4,
      z: -0.5 - Math.random() * 2,
      vx: (isLeft ? 1 : -1) * (0.015 + Math.random() * 0.02),
      vy: (Math.random() - 0.5) * 0.01,
      vz: (Math.random() - 0.5) * 0.005,
      active: true,
      respawnTimer: 0,
    };
  }, []);

  const lastBlip = useRef(0);

  const resetFlight = () => {
    const isLeft = Math.random() > 0.5;
    flight.x = isLeft ? -8 : 8;
    flight.y = (Math.random() - 0.5) * 4;
    flight.z = -0.5 - Math.random() * 2;
    flight.vx = (isLeft ? 1 : -1) * (0.015 + Math.random() * 0.02);
    flight.vy = (Math.random() - 0.5) * 0.01;
    flight.vz = (Math.random() - 0.5) * 0.005;
    flight.active = true;
    flight.respawnTimer = 0;
    if (groupRef.current) groupRef.current.rotation.set(0, 0, 0);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!flight.active) return;
    laserState.current.firing = true;
    laserState.current.timer = 0;
    laserState.current.fired = false;
  };

  useFrame((state, delta) => {
    // --- Laser sequence ---
    if (laserState.current.firing) {
      laserState.current.timer += delta;
      if (laserRef.current) {
        laserRef.current.visible = true;
        laserRef.current.scale.x = 0.6 + Math.sin(laserState.current.timer * 40) * 0.3;
      }
      if (groupRef.current) {
        groupRef.current.rotation.z += delta * 18;
        groupRef.current.rotation.x += delta * 12;
      }
      if (laserState.current.timer > 0.6 && !laserState.current.fired) {
        laserState.current.fired = true;
        laserState.current.firing = false;
        if (laserRef.current) laserRef.current.visible = false;
        flight.active = false;
        onExplode(flight.x, flight.y, flight.z);
      }
      if (onUpdatePosition) onUpdatePosition(flight.x, flight.y, flight.z, false);
      return;
    }

    if (!flight.active) {
      if (onUpdatePosition) onUpdatePosition(0, 0, 0, false);
      flight.respawnTimer += delta;
      if (flight.respawnTimer > 2.0) resetFlight();
      return;
    }

    flight.x += flight.vx;
    flight.y += flight.vy;
    flight.z += flight.vz;

    // Tractor beam attraction
    const mw = mouseWorld.current;
    const dx = mw.x - flight.x, dy = mw.y - flight.y, dz = mw.z - flight.z;
    const distSq = dx * dx + dy * dy + dz * dz;
    if (distSq < 36 && distSq > 0.01) {
      const dist = Math.sqrt(distSq);
      const strength = 0.0008 * (1.0 - dist / 6.0);
      flight.x += (dx / dist) * strength;
      flight.y += (dy / dist) * strength;
      flight.z += (dz / dist) * strength * 0.3;
      const now = state.clock.getElapsedTime();
      if (now - lastBlip.current > 2.0) {
        lastBlip.current = now;
        triggerCollisionSound();
      }
    }

    // Chase following
    const chaseTarget = chaseTargetRef?.current;
    if (chaseTarget && chaseTarget.active) {
      const cdx = chaseTarget.x - flight.x, cdy = chaseTarget.y - flight.y, cdz = chaseTarget.z - flight.z;
      const cdist = Math.sqrt(cdx * cdx + cdy * cdy + cdz * cdz) || 1;
      flight.vx += (cdx / cdist) * 0.003;
      flight.vy += (cdy / cdist) * 0.003;
      flight.vz += (cdz / cdist) * 0.0015;
      flight.vx = THREE.MathUtils.clamp(flight.vx, -0.04, 0.04);
      flight.vy = THREE.MathUtils.clamp(flight.vy, -0.04, 0.04);
    }

    if (Math.abs(flight.x) > 9.0) resetFlight();

    if (groupRef.current) {
      groupRef.current.position.set(flight.x, flight.y, flight.z);
      groupRef.current.rotation.y = flight.vx >= 0 ? 0.25 : -0.25;
      groupRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 3 + id) * 0.002;
    }

    // Jetpack trail
    if (trailRef.current) {
      const trail = trailRef.current;
      // Offset behind based on jetpack nozzle position
      const tx = flight.x - flight.vx * 3;
      const ty = flight.y - flight.vy * 3 - 0.02;
      const tz = flight.z - flight.vz * 3;
      const idx = trail.head;
      trail.positions[idx * 3] = tx;
      trail.positions[idx * 3 + 1] = ty;
      trail.positions[idx * 3 + 2] = tz;
      trail.head = (trail.head + 1) % trail.length;
    }

    if (onUpdatePosition) onUpdatePosition(flight.x, flight.y, flight.z, flight.active);
  });

  return (
    <group ref={groupRef} visible={flight.active} onClick={handleClick}>
      {/* Droid with jetpack */}
      <DroidCharacter pose={pose as any} bodyColor={color} jetpackNozzleRef={jetpackNozzle} />

      {/* Laser beam (points downward during click) */}
      <group rotation={[Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <mesh ref={laserRef} visible={false}>
          <cylinderGeometry args={[0.006, 0.006, 2.5, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Exhaust trail from jetpack */}
      <ExhaustTrail color={color} trailRef={trailRef} />
    </group>
  );
}

// 3D planet definition
interface DisplayPlanet {
  name: string;
  radius: number;
  orbitRadius: number;
  orbitalSpeed: number;
  rotationSpeed: number;
  axialTilt: number;
  hasMoons?: boolean;
}

// Planet mesh component with axial tilt, rotation, and moons
function PlanetMesh({ planet }: { planet: DisplayPlanet }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const moon1Ref = useRef<THREE.Mesh>(null);
  const moon2Ref = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => createPlanetTexture(planet.name), [planet.name]);
  const ringTexture = useMemo(() => {
    if (planet.name === 'Saturn') return createSaturnRingTexture();
    return null;
  }, [planet.name]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const angle = (state.clock.getElapsedTime() * planet.orbitalSpeed) % (Math.PI * 2);
      groupRef.current.position.set(
        Math.cos(angle) * planet.orbitRadius,
        0,
        Math.sin(angle) * planet.orbitRadius
      );
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * planet.rotationSpeed;
    }

    // Animate Earth's Moon
    if (planet.name === 'Earth' && moon1Ref.current) {
      const moonAngle = state.clock.getElapsedTime() * 1.5;
      moon1Ref.current.position.set(
        Math.cos(moonAngle) * 0.28,
        0,
        Math.sin(moonAngle) * 0.28
      );
      moon1Ref.current.rotation.y += delta * 0.5;
    }

    // Animate Jupiter's 2 Moons (Io & Europa)
    if (planet.name === 'Jupiter') {
      if (moon1Ref.current) {
        const ioAngle = state.clock.getElapsedTime() * 2.0;
        moon1Ref.current.position.set(Math.cos(ioAngle) * 0.48, 0, Math.sin(ioAngle) * 0.48);
      }
      if (moon2Ref.current) {
        const europaAngle = state.clock.getElapsedTime() * 1.3 + 1.5;
        moon2Ref.current.position.set(Math.cos(europaAngle) * 0.62, 0.05, Math.sin(europaAngle) * 0.62);
      }
    }
  });

  return (
    <group ref={groupRef}>
      <group rotation={[planet.axialTilt, 0, 0]}>
        <mesh ref={meshRef} castShadow receiveShadow>
          <sphereGeometry args={[planet.radius, 48, 48]} />
          <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Saturn Rings */}
        {planet.name === 'Saturn' && ringTexture && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[planet.radius * 1.3, planet.radius * 2.4, 64]} />
            <meshStandardMaterial map={ringTexture} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Earth's Moon */}
        {planet.name === 'Earth' && (
          <mesh ref={moon1Ref}>
            <sphereGeometry args={[0.032, 16, 16]} />
            <meshStandardMaterial color="#888888" roughness={0.9} />
          </mesh>
        )}

        {/* Jupiter's Moons */}
        {planet.name === 'Jupiter' && (
          <>
            {/* Io */}
            <mesh ref={moon1Ref}>
              <sphereGeometry args={[0.028, 12, 12]} />
              <meshStandardMaterial color="#d4c553" roughness={0.9} />
            </mesh>
            {/* Europa */}
            <mesh ref={moon2Ref}>
              <sphereGeometry args={[0.024, 12, 12]} />
              <meshStandardMaterial color="#b3c7c7" roughness={0.8} />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}

// Occasional comet — a bright head with a very long fading tail that crosses
// the screen periodically from a random edge. Driven imperatively in useFrame.
function Comet() {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Points>(null);

  const TAIL_LEN = 60;
  const trail = useMemo(() => ({
    positions: new Float32Array(TAIL_LEN * 3),
    head: 0,
    length: TAIL_LEN,
  }), []);

  const comet = useRef({
    active: false,
    x: 0, y: 0, z: -3,
    vx: 0, vy: 0, vz: 0,
    cooldown: 8 + Math.random() * 12, // first appearance after 8-20s
    color: '#88ccff',
  });

  useFrame((_state, delta) => {
    const c = comet.current;
    if (!c.active) {
      c.cooldown -= delta;
      if (c.cooldown <= 0) {
        // Launch from a random edge
        const side = Math.floor(Math.random() * 4);
        const speed = 0.08 + Math.random() * 0.06;
        if (side === 0) { c.x = -14; c.y = (Math.random() - 0.5) * 8; c.vx = speed; c.vy = (Math.random() - 0.5) * 0.02; }
        else if (side === 1) { c.x = 14; c.y = (Math.random() - 0.5) * 8; c.vx = -speed; c.vy = (Math.random() - 0.5) * 0.02; }
        else if (side === 2) { c.y = 8; c.x = (Math.random() - 0.5) * 14; c.vy = -speed; c.vx = (Math.random() - 0.5) * 0.02; }
        else { c.y = -8; c.x = (Math.random() - 0.5) * 14; c.vy = speed; c.vx = (Math.random() - 0.5) * 0.02; }
        c.z = -3 - Math.random() * 2;
        c.vz = (Math.random() - 0.5) * 0.005;
        c.active = true;
        // Random warm or cool color
        const colors = ['#88ccff', '#ffcc66', '#ff88cc', '#66ffcc'];
        c.color = colors[Math.floor(Math.random() * colors.length)];
      }
      if (groupRef.current) groupRef.current.visible = false;
      if (tailRef.current) tailRef.current.visible = false;
      return;
    }

    c.x += c.vx;
    c.y += c.vy;
    c.z += c.vz;

    // Off screen? Reset
    if (Math.abs(c.x) > 16 || Math.abs(c.y) > 10) {
      c.active = false;
      c.cooldown = 12 + Math.random() * 15; // reappear after 12-27s
      return;
    }

    // Update trail ring buffer
    const idx = trail.head;
    trail.positions[idx * 3] = c.x;
    trail.positions[idx * 3 + 1] = c.y;
    trail.positions[idx * 3 + 2] = c.z;
    trail.head = (trail.head + 1) % trail.length;

    if (groupRef.current) {
      groupRef.current.visible = true;
      groupRef.current.position.set(c.x, c.y, c.z);
    }

    // Update tail points
    if (tailRef.current) {
      tailRef.current.visible = true;
      const geom = tailRef.current.geometry;
      const posAttr = geom.attributes.position;
      const colAttr = geom.attributes.color;
      const baseCol = new THREE.Color(c.color);
      const whiteCol = new THREE.Color('#ffffff');

      for (let i = 0; i < TAIL_LEN; i++) {
        const ringIdx = (trail.head - 1 - i + TAIL_LEN) % TAIL_LEN;
        posAttr.setXYZ(i, trail.positions[ringIdx * 3], trail.positions[ringIdx * 3 + 1], trail.positions[ringIdx * 3 + 2]);
        const fade = 1.0 - i / TAIL_LEN;
        const col = i < 3 ? whiteCol.clone().lerp(baseCol, i / 3) : baseCol.clone();
        col.multiplyScalar(fade * 0.8);
        colAttr.setXYZ(i, col.r, col.g, col.b);
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Comet head — bright glowing sphere */}
      <group ref={groupRef} visible={false}>
        <mesh>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshBasicMaterial color="#88ccff" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <pointLight distance={3} intensity={1.5} color="#aaddff" />
      </group>
      {/* Long fading tail */}
      <points ref={tailRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(TAIL_LEN * 3), 3]} />
          <bufferAttribute attach="attributes-color" args={[new Float32Array(TAIL_LEN * 3), 3]} />
        </bufferGeometry>
        <PointMaterial size={0.03} sizeAttenuation transparent vertexColors depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} />
      </points>
    </group>
  );
}

// Occasional Shooting Star (Toota Tara) — a fast bright small point with a thin trail
function ShootingStar({
  id,
  planetColliders,
  droidColliders,
  onExplode,
}: {
  id: number;
  planetColliders: DisplayPlanet[];
  droidColliders: React.MutableRefObject<Record<number, { x: number; y: number; z: number; active: boolean }>>;
  onExplode: (x: number, y: number, z: number, color: string) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);

  const TRAIL_LEN = 14;
  const trail = useMemo(() => ({
    positions: new Float32Array(TRAIL_LEN * 3),
    colors: new Float32Array(TRAIL_LEN * 3),
    head: 0,
    length: TRAIL_LEN,
  }), []);

  const state = useRef({
    active: false,
    x: 0, y: 0, z: 0,
    vx: 0, vy: 0, vz: 0,
    cooldown: 0.5 + Math.random() * 3.5 + id * 1.5, // staggered starting delays
    color: '#ffffff',
    radius: 0.035,
  });

  const launch = () => {
    const s = state.current;
    const side = Math.floor(Math.random() * 4);
    const speed = 0.015 + Math.random() * 0.012; // slow, elegant moving speed

    if (side === 0) { // left
      s.x = -8.5; s.y = (Math.random() - 0.5) * 5;
      s.vx = speed; s.vy = (Math.random() - 0.5) * 0.04;
    } else if (side === 1) { // right
      s.x = 8.5; s.y = (Math.random() - 0.5) * 5;
      s.vx = -speed; s.vy = (Math.random() - 0.5) * 0.04;
    } else if (side === 2) { // top
      s.y = 4.8; s.x = (Math.random() - 0.5) * 9;
      s.vy = -speed; s.vx = (Math.random() - 0.5) * 0.04;
    } else { // bottom
      s.y = -4.8; s.x = (Math.random() - 0.5) * 9;
      s.vy = speed; s.vx = (Math.random() - 0.5) * 0.04;
    }
    s.z = -1.0 - Math.random() * 2.0;
    s.vz = (Math.random() - 0.5) * 0.01;

    // Vibrant colors
    const colors = ['#ff2a6d', '#05d9e8', '#00fe9b', '#f5a623', '#b967ff', '#ff3dfd', '#fffa37'];
    s.color = colors[Math.floor(Math.random() * colors.length)];
    s.active = true;
    s.cooldown = 0;
    s.radius = 0.02 + Math.random() * 0.02;

    for (let i = 0; i < TRAIL_LEN; i++) {
      trail.positions[i * 3] = s.x;
      trail.positions[i * 3 + 1] = s.y;
      trail.positions[i * 3 + 2] = s.z;
    }
  };

  useFrame((ctx, delta) => {
    const s = state.current;
    if (!s.active) {
      s.cooldown -= delta;
      if (s.cooldown <= 0) {
        launch();
      }
      if (ref.current) ref.current.visible = false;
      if (trailRef.current) trailRef.current.visible = false;
      return;
    }

    s.x += s.vx;
    s.y += s.vy;
    s.z += s.vz;

    // Check bounds
    if (Math.abs(s.x) > 9.2 || Math.abs(s.y) > 5.5 || Math.abs(s.z) > 10) {
      s.active = false;
      s.cooldown = 3.0 + Math.random() * 5.0; // reappear after 3-8s
      return;
    }

    if (ref.current) {
      ref.current.visible = true;
      ref.current.position.set(s.x, s.y, s.z);
      const headMesh = ref.current.children[0] as THREE.Mesh;
      if (headMesh && headMesh.material) {
        (headMesh.material as THREE.MeshBasicMaterial).color.set(s.color);
      }
    }

    // Update trail
    const idx = trail.head;
    trail.positions[idx * 3] = s.x;
    trail.positions[idx * 3 + 1] = s.y;
    trail.positions[idx * 3 + 2] = s.z;
    trail.head = (trail.head + 1) % trail.length;

    if (trailRef.current) {
      trailRef.current.visible = true;
      const geom = trailRef.current.geometry;
      const posAttr = geom.attributes.position;
      const colAttr = geom.attributes.color;
      const baseCol = new THREE.Color(s.color);
      const whiteCol = new THREE.Color('#ffffff');

      for (let i = 0; i < TRAIL_LEN; i++) {
        const ringIdx = (trail.head - 1 - i + TRAIL_LEN) % TRAIL_LEN;
        posAttr.setXYZ(i, trail.positions[ringIdx * 3], trail.positions[ringIdx * 3 + 1], trail.positions[ringIdx * 3 + 2]);
        const fade = 1.0 - (i / TRAIL_LEN);
        const col = i < 2 ? whiteCol.clone().lerp(baseCol, i / 2) : baseCol.clone();
        col.multiplyScalar(fade * 0.7);
        colAttr.setXYZ(i, col.r, col.g, col.b);
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    // --- Collision check ---
    const time = ctx.clock.getElapsedTime();

    // 1. Planet collision check
    for (const planet of planetColliders) {
      const angle = (time * planet.orbitalSpeed) % (Math.PI * 2);
      const px = Math.cos(angle) * planet.orbitRadius;
      const py = 0;
      const pz = Math.sin(angle) * planet.orbitRadius;

      const dx = s.x - px;
      const dy = s.y - py;
      const dz = s.z - pz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < planet.radius + s.radius + 0.05) {
        s.active = false;
        s.cooldown = 3.0 + Math.random() * 5.0;
        onExplode(s.x, s.y, s.z, s.color);
        return;
      }
    }

    // 2. Droid collision check
    const droids = droidColliders.current;
    for (const droidId in droids) {
      const droid = droids[droidId];
      if (droid && droid.active) {
        const dx = s.x - droid.x;
        const dy = s.y - droid.y;
        const dz = s.z - droid.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 0.22) { // bounding box of droid
          s.active = false;
          s.cooldown = 4.0 + Math.random() * 6.0;
          onExplode(s.x, s.y, s.z, s.color);
          return;
        }
      }
    }
  });

  return (
    <group>
      {/* Head */}
      <group ref={ref} visible={false}>
        <mesh>
          <sphereGeometry args={[state.current.radius, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Removed the round halo circle over the shooting star head as requested */}
      </group>
      {/* Trail */}
      <points ref={trailRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(TRAIL_LEN * 3), 3]} />
          <bufferAttribute attach="attributes-color" args={[new Float32Array(TRAIL_LEN * 3), 3]} />
        </bufferGeometry>
        <PointMaterial size={0.024} sizeAttenuation transparent vertexColors depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.8} />
      </points>
    </group>
  );
}

// Clean cosmic space scene containing floating planets, moons, meteors, and ships
function CleanSpaceScene() {
  const { theme } = useTheme();
  const { three } = theme;
  const { camera } = useThree();
  const systemGroupRef = useRef<THREE.Group>(null);

  // Mouse world position (projected from pointer onto z=0 plane) — shared with ships for tractor beam
  const mouseWorld = useRef(new THREE.Vector3(9999, 9999, 9999));
  const _raycaster = useMemo(() => new THREE.Raycaster(), []);
  const _pointerPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const _intersect = useMemo(() => new THREE.Vector3(), []);

  // Meteor refs
  const m1Ref = useRef<THREE.Group>(null);
  const m2Ref = useRef<THREE.Group>(null);

  // Meteor trajectories
  const meteor1 = useRef({ x: -8, y: 1.5, z: -1.5, vx: 0.05, vy: -0.012, vz: 0.012, active: true, delay: 0 });
  const meteor2 = useRef({ x: 8, y: -1.5, z: -3.5, vx: -0.05, vy: 0.012, vz: 0.032, active: true, delay: 0 });

  // Sparkles buffer arrays for explosions
  const sparklesRef = useRef<{
    positions: Float32Array;
    colors: Float32Array;
    data: Array<{
      vx: number; vy: number; vz: number;
      life: number; decay: number;
    }>;
    activeCount: number;
  }>({
    positions: new Float32Array(MAX_SPARKLES * 3),
    colors: new Float32Array(MAX_SPARKLES * 3),
    data: Array.from({ length: MAX_SPARKLES }, () => ({ vx: 0, vy: 0, vz: 0, life: 0, decay: 0 })),
    activeCount: 0
  });

  const sparklesPointsRef = useRef<THREE.Points>(null);

  // Selfie droid — floats near center
  const selfieAlienRef = useRef<THREE.Group>(null);

  // Droid positions tracking for shooting star collisions
  const droidPositions = useRef<Record<number, { x: number; y: number; z: number; active: boolean }>>({});

  const updateDroidPosition = (id: number, x: number, y: number, z: number, active: boolean) => {
    droidPositions.current[id] = { x, y, z, active };
  };

  // 5 main beautiful recognizable planets
  const displayPlanets: DisplayPlanet[] = useMemo(() => [
    { name: 'Venus', radius: 0.12, orbitRadius: 1.0, orbitalSpeed: 0.15, rotationSpeed: 0.2, axialTilt: 3.09 },
    { name: 'Earth', radius: 0.14, orbitRadius: 1.6, orbitalSpeed: 0.10, rotationSpeed: 0.6, axialTilt: 0.41 },
    { name: 'Mars', radius: 0.09, orbitRadius: 2.2, orbitalSpeed: 0.08, rotationSpeed: 0.5, axialTilt: 0.44 },
    { name: 'Jupiter', radius: 0.32, orbitRadius: 3.2, orbitalSpeed: 0.05, rotationSpeed: 1.2, axialTilt: 0.05 },
    { name: 'Saturn', radius: 0.26, orbitRadius: 4.4, orbitalSpeed: 0.03, rotationSpeed: 1.0, axialTilt: 0.47 },
  ], []);


  const calculateCollisionTrajectory = () => {
    const m1 = meteor1.current;
    const m2 = meteor2.current;

    const cx = (Math.random() - 0.5) * 1.8;
    const cy = (Math.random() - 0.5) * 1.2;
    const cz = -2.0;

    const N = 120; // steps

    m1.x = -8;
    m1.y = 1.0 + Math.random() * 2;
    m1.z = -1 - Math.random() * 2;
    m1.vx = (cx - m1.x) / N;
    m1.vy = (cy - m1.y) / N;
    m1.vz = (cz - m1.z) / N;
    m1.active = true;
    m1.delay = 0;

    m2.x = 8;
    m2.y = -1.0 - Math.random() * 2;
    m2.z = -2 - Math.random() * 2;
    m2.vx = (cx - m2.x) / N;
    m2.vy = (cy - m2.y) / N;
    m2.vz = (cz - m2.z) / N;
    m2.active = true;
    m2.delay = 0;
  };

  const triggerExplosion = (x: number, y: number, z: number, customColor?: string) => {
    const s = sparklesRef.current;
    const count = customColor ? 80 : 130;

    triggerCollisionSound();

    // Vibrant colors for custom explosions
    const explosionColors = ['#ff2a6d', '#05d9e8', '#00fe9b', '#f5a623', '#b967ff', '#ff3dfd', '#fffa37', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const idx = (s.activeCount + i) % MAX_SPARKLES;

      s.positions[idx * 3] = x;
      s.positions[idx * 3 + 1] = y;
      s.positions[idx * 3 + 2] = z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const speed = customColor ? (0.015 + Math.random() * 0.038) : (0.022 + Math.random() * 0.045);

      s.data[idx].vx = Math.sin(phi) * Math.cos(theta) * speed;
      s.data[idx].vy = Math.sin(phi) * Math.sin(theta) * speed;
      s.data[idx].vz = Math.cos(phi) * speed;

      s.data[idx].life = 1.0;
      s.data[idx].decay = customColor ? (0.02 + Math.random() * 0.02) : (0.015 + Math.random() * 0.015);

      let c: THREE.Color;
      if (customColor) {
        // Multi-colored explosion: blend custom color with random highlights
        const randomColorHex = explosionColors[Math.floor(Math.random() * explosionColors.length)];
        c = new THREE.Color(customColor).clone().lerp(new THREE.Color(randomColorHex), Math.random() * 0.7);
      } else {
        const colorA = new THREE.Color(three.color || '#ff9d5c');
        const colorB = new THREE.Color(three.emissive || '#8fd3ff');
        c = colorA.clone().lerp(colorB, Math.random());
      }

      s.colors[idx * 3] = c.r;
      s.colors[idx * 3 + 1] = c.g;
      s.colors[idx * 3 + 2] = c.b;
    }

    s.activeCount = Math.min(MAX_SPARKLES, s.activeCount + count);
  };

  useFrame((state) => {
    // Project mouse pointer into world-space for tractor beam
    _raycaster.setFromCamera(state.pointer, camera);
    if (_raycaster.ray.intersectPlane(_pointerPlane, _intersect)) {
      mouseWorld.current.copy(_intersect);
    }

    // Parallax mouse tilt for 3D depth
    if (systemGroupRef.current) {
      systemGroupRef.current.rotation.x = THREE.MathUtils.lerp(systemGroupRef.current.rotation.x, 0.35 + state.pointer.y * 0.15, 0.05);
      systemGroupRef.current.rotation.y = THREE.MathUtils.lerp(systemGroupRef.current.rotation.y, -0.15 + state.pointer.x * 0.15, 0.05);
    }

    // Meteor Flight & Collision Logic
    const m1 = meteor1.current;
    const m2 = meteor2.current;

    // Orient a meteor group so its local +Y (tail base → head) points along travel.
    const alignToVelocity = (grp: THREE.Group, vx: number, vy: number, vz: number) => {
      const len = Math.hypot(vx, vy, vz) || 1;
      _up.set(0, 1, 0);
      _dir.set(vx / len, vy / len, vz / len);
      grp.quaternion.setFromUnitVectors(_up, _dir);
    };

    if (m1.active) {
      m1.x += m1.vx; m1.y += m1.vy; m1.z += m1.vz;
      if (m1Ref.current) {
        m1Ref.current.position.set(m1.x, m1.y, m1.z);
        alignToVelocity(m1Ref.current, m1.vx, m1.vy, m1.vz);
        m1Ref.current.visible = true;
      }
    } else {
      if (m1Ref.current) m1Ref.current.visible = false;
    }

    if (m2.active) {
      m2.x += m2.vx; m2.y += m2.vy; m2.z += m2.vz;
      if (m2Ref.current) {
        m2Ref.current.position.set(m2.x, m2.y, m2.z);
        alignToVelocity(m2Ref.current, m2.vx, m2.vy, m2.vz);
        m2Ref.current.visible = true;
      }
    } else {
      if (m2Ref.current) m2Ref.current.visible = false;
    }

    if (m1.active && m2.active) {
      const dx = m1.x - m2.x;
      const dy = m1.y - m2.y;
      const dz = m1.z - m2.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

      if (dist < 0.35) {
        triggerExplosion((m1.x + m2.x) / 2, (m1.y + m2.y) / 2, (m1.z + m2.z) / 2);
        m1.active = false;
        m2.active = false;
        m1.delay = 0;
        m2.delay = 0;
      }
    } else {
      m1.delay += 1;
      if (m1.delay > 140) {
        calculateCollisionTrajectory();
      }
    }

    // Update Sparkles
    const s = sparklesRef.current;
    const geom = sparklesPointsRef.current?.geometry;
    if (geom && s.activeCount > 0) {
      const posAttr = geom.attributes.position;
      const colAttr = geom.attributes.color;
      let aliveCount = 0;

      for (let i = 0; i < s.activeCount; i++) {
        if (s.data[i].life > 0) {
          s.positions[i * 3] += s.data[i].vx;
          s.positions[i * 3 + 1] += s.data[i].vy;
          s.positions[i * 3 + 2] += s.data[i].vz;

          s.data[i].vy -= 0.0002;
          s.data[i].vx *= 0.98;
          s.data[i].vy *= 0.98;
          s.data[i].vz *= 0.98;

          s.data[i].life -= s.data[i].decay;
          aliveCount++;
        } else {
          s.positions[i * 3] = 9999;
        }

        posAttr.setXYZ(i, s.positions[i * 3], s.positions[i * 3 + 1], s.positions[i * 3 + 2]);
        if (colAttr) {
          colAttr.setXYZ(i, s.colors[i * 3], s.colors[i * 3 + 1], s.colors[i * 3 + 2]);
        }
      }

      posAttr.needsUpdate = true;
      if (colAttr) colAttr.needsUpdate = true;
      if (aliveCount === 0) s.activeCount = 0;
    }

    // --- Selfie droid: bobs near center, always visible doing peace sign ---
    if (selfieAlienRef.current) {
      const st = state.clock.getElapsedTime();
      selfieAlienRef.current.position.set(
        5.5 + Math.sin(st * 0.4) * 0.3,
        -0.5 + Math.sin(st * 0.7) * 0.2,
        -2 + Math.sin(st * 0.5) * 0.15
      );
      // Slowly rotate to face camera
      selfieAlienRef.current.rotation.y = Math.sin(st * 0.3) * 0.3;
    }
  });

  return (
    <group ref={systemGroupRef} rotation={[0.35, -0.15, 0]}>
      {/* 1. Orbit lines */}
      {displayPlanets.map((p) => (
        <OrbitLine key={`orbit-${p.name}`} radius={p.orbitRadius} />
      ))}

      {/* 3. Planets & their Moons */}
      {displayPlanets.map((p) => (
        <PlanetMesh key={p.name} planet={p} />
      ))}

      {/* 4. Flying Meteors/Asteroids (Ulka Pind) — glowing heads + fiery tails */}
      {/* <group ref={m1Ref}>
        <Meteor headColor={three.color || '#ff9d5c'} tailColor={three.color || '#ff5c7f'} />
      </group>
      <group ref={m2Ref}>
        <Meteor headColor={three.emissive || '#8fd3ff'} tailColor={three.emissive || '#00e5ff'} />
      </group> */}

      {/* 5. Interactive Flying Droids */}
      <FlyingDroid id={1} color="#39ff14" onExplode={triggerExplosion} pose="dancing" mouseWorld={mouseWorld} onUpdatePosition={(x, y, z, active) => updateDroidPosition(1, x, y, z, active)} />
      <FlyingDroid id={2} color="#ff007f" onExplode={triggerExplosion} pose="driving" mouseWorld={mouseWorld} onUpdatePosition={(x, y, z, active) => updateDroidPosition(2, x, y, z, active)} />
      <FlyingDroid id={3} color="#00e5ff" onExplode={triggerExplosion} pose="saluting" mouseWorld={mouseWorld} onUpdatePosition={(x, y, z, active) => updateDroidPosition(3, x, y, z, active)} />
      <FlyingDroid id={4} color="#ffd700" onExplode={triggerExplosion} pose="none" mouseWorld={mouseWorld} onUpdatePosition={(x, y, z, active) => updateDroidPosition(4, x, y, z, active)} />

      {/* Selfie droid — floats near center doing peace sign */}
      <group ref={selfieAlienRef} scale={1.6}>
        <DroidCharacter pose="selfie" />
      </group>

      {/* 7. Occasional Shooting Stars (Toota Tara) */}
      <ShootingStar id={1} planetColliders={displayPlanets} droidColliders={droidPositions} onExplode={triggerExplosion} />
      <ShootingStar id={2} planetColliders={displayPlanets} droidColliders={droidPositions} onExplode={triggerExplosion} />
      <ShootingStar id={3} planetColliders={displayPlanets} droidColliders={droidPositions} onExplode={triggerExplosion} />

      {/* 6. Sparkles points */}
      <points ref={sparklesPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparklesRef.current.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[sparklesRef.current.colors, 3]} />
        </bufferGeometry>
        <PointMaterial size={0.035} sizeAttenuation transparent vertexColors depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* 8. Occasional comet crossing the screen */}
      <Comet />

      {/* 9. Click detector for space background */}
      <mesh
        position={[0, 0, 0.5]}
        visible={false}
        onPointerDown={(e) => {
          e.stopPropagation();
          triggerExplosion(e.point.x, e.point.y, e.point.z);
        }}
      >
        <planeGeometry args={[20, 20]} />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  const { designId, theme } = useTheme();
  const { three } = theme;

  // Ambient space hum — plays only for cosmic theme, stops on unmount
  useEffect(() => {
    if (designId !== 'cosmic') return;
    const stopHum = startSpaceHum(0.006);
    return () => stopHum();
  }, [designId]);

  return (
    <Canvas
      key={theme.id}
      camera={{ position: [0, 2.0, 5.8], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      shadows
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={0.6} color={three.emissive || '#ffaa00'} decay={1.5} distance={20} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} color="#ffffff" />
      
      <Suspense fallback={null}>
        {designId === 'cosmic' ? (
          <>
            <CleanSpaceScene />
            {/* Disabled EffectComposer for buttery smooth 60+ FPS performance on all devices */}
            {/* <EffectComposer>
              <Bloom
                intensity={0.35}
                luminanceThreshold={0.5}
                luminanceSmoothing={0.85}
                mipmapBlur
              />
              <Vignette eskil={false} offset={0.1} darkness={0.55} />
            </EffectComposer> */}
          </>
        ) : (
          <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
            <ShapeMesh three={three} />
          </Float>
        )}
        
        {/* Twinkling starfield and bright 3D stars (reduced count for better performance) */}
        <Starfield count={5000} />
        <BrightStars />
      </Suspense>
    </Canvas>
  );
}
