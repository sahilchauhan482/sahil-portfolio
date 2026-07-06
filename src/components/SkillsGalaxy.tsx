'use client';

import { Suspense, useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { skills } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';

// =========================================================================
//  3D Skills Galaxy — interactive orbiting skill planets with click detail
// =========================================================================

interface SkillPlanet {
  group: string;
  items: string[];
  orbitRadius: number;
  size: number;
  color: string;
  speed: number;
  phase: number;
}

function buildPlanets(): SkillPlanet[] {
  const colors = ['#39ff14', '#ff2a6d', '#05d9e8', '#b967ff', '#fffa37'];
  return skills.map((g, i) => ({
    group: g.group,
    items: g.items,
    orbitRadius: 1.4 + i * 1.1,
    size: 0.18 + (g.items.length / 12) * 0.15,
    color: colors[i % colors.length],
    speed: 0.15 + Math.random() * 0.1,
    phase: Math.random() * Math.PI * 2,
  }));
}

function Planet({ planet, onHover, onClick }: {
  planet: SkillPlanet;
  onHover: (group: string | null) => void;
  onClick: (planet: SkillPlanet) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() * planet.speed + planet.phase;
    groupRef.current.position.x = Math.cos(t) * planet.orbitRadius;
    groupRef.current.position.z = Math.sin(t) * planet.orbitRadius;
    groupRef.current.position.y = Math.sin(t * 0.7 + planet.phase) * 0.2;

    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
      const pulse = 1 + Math.sin(t * 3) * 0.06;
      meshRef.current.scale.setScalar(hovered ? 1.35 : pulse);
    }
  });

  const orbitPoints = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      pts.push(Math.cos(theta) * planet.orbitRadius);
      pts.push(Math.sin(theta * 0.7) * 0.1);
      pts.push(Math.sin(theta) * planet.orbitRadius);
    }
    return pts;
  }, [planet.orbitRadius]);

  return (
    <group ref={groupRef}>
      {/* Orbit line */}
      <Line
        points={orbitPoints}
        color={planet.color}
        opacity={0.18}
        transparent
        lineWidth={0.5}
      />

      {/* Glowing planet */}
      <mesh
        ref={meshRef}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); onHover(planet.group); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={(e) => { e.stopPropagation(); setHovered(false); onHover(null); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); onClick(planet); }}
      >
        <sphereGeometry args={[planet.size, 24, 24]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={hovered ? 0.9 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[planet.size * 1.8, 16, 16]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={hovered ? 0.2 : 0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SkillsGalaxyCanvas({ onPlanetHover, onPlanetClick }: {
  onPlanetHover: (group: string | null) => void;
  onPlanetClick: (planet: SkillPlanet) => void;
}) {
  const planets = useMemo(() => buildPlanets(), []);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 2, 0]} intensity={0.8} color="#ffffff" />
      {planets.map((p, i) => (
        <Planet key={p.group} planet={p} onHover={onPlanetHover} onClick={onPlanetClick} />
      ))}
    </group>
  );
}

export default function SkillsGalaxy() {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillPlanet | null>(null);

  const handlePlanetHover = useCallback((group: string | null) => {
    setHoveredGroup(group);
  }, []);

  const handlePlanetClick = useCallback((planet: SkillPlanet) => {
    setSelectedSkill(prev => prev?.group === planet.group ? null : planet);
  }, []);

  return (
    <section id="skills" aria-labelledby="skills-heading" className="section">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-3 font-mono text-sm uppercase tracking-[0.2em] text-accent-cyan text-center"
      >
        Skills Galaxy
      </motion.p>
      <motion.h2
        id="skills-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-display text-3xl font-bold sm:text-4xl text-center"
      >
        Technologies I work with
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-2 text-center text-sm text-ink-faint transition-colors duration-300"
      >
        {hoveredGroup ? `🪐 ${hoveredGroup} — click the planet!` : 'Hover & click a planet to explore'}
      </motion.p>

      {/* 3D Galaxy Canvas */}
      <div className="relative mt-8 h-[420px] w-full overflow-hidden rounded-3xl glass cursor-default">
        <Canvas
          camera={{ position: [0, 1.5, 5.5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <SkillsGalaxyCanvas onPlanetHover={handlePlanetHover} onPlanetClick={handlePlanetClick} />
          </Suspense>
        </Canvas>
      </div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 mx-auto max-w-md glass rounded-2xl p-6 text-center relative"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-3 right-3 rounded-lg p-1 text-ink-muted hover:bg-white/5 hover:text-ink transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Color dot */}
            <span
              className="inline-block mb-3 h-4 w-4 rounded-full"
              style={{ backgroundColor: selectedSkill.color, boxShadow: `0 0 16px ${selectedSkill.color}60` }}
            />
            <h3 className="font-display text-xl font-bold text-ink">{selectedSkill.group}</h3>
            <p className="mt-1 text-xs text-ink-faint">{selectedSkill.items.length} technologies</p>

            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {selectedSkill.items.map((item) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-full border px-3.5 py-1.5 text-sm font-medium"
                  style={{
                    borderColor: `${selectedSkill.color}40`,
                    color: selectedSkill.color,
                    backgroundColor: `${selectedSkill.color}10`,
                  }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traditional card list fallback */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((cat, i) => (
          <motion.div
            key={cat.group}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] } as any}
          >
            <div className={`glass h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              hoveredGroup === cat.group ? 'ring-2 ring-accent-cyan/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]' : ''
            }`}
              onClick={() => {
                const planet = buildPlanets().find(p => p.group === cat.group);
                if (planet) handlePlanetClick(planet);
              }}
            >
              <h3 className="mb-4 font-display text-lg font-semibold text-ink">
                {cat.group}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
